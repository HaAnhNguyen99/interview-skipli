const db = require("../services/firebaseService");

// GET /api/tasks/:taskId
exports.getTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const doc = await db.collection("tasks").doc(taskId).get();
    if (!doc.exists)
      return res.status(404).json({ success: false, msg: "Task not found" });
    res.json({ success: true, task: { id: doc.id, ...doc.data() } });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const { assignedTo, status } = req.query;
  try {
    let query = db.collection("tasks");
    if (assignedTo) query = query.where("assignedTo", "==", assignedTo);
    if (status) query = query.where("status", "==", status);
    query = query.orderBy("createdAt", "desc");
    const snapshot = await query.get();

    const tasks = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let assignedToObj = null;

        if (data.assignedTo) {
          const empDoc = await db
            .collection("employees")
            .doc(data.assignedTo)
            .get();
          if (empDoc.exists) {
            const empData = empDoc.data();
            assignedToObj = {
              id: empDoc.id,
              name: empData.name,
              email: empData.email,
              role: empData.role,
              phoneNumber: empData.phoneNumber,
              username: empData.username,
            };
          }
        }

        return {
          id: doc.id,
          ...data,
          assignedTo: assignedToObj,
        };
      })
    );

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// DELETE /api/tasks/:taskId
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    await db.collection("tasks").doc(taskId).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// PUT /api/tasks/:taskId
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status, deadline, priority } =
    req.body;
  try {
    await db.collection("tasks").doc(taskId).update({
      title,
      description,
      assignedTo,
      status,
      deadline,
      priority,
      updatedAt: Date.now(),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  const { title, description, assignedTo, deadline, createdBy, priority } =
    req.body;
  try {
    const newDocRef = db.collection("tasks").doc();
    const data = {
      title,
      description,
      status: "pending",
      assignedTo,
      createdBy,
      priority,
      deadline: deadline || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await newDocRef.set(data);

    const newDocSnap = await newDocRef.get();
    const newTask = { id: newDocRef.id, ...newDocSnap.data() };

    res.json({ success: true, task: newTask });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// GET /api/task-dashboard/:employeeId
exports.getEmployeeDashboard = async (req, res) => {
  const { employeeId } = req.params;
  const doc = await db.collection("employees").doc(employeeId).get();

  if (!doc.exists)
    return res.status(404).json({ success: false, msg: "Not found" });

  const tasks = await db
    .collection("tasks")
    .where("assignedTo", "==", employeeId)
    .get();
  const tasksData = tasks.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  res.json({ success: true, tasks: tasksData });
};

//PUT /api/update-task/:taskId
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    await db.collection("tasks").doc(taskId).update({ status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};
