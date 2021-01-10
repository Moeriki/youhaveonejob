import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

import { UserSession } from './types';

const prisma = new PrismaClient();

const { JWT_SECRET } = process.env;

export interface Context {
  prisma: PrismaClient;
  user?: { id: string };
}

function getUser(authorization: string): UserSession | undefined {
  if (authorization == null) {
    return undefined;
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    throw new AuthenticationError();
  }
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      }
      throw new AuthenticationError();
    }
    throw new Error('Could not verify token');
  }
}

export function createContextExpress({ req }): Context {
  return { prisma, user: getUser(req.get('authorization')) };
}

export function createContextLambda({ event }): Context {
  return { prisma, user: getUser(event.headers.authorization) };
}
