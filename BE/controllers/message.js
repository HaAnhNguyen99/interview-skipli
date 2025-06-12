const db = require("../services/firebaseService");
exports.sendMessage = async (req, res) => {
  const { from, to, content } = req.body;
  try {
    const newMsgRef = db.collection("messages").doc();
    await newMsgRef.set({
      from,
      to,
      content,
      timestamp: Date.now(),
      read: false,
    });
    res.json({ success: true, id: newMsgRef.id });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getMessages = async (req, res) => {
  const { from, to } = req.query;
  try {
    const snapshot = await db
      .collection("messages")
      .where("from", "in", [from, to])
      .where("to", "in", [from, to])
      .orderBy("timestamp", "asc")
      .get();
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getAllEmployeesWithMessages = async (req, res) => {
  try {
    const snapshot = await db.collection("employees").get();
    const docs = snapshot.docs;

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
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};
