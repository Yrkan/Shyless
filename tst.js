const bcrypt = require("bcrypt");

const crypt = async (password, rounds) => {
  const hashed = await bcrypt.hash(password, rounds);
  console.log(hashed);
};

crypt("811998aZ-", 10);
