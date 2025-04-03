import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
const options = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: process.env.DB_LOG_SQL === 'true',
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/database/migrations/*.js"],
    migrationsRun: false,
    namingStrategy: new SnakeNamingStrategy(),
    parseInt8: true,
    // extra: {
    //   ssl: process.env.DB_DISABLE_SSL
    //     ? undefined
    //     : {
    //         rejectUnauthorized: false,
    //       },
    // },
};
export const AppDataSource = new DataSource(options);
