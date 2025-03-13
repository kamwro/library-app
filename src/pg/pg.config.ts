import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigService } from '../config/config.service';
import { Book } from '../book/book.entity';
import { User } from '../user/user.entity';

export const pgConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const databaseConfig = configService.getPgConfig();

  return {
    type: 'postgres',
    host: databaseConfig.HOST,
    port: databaseConfig.PORT,
    username: databaseConfig.USERNAME,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE,
    entities: [Book, User],
    synchronize: true, // TODO change to use migrations later
  };
};
