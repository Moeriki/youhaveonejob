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
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    jobs: {
      filtering: 'AND' | 'OR' | 'NOT' | 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'description'
      ordering: 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'description'
    }
  },
  Job: {

  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    job: 'Job'
    jobs: 'Job'
  },
  Mutation: {
    createOneJob: 'Job'
    updateOneJob: 'Job'
    updateManyJob: 'BatchPayload'
    deleteOneJob: 'Job'
    deleteManyJob: 'BatchPayload'
    upsertOneJob: 'Job'
  },
  Job: {
    id: 'Int'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    completed: 'Boolean'
    description: 'String'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  Job: Typegen.NexusPrismaFields<'Job'>
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
  