/**
 * Allows only specified roles to proceed.
 * Usage: router.get('/admin-only', requireAuth, allowRoles('admin'), handler)
 */
export function allowRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

/**
 * Owner-or-admin guard for resources with ":id" param.
 * Example: router.patch('/:id', requireAuth, ownerOrAdmin, updateUser)
 */
export function ownerOrAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  if (req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return res.status(403).json({ message: 'Forbidden: not owner' });
}
