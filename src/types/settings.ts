import { IContact } from './contact';
import { ISeo } from './seo';

export interface ISettings {
  companyName: string;
  logo: string;
  contacts: IContact[];
  socials: IContact[];
  workingHours?: string;
  map?: string;
  seo?: ISeo;
}