import { IBaseEntity } from './base';

export interface IAdmin extends IBaseEntity {
  login: string;
  passwordHash: string;
  role: 'admin' | 'manager';
}