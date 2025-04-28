import { prisma } from "../prisma/prisma";

export async function getAllUsers() {
    return prisma.user.findMany();
}

export async function getUserById(id: number) {
    return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data });
}

export async function updateUser(id: number, data: { name?: string; email?: string; password?: string }) {
    return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
}
