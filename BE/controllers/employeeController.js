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

  // Save access code to DB...
  await db
    .collection("accessCodes")
    .doc(phoneNumber)
    .set({ code, createdAt: Date.now() });

  // Send SMS with Vonage
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

  console.log("Request phone number: ", phoneNumber);

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

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, email, department } = req.body;
  try {
    // 1. Tạo setupToken
    const setupToken = crypto.randomBytes(32).toString("hex");

    // 2. Tạo employee mới với setupToken
    const newDoc = db.collection("employees").doc();
    await newDoc.set({
      name,
      email,
      department,
      createdAt: Date.now(),
      setupToken, // LƯU TOKEN vào DB để sau xác thực link
      role: "employee",
    });

    // 3. Tạo link FE cho employee setup tài khoản
    const feUrl = process.env.FE_URL || "http://localhost:5173";
    const setupLink = `${feUrl}/employee-setup?token=${setupToken}&id=${newDoc.id}`;

    // 4. Gửi email cho employee (có kèm link)
    await sendMail(
      email,
      "Welcome to Skipli!",
      ` You have been added to the system.
        Email: ${email}
        Department: ${department}

        Please click the link below to set your password: ${setupLink}
      `
    );

    // 5. Trả về FE
    res.json({ success: true, employeeId: newDoc.id });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  const { employeeId } = req.body;
  await db.collection("employees").doc(employeeId).delete();
  res.json({ success: true });
};

// Get employee information
exports.getEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const doc = await db.collection("employees").doc(employeeId).get();
  if (!doc.exists)
    return res.status(404).json({ success: false, msg: "Not found" });
  res.json(doc.data());
};

async function setupEmployeeAccount(req, res) {
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
}

// POST /api/employee-login
async function employeeLogin(req, res) {
  const { username, password } = req.body;
  const employee = await db.collection("employees").findOne({ username });
  if (!employee)
    return res.status(400).json({ success: false, msg: "User not found" });

  // Kiểm tra password
  const match = await bcrypt.compare(password, employee.passwordHash);
  if (!match)
    return res.status(400).json({ success: false, msg: "Invalid password" });

  // Tạo JWT cho employee
  const token = jwt.sign(
    { employeeId: employee.employeeId, role: "employee" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    employeeId: employee.employeeId,
    role: "employee",
  });
}

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
      setupToken: admin.firestore.FieldValue.delete(), // Xoá setupToken nếu có
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
