const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");

/**
 * @route   POST /api/create-new-access-code
 * @desc    Tạo mã truy cập (6 số ngẫu nhiên), lưu vào DB gắn với số điện thoại, dùng để xác thực đăng nhập bước đầu cho Manager/Owner
 * @body    { phoneNumber: "SỐ ĐIỆN THOẠI" }
 * @return  { success: true, code: "123456" }
 */
router.post("/create-new-access-code", controller.createNewAccessCode);

/**
 * @route   POST /api/validate-access-code
 * @desc    Kiểm tra mã truy cập vừa nhập có khớp với DB không (theo số điện thoại). Nếu đúng thì xoá mã truy cập đó.
 * @body    { phoneNumber: "SỐ ĐIỆN THOẠI", accessCode: "123456" }
 * @return  { success: true } nếu đúng, ngược lại trả về { success: false, msg: "..."}
 */
router.post("/validate-access-code", controller.validateAccessCode);

/**
 * @route   POST /api/create-employee
 * @desc    Tạo mới một nhân viên, lưu vào collection "employees". Sau khi tạo sẽ gửi email cho nhân viên.
 * @body    { name: "Tên nhân viên", email: "Email", department: "Phòng ban" }
 * @return  { success: true, employeeId: "id mới" }
 */
router.post("/create-employee", controller.createEmployee);

/**
 * @route   POST /api/delete-employee
 * @desc    Xoá nhân viên khỏi collection "employees" dựa vào employeeId.
 * @body    { employeeId: "ID nhân viên" }
 * @return  { success: true }
 */
router.post("/delete-employee", controller.deleteEmployee);

/**
 * @route   POST /api/get-employee
 * @desc    Lấy thông tin một nhân viên theo employeeId (ví dụ dùng cho profile/detail).
 * @body    { employeeId: "ID nhân viên" }
 * @return  { name, email, department, ... }
 */
router.post("/get-employee", controller.getEmployee);

module.exports = router;
