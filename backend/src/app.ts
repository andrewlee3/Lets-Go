import express, { Express } from 'express';
import cors from 'cors';
import { createRoutes } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { AuthController } from './controllers/auth.controller';

export const createApp = (authController: AuthController): Express => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use(createRoutes(authController));

  // Error handler
  app.use(errorHandler);

  return app;
};
