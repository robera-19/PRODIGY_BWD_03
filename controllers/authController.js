import bcrypt from 'bcryptjs';
import { z } from 'zod';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// --- Zod schemas keep validation readable and close to handler
const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(60),
  email: z.string().email(),
  password: z.string().min(6, 'Password should be at least 6 chars'),
  role: z.enum(['user', 'admin']).optional() // allow seeding admins; otherwise omit on client
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function register(req, res) {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parse.error.flatten().fieldErrors });
  }

  const { name, email, password, role } = parse.data;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashed, role: role || 'user' });

  const token = generateToken(user.id, user.role);
  return res.status(201).json({ user, token });
}

export async function login(req, res) {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parse.error.flatten().fieldErrors });
  }

  const { email, password } = parse.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user.id, user.role);
  return res.json({ user: user.toJSON(), token });
}
