import { compare } from "bcryptjs";

const isPasswordCorrect = async (
  inputPassword: string,
  storedPassword: string,
) => {
  return await compare(inputPassword, storedPassword);
};

export default isPasswordCorrect;
