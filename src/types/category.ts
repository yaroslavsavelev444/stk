import { IBaseEntity } from './base';
import { ISeo } from './seo';

export interface ICategory {
  name: string;
  slug: string;
  image: string;
  description?: string;
  order: number;
  isPublished: boolean;
  seo?: ISeo;
}