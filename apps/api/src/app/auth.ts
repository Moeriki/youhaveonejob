import { AuthenticationError, ForbiddenError } from 'apollo-server';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserSdl } from './sdl';

const { JWT_SECRET, PASSWORD_PEPPER } = process.env;
const HASH_ROUNDS = 10;

export interface Session {
  user: { id: string };
}

function generateToken(user: UserSdl.User): string {
  const session: Session = { user: { id: user.id } };
  return jwt.sign(session, JWT_SECRET);
}

export function assertSession(
  session: Session | undefined
): asserts session is Session {
  if (session == null) {
    throw new ForbiddenError('Resource access forbidden');
  }
}

export async function login(email: string, password: string): Promise<string> {
  const user = await UserSdl.findOneByEmail(email);
  if (user == null) {
    throw new AuthenticationError('Login failed');
  }
  const isValid = await bcrypt.compare(
    `${password}${PASSWORD_PEPPER}`,
    user.password
  );
  if (isValid) {
    return generateToken(user);
  }
  throw new AuthenticationError('Login failed');
}

export async function register(
  email: string,
  password: string
): Promise<string> {
  const hash = await bcrypt.hash(`${password}${PASSWORD_PEPPER}`, HASH_ROUNDS);
  const user = await UserSdl.create({ email, password: hash });
  return generateToken(user);
}

export function verify(token: string): Session {
  try {
    return jwt.verify(token, JWT_SECRET) as Session;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Token invalid');
      }
    }
    throw new AuthenticationError('Token could not be verified');
  }
}
