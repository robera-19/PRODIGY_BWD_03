import jwt from 'jsonwebtoken';

/**
 * Verifies "Authorization: Bearer <token>" and attaches req.user = { id, role }.
 * Returns 401 if token missing/invalid.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' '); // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Normalize shape for downstream use
    req.user = { id: decoded.sub, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
