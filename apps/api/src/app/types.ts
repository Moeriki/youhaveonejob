import { booleanArg, nonNull, objectType, stringArg } from 'nexus';

import * as Auth from './auth';
import { JobSdl } from './sdl';

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
      resolve: (_, { completed = false }, { session }) => {
        Auth.assertSession(session);
        return JobSdl.find({ completed });
      },
    });
  },
});

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createJob', {
      type: 'Job',
      args: { description: nonNull(stringArg()) },
      resolve: (_, args, { session }) => {
        Auth.assertSession(session);
        return JobSdl.create(args);
      },
    });

    t.field('completeJob', {
      type: 'Job',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, { session }) => {
        Auth.assertSession(session);
        return JobSdl.complete(id);
      },
    });

    t.field('login', {
      type: 'Authentication',
      args: { email: nonNull(stringArg()), password: nonNull(stringArg()) },
      resolve: async (_, { email, password }) => {
        const token = await Auth.login(email, password);
        return { token };
      },
    });

    t.field('register', {
      type: 'Authentication',
      args: { email: nonNull(stringArg()), password: nonNull(stringArg()) },
      resolve: async (_, { email, password }) => {
        const token = await Auth.register(email, password);
        return { token };
      },
    });
  },
});
