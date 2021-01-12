import { PrismaClient, User } from '@prisma/client';

export const prisma = new PrismaClient();

export type { User };

export function create(data: {
  email: string;
  password: string;
}): Promise<User | undefined> {
  return prisma.user.create({ data });
}

export function findOneByEmail(email: string): Promise<User | undefined> {
  return prisma.user.findFirst({ where: { email } });
}
