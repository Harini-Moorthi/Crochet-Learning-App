import express from 'express';
import cors from 'cors';  //Cross-Origin Resource Sharing
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import exampleRoutes from './routes/example.routes';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import courseRoutes from './routes/course.routes';
import userRoutes from './routes/user.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import progressRoutes from './routes/progress.routes';
import lessonRoutes from './routes/lesson.routes';
import patternRoutes from './routes/pattern.routes';
import cloudinaryRoutes from './routes/cloudinary.routes';

dotenv.config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Crochet Learning API' });
});

// Example routes
app.use('/api', exampleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;