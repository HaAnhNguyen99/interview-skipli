const crypto = require("crypto");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendSMS } = require("../services/smsService");
const db = require("../services/firebaseService");
const { sendMail } = require("../services/mailService");
const { uploadImage } = require("../services/imageService");

exports.createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("access code: ", code);
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
    await sendSMS(phoneNumber, `Your Skipli access code is: ${code}`);
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send SMS", error: err });
  }
};

exports.validateAccessCode = async (req, res) => {
  const { phoneNumber, accessCode } = req.body;
  const doc = await db.collection("accessCodes").doc(phoneNumber).get();
  console.log(doc.data());
  if (!doc.exists)
    return res.status(404).json({ success: false, msg: "No code found" });

  const { code } = doc.data();
  if (code !== accessCode)
    return res.status(400).json({ success: false, msg: "Invalid code" });

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
        await sendSMS(phoneNumber, `Your Skipli access code is: ${code}`);
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

  code = Math.floor(100000 + Math.random() * 900000).toString();
  createdAt = Date.now();

  await db.collection("accessCodes").doc(phoneNumber).set({ code, createdAt });

  try {
    await sendSMS(phoneNumber, `Your new Skipli access code is: ${code}`);
    res.json({ success: true, msg: "Generated and sent new access code!" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send SMS", error: err });
  }
};

exports.createEmployee = async (req, res) => {
  const { name, email, phoneNumber, role } = req.body;
  try {
    const setupToken = crypto.randomBytes(32).toString("hex");

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

    const newDoc = db.collection("employees").doc();
    await newDoc.set({
      name,
      email,
      phoneNumber,
      role,
      setupToken,
      avatarUrl: "https://avatar.iran.liara.run/public/28",
      createdAt: Date.now(),
      status: "inactive",
    });

    const feUrl = process.env.FE_URL || "http://localhost:5173";
    const setupLink = `${feUrl}/employee/setup?token=${setupToken}&id=${newDoc.id}`;

    await sendMail(
      email,
      "Welcome to Skipli!",
      `You have been added to the system.
      Email: ${email}
      Role: ${role}
      Please click the link below to set your password: ${setupLink} `
    );

    res.json({ success: true, employeeId: newDoc.id });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    await db.collection("employees").doc(employeeId).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query["pagination[page]"]) || 1;
    const pageSize = parseInt(req.query["pagination[pageSize]"]) || 10;
    const offset = (page - 1) * pageSize;

    const snapshot = await db
      .collection("employees")
      .orderBy("createdAt", "desc")
      .get();
    const allDocs = snapshot.docs;

    const docs = allDocs.slice(offset, offset + pageSize);

    const employeesWithId = docs.map((doc) => {
      const employee = doc.data();

      const { passwordHash, username, ...employeeWithoutSensitive } = employee;
      return {
        id: doc.id,
        ...employeeWithoutSensitive,
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

exports.getEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const doc = await db.collection("employees").doc(employeeId).get();
  if (!doc.exists)
    return res.status(404).json({ success: false, msg: "Not found" });
  res.json(doc.data());
};

exports.employeeLogin = async (req, res) => {
  const { username, password } = req.body;

  const snapshot = await db
    .collection("employees")
    .where("username", "==", username)
    .get();

  if (snapshot.empty)
    return res.status(400).json({ success: false, msg: "User not found" });

  const doc = snapshot.docs[0];
  const employee = doc.data();

  snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
  });

  const match = await bcrypt.compare(password, employee.passwordHash);

  if (!match)
    return res.status(400).json({ success: false, msg: "Invalid password" });

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
    name: employee.name,
    email: employee.email,
    avatarUrl: employee.avatarUrl,
    phoneNumber: employee.phoneNumber,
  });
};
exports.setupEmployeeAccount = async (req, res) => {
  const { employeeId, username, password, token } = req.body;

  try {
    const usernameSnap = await db
      .collection("employees")
      .where("username", "==", username)
      .get();

    if (!usernameSnap.empty) {
      return res.status(400).json({
        success: false,
        msg: "Username already exists. Please choose another one.",
      });
    }

    const empDocRef = db.collection("employees").doc(employeeId);
    const empDoc = await empDocRef.get();

    if (!empDoc.exists || empDoc.data().setupToken !== token) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await empDocRef.update({
      username: username,
      passwordHash: passwordHash,
      setupToken: admin.firestore.FieldValue.delete(),
      status: "active",
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { name, email, phoneNumber, role } = req.body;
  await db.collection("employees").doc(employeeId).update({
    name,
    email,
    phoneNumber,
    role,
  });
  res.json({ success: true, employee: { name, email, phoneNumber, role } });
};

exports.uploadImage = async (req, res) => {
  const userID = req.user?.employeeId;
  if (!req.file) {
    return res.status(400).json({ success: false, msg: "No file uploaded" });
  }

  try {
    const url = await uploadImage(req.file);
    if (!url) {
      return res.status(500).json({ success: false, msg: "Upload failed" });
    }

    if (userID) {
      await db.collection("employees").doc(userID).update({ avatarUrl: url });
    }
    // get user information from database
    const userDoc = await db.collection("employees").doc(userID).get();
    const { passwordHash, username, status, ...filteredUserDocs } =
      userDoc.data();
    res.json({
      success: true,
      user: { employeeId: userID, ...filteredUserDocs },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};
