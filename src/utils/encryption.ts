import * as bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  userPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};
