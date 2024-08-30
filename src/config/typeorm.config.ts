  import { TypeOrmModuleOptions } from '@nestjs/typeorm';
  import * as fs from 'fs';
  import * as path from 'path';
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_USERNAME:', process.env.DB_USERNAME);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
  console.log('DB_DATABASE:', process.env.DB_DATABASE);
  export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port:  parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, './ca.pem')),
      rejectUnauthorized: true,
    },
  };
