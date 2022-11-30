import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: `${config.get("DB_DRIVER")}://${config.get("DB_USER")}:${config.get("DB_PASS")}@${config.get("DB_HOST")}:${config.get("DB_PORT")}/${config.get("DB_NAME")}?schema=${config.get("DB_SCHEMA")}`,
                }
            }
        })
    }
}
