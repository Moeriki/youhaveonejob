import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
  first?: boolean
  last?: boolean
  before?: boolean
  after?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime'

// Prisma model type definitions
interface PrismaModels {
  Job: Prisma.Job
  User: Prisma.User
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    jobs: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'description'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'description'
    }
    users: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'email' | 'password'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'email' | 'password'
    }
  },
  Job: {

  }
  User: {

  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    job: 'Job'
    jobs: 'Job'
    user: 'User'
    users: 'User'
  },
  Mutation: {
    createOneJob: 'Job'
    updateOneJob: 'Job'
    updateManyJob: 'BatchPayload'
    deleteOneJob: 'Job'
    deleteManyJob: 'BatchPayload'
    upsertOneJob: 'Job'
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'BatchPayload'
    deleteOneUser: 'User'
    deleteManyUser: 'BatchPayload'
    upsertOneUser: 'User'
  },
  Job: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    completed: 'Boolean'
    description: 'String'
  }
  User: {
    id: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    email: 'String'
    password: 'String'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  Job: Typegen.NexusPrismaFields<'Job'>
  User: Typegen.NexusPrismaFields<'User'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  