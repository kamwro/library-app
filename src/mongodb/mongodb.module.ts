import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

import { mongodbConfig } from './mongodb.config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return mongodbConfig(configService);
      },
    }),
  ],
})
export class MongoDbModule {}
