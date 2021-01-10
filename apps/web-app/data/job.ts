import {
  MutationTuple,
  QueryTuple,
  gql,
  useMutation,
  useQuery,
} from '@apollo/client';

export interface Job {
  id: string;
  completed: boolean;
  description: string;
}

const COMPLETE_JOB = gql`
  mutation CompleteJob($id: String!) {
    completeJob(id: $id) {
      id
      completed
    }
  }
`;

export interface CompleteJobData {
  job: { id: string };
}

export interface CompleteJobInput {
  id: string;
}

export function useCompleteJob(): MutationTuple<
  CompleteJobData,
  CompleteJobInput
> {
  return useMutation<CompleteJobData, CompleteJobInput>(COMPLETE_JOB);
}

const CREATE_JOB = gql`
  mutation CreateJob($description: String!) {
    createJob(description: $description) {
      id
      completed
      description
    }
  }
`;

export interface CreateJobData {
  job: Job;
}

export interface CreateJobInput {
  description: string;
}

export function useCreateJob(): MutationTuple<CreateJobData, CreateJobInput> {
  return useMutation<CreateJobData, CreateJobInput>(CREATE_JOB);
}

const GET_JOBS = gql`
  query GetJobs {
    jobs(completed: false) {
      id
      completed
      description
    }
  }
`;

export interface GetJobsData {
  description: string;
}

export interface GetJobsInput {
  completed: boolean;
}

export function useGetJobs(): QueryTuple<GetJobsData, GetJobsInput> {
  return useQuery<GetJobsData, GetJobsInput>(GET_JOBS);
}
