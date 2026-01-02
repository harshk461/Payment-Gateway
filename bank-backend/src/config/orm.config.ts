import * as dotenv from 'dotenv';
dotenv.config();

export default {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrationsTableName: 'migrations',
  migrations: ['dist/src/migrations/*.js'],
  seeds: ['src/seeds/**/*{.ts,.js}'],
  factories: ['src/factories/**/*{.ts,.js}'],
  logging: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
