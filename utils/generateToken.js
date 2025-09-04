import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT containing a minimal payload.
 * Keep payload small (id + role) for performance/security.
 */
export function generateToken(userId, role) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES || '1d';
  return jwt.sign({ sub: userId, role }, secret, { expiresIn });
}
