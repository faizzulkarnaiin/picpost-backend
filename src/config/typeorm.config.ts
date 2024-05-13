import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3307, 
  username: 'root', 
  password: '', 
  database: 'nestjs_project_backup',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};  
