const db = require("../services/firebaseService");
const { sendMail } = require("../services/mailService");

// Tạo access code cho số điện thoại
exports.createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await db
    .collection("accessCodes")
    .doc(phoneNumber)
    .set({ code, createdAt: Date.now() });

  // TODO: Tích hợp gửi SMS
  res.json({ success: true, code }); // Test mode: trả code ra luôn
};

// Xác thực access code
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
  res.json({ success: true });
};

// Tạo mới employee
exports.createEmployee = async (req, res) => {
  const { name, email, department } = req.body;
  const newDoc = db.collection("employees").doc();
  await newDoc.set({ name, email, department, createdAt: Date.now() });

  // Gửi email cho employee
  await sendMail(
    email,
    "Welcome!",
    `Bạn đã được thêm vào hệ thống. Email: ${email}`
  );

  res.json({ success: true, employeeId: newDoc.id });
};

// Xoá employee
exports.deleteEmployee = async (req, res) => {
  const { employeeId } = req.body;
  await db.collection("employees").doc(employeeId).delete();
  res.json({ success: true });
};

// Lấy thông tin employee
exports.getEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const doc = await db.collection("employees").doc(employeeId).get();
  if (!doc.exists)
    return res.status(404).json({ success: false, msg: "Not found" });
  res.json(doc.data());
};
