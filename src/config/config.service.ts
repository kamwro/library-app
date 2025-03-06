import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  getDatabaseConfig(): DatabaseConfig {
    const databaseConfigString = this.nestConfigService.get<string>('DATABASE_CONFIG');
    if (!databaseConfigString) {
      throw new Error('DATABASE_CONFIG is not defined in the .env file');
    }

    try {
      return JSON.parse(databaseConfigString);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error parsing DATABASE_CONFIG JSON: ${error.message}`);
      }
      throw new Error('Unknown exception');
    }
  }
}
