import { Response } from 'express';

export default function handleResponse(res: Response, result: any) {
  res.status(result.status).json(result.data);
}
