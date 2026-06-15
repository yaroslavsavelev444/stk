export type ContactType = 'text' | 'phone' | 'email' | 'link';

export interface IContact {
  title: string;
  value: string;
  type: ContactType;
  order?: number;
}