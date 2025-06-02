require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Định tuyến
app.use("/api", employeeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
