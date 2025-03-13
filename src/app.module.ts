import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { GraphQLModule } from './graphql/graphql.module';
import { ReservationLogModule } from './reservation-log/reservation-log.module';
import { PgModule } from './pg/pg.module';
import { MongoDbModule } from './mongodb/mongodb.module';

@Module({
  imports: [
    AuthModule,
    BookModule,
    ConfigModule,
    GraphQLModule,
    MongoDbModule,
    PgModule,
    ReservationLogModule,
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
