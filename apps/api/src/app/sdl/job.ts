import { Job, PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server';

export const prisma = new PrismaClient();

export function complete(id: string): Promise<Job> {
  return prisma.job.update({
    where: { id },
    data: { completed: true },
  });
}

export function create(data: { description: string }): Promise<Job> {
  if (data.description.trim() === '') {
    throw new UserInputError('Cannot create job without a description');
  }
  return prisma.job.create({ data });
}

export function find(data: { completed: boolean }): Promise<Job[]> {
  return prisma.job.findMany({
    where: data,
    orderBy: { createdAt: 'asc' },
  });
}
