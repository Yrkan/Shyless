const express = require("express");

const app = express();
const PORT = 3000;

app.use("/auth", require("./routes/auth"));
app.use("/admins", require("./routes/admins"));
app.use("/users", require("./routes/users"));
app.use("/questions", require("./routes/questions"));
app.use("/comments", require("./routes/comments"));

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:3000`);
});
