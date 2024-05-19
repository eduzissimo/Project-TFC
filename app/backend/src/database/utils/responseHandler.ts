import { Response } from 'express';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';

export default function handleResponse<T>(res: Response, result: ServiceResponse<T>) {
  res.status(result.status).json(result.data);
}
