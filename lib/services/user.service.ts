import { prisma } from "../prisma/prisma";
import bcrypt from "bcryptjs";

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(data.password, salt);
  return prisma.user.create({ data: { ...data, password: hashed } });
}

export async function updateUser(
  id: number,
  data: { name?: string; email?: string; password?: string },
) {
  if (data.password) {
    const salt = await bcrypt.genSalt(12);
    data.password = await bcrypt.hash(data.password, salt);
  }
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({ where: { id } });
}
