import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Connect to MongoDB as early as possible
await connectDB();

const app = express();

// --- Global middleware (security, parsing, logs)
app.use(helmet());
app.use(cors());
app.use(express.json());          // parse JSON bodies
app.use(morgan('dev'));
// Serve static HTML & CSS
app.use(express.static("frontend"));


// --- API routes (versioned)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// --- Error handlers
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ Server listening on :${port}`));
