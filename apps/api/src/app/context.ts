import { AuthenticationError } from 'apollo-server';

import * as Auth from './auth';

export interface Context {
  session?: Auth.Session;
}

function getSession(authorization: string): Auth.Session | undefined {
  if (authorization == null) {
    return undefined;
  }
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    throw new AuthenticationError('Authorization header invalid');
  }
  return Auth.verify(token);
}

export function createContextExpress({ req }): Context {
  return { session: getSession(req.get('authorization')) };
}

export function createContextLambda({ event }): Context {
  return { session: getSession(event.headers.authorization) };
}
