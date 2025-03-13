import { z } from 'zod';

export const PgConfigSchema = z.object({
  HOST: z.string().min(1, { message: 'Host is required' }),
  PORT: z.number().int().positive(),
  USERNAME: z.string().min(1, { message: 'Username is required' }),
  PASSWORD: z.string().min(1, { message: 'Password is required' }),
  DATABASE: z.string().min(1, { message: 'Database name is required' }),
});

export const MongoConfigSchema = z.object({
  URI: z.string().min(1, { message: 'URI is required' }),
  USERNAME: z.string().min(1, { message: 'Username is required' }),
  PASSWORD: z.string().min(1, { message: 'Password is required' }),
});

export const AuthenticationConfigSchema = z.object({
  JWT_SECRET: z.string().min(1, { message: 'JWT_SECRET is required' }),
});
