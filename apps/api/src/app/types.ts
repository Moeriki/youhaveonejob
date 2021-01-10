import { UserInputError } from 'apollo-server';
import { booleanArg, intArg, nonNull, objectType, stringArg } from 'nexus';

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

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('job', {
      type: 'Job',
      args: { id: stringArg() },
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.job.findFirst({
          where: { id },
        });
      },
    });

    t.list.field('jobs', {
      type: 'Job',
      args: { completed: booleanArg() },
      resolve: (_, { completed = false }, ctx) => {
        return ctx.prisma.job.findMany({
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
      resolve: (_, { description }, ctx) => {
        if (description.trim() === '') {
          throw new UserInputError('Cannot create job without a description');
        }
        return ctx.prisma.job.create({
          data: {
            description,
          },
        });
      },
    });

    t.field('completeJob', {
      type: 'Job',
      args: { id: stringArg() },
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.job.update({
          where: { id: Number(id) },
          data: { completed: true },
        });
      },
    });
  },
});
