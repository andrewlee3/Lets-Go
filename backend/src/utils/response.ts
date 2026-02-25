import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(res: Response, status: number, data: T): void => {
  const response: ApiResponse<T> = { success: true, data };
  res.status(status).json(response);
};

export const sendError = (res: Response, status: number, message: string): void => {
  const response: ApiResponse<never> = { success: false, error: message };
  res.status(status).json(response);
};
