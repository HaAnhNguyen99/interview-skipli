const jwt = require("jsonwebtoken");

// Middleware xác thực JWT, lấy role/phoneNumber từ token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ success: false, msg: "Missing token" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, msg: "Invalid token" });
  }
}

module.exports = { authMiddleware };
