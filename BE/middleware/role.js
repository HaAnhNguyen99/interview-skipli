function managerOnly(req, res, next) {
  if (!req.user || req.user.role !== "manager") {
    return res.status(403).json({ msg: "Only manager can do this!" });
  }
  next();
}

module.exports = { managerOnly };
