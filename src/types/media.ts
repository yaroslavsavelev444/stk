import { IBaseEntity } from './base';

export type MediaType = 'certificate' | 'instruction' | 'license' | 'passport';

export interface IMedia {
  title: string;
  type: MediaType;
  url: string;
  previewImage?: string;
  order: number;
  isPublished: boolean;
}