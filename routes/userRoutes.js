import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { allowRoles, ownerOrAdmin } from '../middleware/roleMiddleware.js';
import { me, listUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

// --- Authenticated user: profile
router.get('/me', requireAuth, me);

// --- Admin-only: list all users
router.get('/', requireAuth, allowRoles('admin'), listUsers);

// --- Read anyone (only if authenticated) — adjust policy as needed
router.get('/:id', requireAuth, getUserById);

// --- Owner or Admin: update; Admin only: delete
router.patch('/:id', requireAuth, ownerOrAdmin, updateUser);
router.delete('/:id', requireAuth, allowRoles('admin'), deleteUser);

export default router;
