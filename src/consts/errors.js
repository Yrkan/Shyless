const INTERNAL_SERVER_ERROR = {
  errors: [
    {
      msg: "Internal server error",
    },
  ],
};

const INVALID_TOKEN = {
  errors: [
    {
      msg: "Inavlid token",
    },
  ],
};

const UNAUTHORIZED_ACCESS = {
  errors: [
    {
      msg: "Unauthorized acess",
    },
  ],
};

const INVALID_CREDENTIALS = {
  errors: [
    {
      msg: "Invalid credentials",
    },
  ],
};

const INVALID_ID = {
  errors: [
    {
      msg: "Invalid ID",
    },
  ],
};

const USERNAME_ALREADY_IN_USE = {
  errors: [
    {
      msg: "Username is already in use",
    },
  ],
};

const EMAIL_ALREADY_IN_USE = {
  errors: [
    {
      msg: "Email is already in use",
    },
  ],
};

const EMAIL_ALREADY_CONFIRMED = {
  errors: [
    {
      msg: "Email is already confirmed",
    },
  ],
};
module.exports = {
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN,
  INVALID_ID,
  UNAUTHORIZED_ACCESS,
  INVALID_CREDENTIALS,
  USERNAME_ALREADY_IN_USE,
  EMAIL_ALREADY_IN_USE,
  EMAIL_ALREADY_CONFIRMED,
};
