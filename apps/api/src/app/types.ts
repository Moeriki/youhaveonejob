import { User } from '@prisma/client';
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { booleanArg, intArg, nonNull, objectType, stringArg } from 'nexus';

const { JWT_SECRET, PASSWORD_PEPPER } = process.env;
const HASH_ROUNDS = 10;

export interface UserSession {
  id: string;
}

function generateUserToken(user: User): string {
  const session: UserSession = { id: user.id };
  return jwt.sign(session, JWT_SECRET);
}

export const job = objectType({
  name: 'Job',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.completed();
    t.model.description();
  },
});

export const user = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();

    t.model.email();
  },
});

export const authentication = objectType({
  name: 'Authentication',
  definition(t) {
    t.string('token');
  },
});

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('jobs', {
      type: 'Job',
      args: { completed: booleanArg() },
      resolve: (_, { completed = false }, { prisma, user }) => {
        if (user == null) {
          throw new ForbiddenError();
        }
        return prisma.job.findMany({
          where: { completed },
          orderBy: { createdAt: 'asc' },
        });
      },
    });
  },
});

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createJob', {
      type: 'Job',
      args: {
        description: nonNull(stringArg()),
      },
      resolve: (_, { description }, { prisma, user }) => {
        if (user == null) {
          throw new ForbiddenError();
        }
        if (description.trim() === '') {
          throw new UserInputError('Cannot create job without a description');
        }
        return prisma.job.create({
          data: { description },
        });
      },
    });

    t.field('completeJob', {
      type: 'Job',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, { prisma, user }) => {
        if (user == null) {
          throw new ForbiddenError();
        }
        return prisma.job.update({
          where: { id: Number(id) },
          data: { completed: true },
        });
      },
    });

    t.field('login', {
      type: 'Authentication',
      args: { email: nonNull(stringArg()), password: nonNull(stringArg()) },
      resolve: async (_, { email, password }, { prisma }) => {
        const user = await prisma.user.findFirst({
          where: { email },
        });
        if (user == null) {
          throw new AuthenticationError();
        }
        const isValid = await bcrypt.compare(
          `${password}${PASSWORD_PEPPER}`,
          user.password
        );
        if (isValid) {
          return { token: generateUserToken(user) };
        }
        throw new AuthenticationError();
      },
    });

    t.field('register', {
      type: 'Authentication',
      args: { email: nonNull(stringArg()), password: nonNull(stringArg()) },
      resolve: async (_, { email, password }, { prisma }) => {
        const hash = await bcrypt.hash(
          `${password}${PASSWORD_PEPPER}`,
          HASH_ROUNDS
        );
        const user = await prisma.user.create({
          data: { email, password: hash },
        });
        return { token: generateUserToken(user) };
      },
    });
  },
});
