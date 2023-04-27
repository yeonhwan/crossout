export const enum INPUT_VALIDATION {
  EMPTY = 0,
  INVALID = 1,
  INVALID_CHARACTER = 2,
  VALID = 3,
}

export const enum EMAIL_ERR_MESSAGE {
  NOT_EMPTY = "Email cannot be left empty",
  INVALID_FORM = "Email is not valid email form",
}

export const enum PWD_ERR_MESSAGE {
  NOT_EMPTY = "Password cannot be left empty",
  INVALID_LENGTH = "Password must be 6~16 characters",
  INVALID_CHARACTER = "Password should be a combination of number, alphabet, special characters(!@#$%^*+=-)",
}

export const enum CONFIRM_ERR_MESSAGE {
  NOT_SAME = "Password confirm is not same with the password",
}
