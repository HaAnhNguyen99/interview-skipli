const crypto = require("crypto");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendSMS } = require("../services/smsService");
const db = require("../services/firebaseService");
const { sendMail } = require("../services/mailService");

// Create access code for phone number
exports.createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const docRef = admin.firestore().collection("managers").doc(phoneNumber);
  const doc = await docRef.get();
  if (!doc.exists) {
    return res.status(400).json({
      success: false,
      msg: "Phone number is not registered as manager!",
    });
  }

  const accessCodeDoc = await db
    .collection("accessCodes")
    .doc(phoneNumber)
    .get();
  if (accessCodeDoc.exists) {
    const data = accessCodeDoc.data();
    if (Date.now() - data.createdAt < 300000) {
      return res.status(400).json({
        success: false,
        msg: "Access code already sent, please check your SMS or wait 5 minutes to request a new one.",
      });
    }
  }

  await db
    .collection("accessCodes")
    .doc(phoneNumber)
    .set({ code, createdAt: Date.now() });

  try {
    // await sendSMS(phoneNumber, `Your Skipli access code is: ${code}`);
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send SMS", error: err });
  }
};

// Validate access code
exports.validateAccessCode = async (req, res) => {
  const { phoneNumber, accessCode } = req.body;
  const doc = await db.collection("accessCodes").doc(phoneNumber).get();
  if (!doc.exists)
    return res.status(404).json({ success: false, msg: "No code found" });

  const { code } = doc.data();
  if (code !== accessCode)
    return res.status(400).json({ success: false, msg: "Invalid code" });

  // Xóa code
  await db.collection("accessCodes").doc(phoneNumber).delete();

  const role = process.env.ROLE_MANAGER;
  const payload = { phoneNumber, role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({
    success: true,
    phoneNumber,
    role,
    token,
  });
};

// Resend access code
exports.resendAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;

  const docRef = admin.firestore().collection("managers").doc(phoneNumber);
  const doc = await docRef.get();
  if (!doc.exists) {
    return res.status(400).json({
      success: false,
      msg: "Phone number is not registered as manager!",
    });
  }

  // Lấy access code hiện tại
  const accessCodeDoc = await db
    .collection("accessCodes")
    .doc(phoneNumber)
    .get();

  let code;
  let createdAt;

  if (accessCodeDoc.exists) {
    const data = accessCodeDoc.data();
    code = data.code;
    createdAt = data.createdAt;

    if (Date.now() - createdAt < 5 * 60 * 1000) {
      try {
        // await sendSMS(phoneNumber, `Your Skipli access code is: ${code}`);
        return res.json({ success: true, msg: "Resent existing access code!" });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to resend SMS",
          error: err,
        });
      }
    }
  }

  // Tạo code mới nếu chưa có hoặc đã hết hạn
  code = Math.floor(100000 + Math.random() * 900000).toString();
  createdAt = Date.now();

  await db.collection("accessCodes").doc(phoneNumber).set({ code, createdAt });

  try {
    // await sendSMS(phoneNumber, `Your new Skipli access code is: ${code}`);
    res.json({ success: true, msg: "Generated and sent new access code!" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send SMS", error: err });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, email, phoneNumber, role } = req.body;
  try {
    // 1. Tạo setupToken
    const setupToken = crypto.randomBytes(32).toString("hex");

    // 2. Kiểm tra email đã tồn tại chưa
    const emailSnapshot = await db
      .collection("employees")
      .where("email", "==", email)
      .get();
    if (!emailSnapshot.empty) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    // 2. Tạo employee mới với setupToken
    const newDoc = db.collection("employees").doc();
    await newDoc.set({
      name,
      email,
      phoneNumber,
      role,
      setupToken,
      createdAt: Date.now(),
    });

    // 3. Tạo link FE cho employee setup tài khoản
    const feUrl = process.env.FE_URL || "http://localhost:5173";
    const setupLink = `${feUrl}/employee/setup?token=${setupToken}&id=${newDoc.id}`;

    // 4. Gửi email cho employee (có kèm link)
    await sendMail(
      email,
      "Welcome to Skipli!",
      ` You have been added to the system.
        Email: ${email}
        Role: ${role}

        Please click the link below to set your password: ${setupLink}
      `
    );

    res.json({ success: true, employeeId: newDoc.id });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    await db.collection("employees").doc(employeeId).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// Get all employees with pagination
exports.getAllEmployees = async (req, res) => {
  try {
    // Lấy param phân trang
    const page = parseInt(req.query["pagination[page]"]) || 1;
    const pageSize = parseInt(req.query["pagination[pageSize]"]) || 10;
    const offset = (page - 1) * pageSize;

    const snapshot = await db
      .collection("employees")
      .orderBy("createdAt", "desc")
      .get();
    const allDocs = snapshot.docs;

    // Cắt mảng theo page/pageSize
    const docs = allDocs.slice(offset, offset + pageSize);

    const employeesWithId = docs.map((doc) => {
      const employee = doc.data();
      let status = employee.setupToken ? "inactive" : "active";
      const { passwordHash, username, ...employeeWithoutSensitive } = employee;
      return {
        id: doc.id,
        ...employeeWithoutSensitive,
        status,
      };
    });

    res.json({
      success: true,
      employees: employeesWithId,
      page,
      pageSize,
      total: allDocs.length,
      totalPages: Math.ceil(allDocs.length / pageSize),
      hasMore: offset + pageSize < allDocs.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// Get employee information
exports.getEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const doc = await db.collection("employees").doc(employeeId).get();
  if (!doc.exists)
    return res.status(404).json({ success: false, msg: "Not found" });
  res.json(doc.data());
};

exports.setupEmployeeAccount = async (req, res) => {
  const { token, username, password } = req.body;

  // 1. Tìm employee theo token (token này phải lưu vào DB khi tạo employee)
  const employee = await db
    .collection("employees")
    .findOne({ setupToken: token });
  if (!employee)
    return res
      .status(400)
      .json({ success: false, msg: "Invalid or expired token" });

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Update DB: lưu username, passwordHash, xoá setupToken (không dùng lại)
  await db.collection("employees").updateOne(
    { setupToken: token },
    {
      $set: { username, passwordHash },
      $unset: { setupToken: "" },
    }
  );

  res.json({ success: true });
};

// POST /api/employee-login
exports.employeeLogin = async (req, res) => {
  const { username, password } = req.body;

  // Tìm document có username trùng khớp
  const snapshot = await db
    .collection("employees")
    .where("username", "==", username)
    .get();

  if (snapshot.empty)
    return res.status(400).json({ success: false, msg: "User not found" });

  // Lấy document đầu tiên
  const doc = snapshot.docs[0];
  const employee = doc.data();

  // Kiểm tra password
  const match = await bcrypt.compare(password, employee.passwordHash);
  if (!match)
    return res.status(400).json({ success: false, msg: "Invalid password" });

  // Tạo JWT cho employee
  const token = jwt.sign(
    { employeeId: doc.id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    employeeId: doc.id,
    role: employee.role,
  });
};

// POST /api/employee-setup
exports.setupEmployeeAccount = async (req, res) => {
  const { employeeId, username, password } = req.body;
  // Tìm employee theo employeeId, có thể xác thực setupToken nếu muốn bảo mật hơn

  try {
    const docRef = admin.firestore().collection("employees").doc(employeeId);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update Firestore: set username, passwordHash, xoá setupToken
    await docRef.update({
      username,
      passwordHash,
      setupToken: admin.firestore.FieldValue.delete(),
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { name, email, phoneNumber, role } = req.body;
  await db.collection("employees").doc(employeeId).update({
    name,
    email,
    phoneNumber,
    role,
  });
  res.json({ success: true });
};
