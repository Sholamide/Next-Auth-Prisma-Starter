import { hash, compare } from "bcryptjs";

export async function hashPassword(password) {
  const saltRounds = 12;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(password, userPassword) {
  const validPassword = await compare(password, userPassword);
  return validPassword;
}
