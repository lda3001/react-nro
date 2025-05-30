import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes';
import charactersRoutes from './routes/charactersRoutes';
import featuresRoutes from './routes/featuresRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/features', featuresRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Bảy Viên Ngọc Rồng API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
