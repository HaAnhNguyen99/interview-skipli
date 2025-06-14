const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/employeeController");
const { authMiddleware } = require("../middleware/auth");
const { managerOnly } = require("../middleware/role");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @route   POST /api/create-new-access-code
 * @desc    Generate a random 6-digit access code, save it in the DB linked to the phone number,
 *          used for the first-step login verification for Manager/Owner.
 * @body    { phoneNumber: "PHONE NUMBER" }
 * @return  { success: true, code: "123456" }
 */
router.post("/create-new-access-code", controller.createNewAccessCode);

/**
 * @route   POST /api/validate-access-code
 * @desc    Validate if the access code entered matches what's stored in the DB (by phone number).
 *          If valid, the code is deleted, returns success with token and role.
 * @body    { phoneNumber: "PHONE NUMBER", accessCode: "123456" }
 * @return  { success: true, phoneNumber, token, role }
 */
router.post("/validate-access-code", controller.validateAccessCode);

/**
 * @route   POST /api/create-employee
 * @desc    Create a new employee and save to the "employees" collection.
 *          After creation, send an email to the employee.
 * @body    { name: "Employee Name", email: "Email", phoneNumber: "Phone Number", role: "Role" }
 * @return  { success: true, employeeId: "new id" }
 */
router.post(
  "/create-employee",
  authMiddleware,
  managerOnly,
  controller.createEmployee
);

/**
 * @route   POST /api/delete-employee
 * @desc    Delete an employee from the "employees" collection by employeeId.
 * @body    { employeeId: "EMPLOYEE ID" }
 * @return  { success: true }
 */
router.post(
  "/delete-employee",
  authMiddleware,
  managerOnly,
  controller.deleteEmployee
);

/**
 * @route   GET /api/get-all-employees
 * @desc    Get all employees' information.
 * @return  { success: true, employees: [{ name, email, phoneNumber, role, ... }] }
 */
router.get("/get-all-employees", authMiddleware, controller.getAllEmployees);

/**
 * @route   GET /api/get-employee
 * @desc    Get an employee's information by employeeId (for profile/detail, etc).
 * @body    { employeeId: "EMPLOYEE ID" }
 * @return  { name, email, phoneNumber, role, ... }
 */
router.get(
  "/get-employee",
  authMiddleware,
  managerOnly,
  controller.getEmployee
);

/**
 * @route   POST /api/setup-employee
 * @desc    Employee sets up their account (username, password) using the token/link from email.
 * @body    { employeeId: "ID", token: "TOKEN", username: "USERNAME", password: "PASSWORD" }
 */
router.post("/setup-employee", controller.setupEmployeeAccount);

/**
 * @route   POST /api/login-employee
 * @desc    Employee login using username and password.
 *          Returns a JWT token if successful.
 * @body    { username: "USERNAME", password: "PASSWORD" }
 * @return  { success: true, employeeId, role, token }
 */
router.post("/login-employee", controller.employeeLogin);

/**
 * @route   POST /api/employee-delete
 * @desc    Delete an employee from the "employees" collection by employeeId.
 * @body    { employeeId: "EMPLOYEE ID" }
 * @return  { success: true }
 */
router.delete(
  "/employee-delete/:employeeId",
  authMiddleware,
  managerOnly,
  controller.deleteEmployee
);

/**
 * @route   POST /api/employee-update
 * @desc    Update an employee's information by employeeId.
 * @body    { employeeId: "EMPLOYEE ID", name: "Employee Name", email: "Email", phoneNumber: "Phone Number", role: "Role" }
 * @return  { success: true }
 */
router.put(
  "/employee-update/:employeeId",
  authMiddleware,
  controller.updateEmployee
);

/**
 * @route   POST /api/resend-access-code
 * @desc    Resend access code to the employee's phone number.
 * @body    { phoneNumber: "PHONE NUMBER" }
 * @return  { success: true, msg: "Resent existing access code!" }
 */
router.post("/resend-access-code", controller.resendAccessCode);

/**
 * @route   POST /api/upload-image
 * @desc    Upload an image to Cloudinary.
 * @body    { file: "IMAGE" }
 * @return  { success: true, url: "IMAGE URL" }
 */
router.post(
  "/upload-image",
  authMiddleware,
  upload.single("file"),
  controller.uploadImage
);

/**
 * @route   GET /api/get-manager-info
 * @desc    Get manager's information.
 * @return  { success: true, manager: { name, phoneNumber, avatarUrl } }
 */
router.get("/get-manager-info", authMiddleware, controller.getManagerInfo);

/**
 * @route   POST /api/update-manager-info
 * @desc    Update manager's information.
 * @body    { phoneNumber: "PHONE NUMBER", email: "EMAIL" }
 * @return  { success: true }
 */
router.post(
  "/update-manager-info",
  authMiddleware,
  controller.updateManagerInfo
);

/**
 * @route   POST /api/update-manager-avatar
 * @desc    Update manager's avatar.
 * @body    { file: "IMAGE" }
 * @return  { success: true }
 */
router.post(
  "/update-manager-avatar",
  authMiddleware,
  upload.single("file"),
  controller.updateManagerAvatar
);

module.exports = router;
