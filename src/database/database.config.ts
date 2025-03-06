import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigService } from '../config/config.service';
import { Book } from '../book/book.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const databaseConfig = configService.getDatabaseConfig();

  return {
    type: 'postgres',
    host: databaseConfig.HOST,
    port: databaseConfig.PORT,
    username: databaseConfig.USERNAME,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE,
    entities: [Book],
    synchronize: true, // TODO change to use migrations later
  };
};
