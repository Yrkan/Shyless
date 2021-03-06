const express = require("express");
const connectDB = require("./db");

const app = express();
const PORT = 3000;

// JSON parser
app.use(express.json());

// Connect Database
connectDB();

// API v1
app.use("/api/v1/auth", require("./routes/api/v1/auth"));
app.use("/api/v1/admins", require("./routes/api/v1/admins"));
app.use("/api/v1/users", require("./routes/api/v1/users"));
app.use("/api/v1/questions", require("./routes/api/v1/questions"));
app.use("/api/v1/comments", require("./routes/api/v1/comments"));

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:3000`);
});
