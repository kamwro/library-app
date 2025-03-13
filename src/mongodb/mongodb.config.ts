import type { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { ConfigService } from '../config/config.service';

export const mongodbConfig = (configService: ConfigService): MongooseModuleFactoryOptions => {
  const databaseConfig = configService.getMongoConfig();

  return {
    uri: databaseConfig.URI,
    user: databaseConfig.USERNAME,
    pass: databaseConfig.PASSWORD,
    dbName: 'log_db',
    authSource: 'admin',
  };
};
