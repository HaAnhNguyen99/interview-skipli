const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");
const { authMiddleware } = require("../middleware/auth");
const { managerOnly } = require("../middleware/role");

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
 * @body    { name: "Employee Name", email: "Email", department: "Department" }
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
 * @route   POST /api/get-employee
 * @desc    Get an employee's information by employeeId (for profile/detail, etc).
 * @body    { employeeId: "EMPLOYEE ID" }
 * @return  { name, email, department, ... }
 */
router.post(
  "/get-employee",
  authMiddleware,
  managerOnly,
  controller.getEmployee
);

module.exports = router;
