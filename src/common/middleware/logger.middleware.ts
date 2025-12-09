import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip } = req;
        const start = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const duration = Date.now() - start;
            const logMessage = `${new Date().toISOString()} | ${ip} | ${method} ${originalUrl} | ${statusCode} | ${duration}ms\n`;

            const logDir = path.join(__dirname, '..', '..', 'logs');
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir);
            }
            fs.appendFileSync(path.join(logDir, 'requests.log'), logMessage);
        });

        next();
    }
}
