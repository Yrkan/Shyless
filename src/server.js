const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./db");

const app = express();
const PORT = 5000;

// JSON parser
app.use(express.json());

// Defend against NoSQL injections
app.use(mongoSanitize());

// Connect Database
connectDB();

// API v1
app.use("/api/v1/auth", require("./routes/api/v1/auth"));
app.use("/api/v1/admins", require("./routes/api/v1/admins"));
app.use("/api/v1/users", require("./routes/api/v1/users"));
app.use("/api/v1/questions", require("./routes/api/v1/questions"));

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:3000`);
});
