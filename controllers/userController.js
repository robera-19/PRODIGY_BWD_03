import { z } from 'zod';
import User from '../models/User.js';

// For updating profile; password changes should go through a dedicated flow in real apps
const updateSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  // Do not allow changing role here to avoid privilege escalation
});

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  return res.json({ user });
}

export async function listUsers(req, res) {
  const users = await User.find().select('-password').lean();
  return res.json({ count: users.length, users });
}

export async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user });
}

export async function updateUser(req, res) {
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parse.error.flatten().fieldErrors });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: parse.data },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user });
}

export async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ message: 'User deleted' });
}
