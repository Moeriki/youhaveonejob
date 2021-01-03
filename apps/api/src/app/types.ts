import { intArg, nonNull, objectType, stringArg } from 'nexus';

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
      args: { id: intArg() },
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.job.findFirst({
          where: { id: Number(id) },
        });
      },
    });

    t.list.field('jobs', {
      type: 'Job',
      resolve: (_, args, ctx) => {
        return ctx.prisma.job.findMany();
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
        return ctx.prisma.job.create({
          data: {
            description,
          },
        });
      },
    });

    t.nullable.field('completeJob', {
      type: 'Job',
      args: { id: intArg() },
      resolve: (_, { id }, ctx) => {
        return ctx.prisma.job.update({
          where: { id: Number(id) },
          data: { completed: true },
        });
      },
    });
  },
});
