import { ConfigService } from './config.service';

const mockNestConfigService = {
  get: jest.fn(),
};

const mockDatabaseConfig = {
  HOST: 'localhost',
  PORT: 5434,
  USERNAME: 'library',
  PASSWORD: 'library',
  DATABASE: 'library_db',
};

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService(mockNestConfigService as never);
  });

  it('should return valid database config when valid environment variable is provided', () => {
    const validDatabaseConfig = JSON.stringify(mockDatabaseConfig);
    mockNestConfigService.get.mockReturnValue(validDatabaseConfig);

    const result = configService.getPgConfig();

    expect(result).toEqual(mockDatabaseConfig);
  });

  it('should throw an error if DATABASE_CONFIG is not defined', () => {
    mockNestConfigService.get.mockReturnValue(undefined);

    expect(() => configService.getPgConfig()).toThrowError(
      'DATABASE_CONFIG is not defined in the .env file',
    );
  });

  it('should throw an error if DATABASE_CONFIG has invalid JSON', () => {
    mockNestConfigService.get.mockReturnValue('invalid-json');

    expect(() => configService.getPgConfig()).toThrowError();
  });

  it('should throw an error if DATABASE_CONFIG does not match the expected schema', () => {
    mockNestConfigService.get.mockReturnValue(
      JSON.stringify({
        PORT: 5434,
        USERNAME: 'library',
        PASSWORD: 'library',
        DATABASE: 'library_db',
      }),
    );

    expect(() => configService.getPgConfig()).toThrowError();
  });
});
