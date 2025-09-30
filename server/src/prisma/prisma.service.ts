import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('🗄️  Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    // For development/testing purposes
    if (process.env.NODE_ENV === 'development') {
      const tables = await this.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename FROM pg_tables WHERE schemaname='public'
      `;
      
      for (const { tablename } of tables) {
        if (tablename !== '_prisma_migrations') {
          await this.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
        }
      }
    }
  }
}
