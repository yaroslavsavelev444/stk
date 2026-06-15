import { IBaseEntity } from './base';
import { ISeo } from './seo';
import { IAttribute } from './attribute';
import { IDocument } from './document';
import { ObjectId } from 'mongoose';

export interface IProduct  {
  name: string;
  slug: string;
  images: string[];
  description: string;
  category: ObjectId;
  group?: string;               // например "Трамвайные", "Автомобильные"
  price?: number;
  showPrice: boolean;
  attributes: IAttribute[];    // гибкие характеристики
  documents: IDocument[];      // паспорта, сертификаты, госты
  badges: string[];            // ["Новинка", "Хит", "Акция"]
  order: number;
  isPublished: boolean;
  seo?: ISeo;
}