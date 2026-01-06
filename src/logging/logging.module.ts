import { Module } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,

        genReqId: (req) => {
          const header = req.headers['x-request-id'];
          const incoming =
            typeof header === 'string'
              ? header
              : Array.isArray(header)
                ? header[0]
                : undefined;

          return (incoming && incoming.trim()) || randomUUID();
        },

        redact: ['req.headers.authorization'],
      },
    }),
  ],
})
export class LoggingModule {}
