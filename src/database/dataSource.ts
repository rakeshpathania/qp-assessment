import 'reflect-metadata';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Admin } from './entities/admin.js';
import { User } from './entities/user.js';
import { BlacklistedToken } from './entities/blackListedToken.js';
import { GroceryItem } from './entities/groceryItem.js';
import { Order } from './entities/order.js';
import { OrderItem } from './entities/orderItem.js';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.DB_LOG_SQL === 'true',
  entities: [Admin, User, BlacklistedToken, GroceryItem, Order, OrderItem],
  migrations: ["src/database/migrations/*.ts"],
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
