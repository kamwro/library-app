import { ConfigService as NestConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

import { AuthenticationConfigSchema, DatabaseConfigSchema } from './config.validation';

@Injectable()
export class ConfigService {
  readonly #nestConfigService: NestConfigService;
  constructor(nestConfigService: NestConfigService) {
    this.#nestConfigService = nestConfigService;
  }

  getDatabaseConfig(): z.infer<typeof DatabaseConfigSchema> {
    return this.#parseEnvJson('DATABASE_CONFIG', DatabaseConfigSchema);
  }

  getAuthenticationConfig(): z.infer<typeof AuthenticationConfigSchema> {
    return this.#parseEnvJson('AUTHENTICATION_CONFIG', AuthenticationConfigSchema);
  }

  #parseEnvJson<T>(envKey: string, schema: z.ZodSchema<T>): T {
    const envValue = this.#nestConfigService.get<string>(envKey);

    if (!envValue) {
      throw new Error(`${envKey} is not defined in the .env file`);
    }

    try {
      const parsedValue = JSON.parse(envValue) as z.infer<typeof schema>;
      return schema.parse(parsedValue);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error parsing ${envKey}: ${error.message}`);
      }
      throw new Error('Unknown error occurred');
    }
  }
}
