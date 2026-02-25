import * as dotenv from 'dotenv';
import { initializeDatabase } from './database';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { createApp } from './app';

// Load environment variables
dotenv.config();

// Initialize database
initializeDatabase();

// Dependency injection
const authRepo = new AuthRepository();
const authService = new AuthService(authRepo);
const authController = new AuthController(authService);

// Create app
const app = createApp(authController, authService);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
