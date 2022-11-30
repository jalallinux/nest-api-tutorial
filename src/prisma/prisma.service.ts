import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: "postgresql://jalallinux:postgres@127.0.0.1:5432/test?schema=public",
                    // url: "postgresql://postgres:postgres@127.0.0.1:5432/test?schema=public",
                }
            }
        })
    }
}
