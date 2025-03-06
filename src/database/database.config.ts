import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigService } from '../config/config.service';
import { Book } from '../book/book.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const { host, port, username, password, database } = configService.getDatabaseConfig();

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [Book],
    synchronize: true, // TODO change to use migrations later
  };
};