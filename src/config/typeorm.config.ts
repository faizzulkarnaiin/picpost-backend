import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'mysql-1061b461-belajar-picpost.h.aivencloud.com',
  port: 10986, 
  username: 'avnadmin', 
  password: 'AVNS_ug-9YYsShLqEa3M_pYF', 
  database: 'defaultdb',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, './ca.pem')),
    rejectUnauthorized: true,
  },
};
