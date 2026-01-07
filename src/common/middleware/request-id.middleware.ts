import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let requestId = req.id;

  if (!requestId) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'req.id is missing. Check nestjs-pino pinoHttp.genReqId and middleware order.',
      );
    }
    requestId = randomUUID();
  }

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}
