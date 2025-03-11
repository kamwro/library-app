import { Module } from '@nestjs/common';

import { BookModule } from './book/book.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    BookModule,
    ConfigModule,
    DatabaseModule,
    GraphQLModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getAuthenticationConfig().JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
})
export class AppModule {}
