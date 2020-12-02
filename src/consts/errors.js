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
module.exports = {
  INTERNAL_SERVER_ERROR,
  INVALID_TOKEN,
  UNAUTHORIZED_ACCESS,
  INVALID_CREDENTIALS,
};
