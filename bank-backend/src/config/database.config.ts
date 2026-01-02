import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get<number>('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  //   host: 'localhost',
  //   port: 3006,
  //   username: 'root',
  //   password: 'password',
  //   database: 'avatar',
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
  //  logging: configService.get<string>('NODE_ENV') === Environments.local,
});
