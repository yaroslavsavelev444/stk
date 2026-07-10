import type { ReactNode } from "react";

export interface Person {
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  location: string;
  languages: string[];
}

export interface Newsletter {
  display: boolean;
  title: ReactNode;
  description: ReactNode;
}

export interface SocialItem {
  name: string;
  icon: string;
  link: string;
  essential?: boolean;
}

export type Social = SocialItem[];

export interface HomeFeatured {
  display: boolean;
  title: ReactNode;
  href: string;
}

export interface Home {
  path: string;
  image: string;
  label: string;
  title: string;
  description: string;
  headline: ReactNode;
  featured: HomeFeatured;
  subline: ReactNode;
}

export interface AboutTableOfContent {
  display: boolean;
  subItems: boolean;
}

export interface AboutAvatar {
  display: boolean;
}

export interface AboutCalendar {
  display: boolean;
  link: string;
}

export interface AboutIntro {
  display: boolean;
  title: string;
  description: ReactNode;
}

export interface AboutExperienceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface AboutExperience {
  company: string;
  timeframe: string;
  role: string;
  achievements: ReactNode[];
  images: AboutExperienceImage[];
}

export interface AboutWork {
  display: boolean;
  title: string;
  experiences: AboutExperience[];
}

export interface AboutStudies {
  display: boolean;
  title: string;
  institutions: unknown[];
}

export interface AboutTechnical {
  display: boolean;
  title: string;
  skills: unknown[];
}

export interface About {
  path: string;
  label: string;
  title: string;
  description: string;
  tableOfContent: AboutTableOfContent;
  avatar: AboutAvatar;
  calendar: AboutCalendar;
  intro: AboutIntro;
  work: AboutWork;
  studies: AboutStudies;
  technical: AboutTechnical;
}

export interface Work {
  path: string;
  label: string;
  title: string;
  description: string;
}

export interface Blog {
  path: string;
  label: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Gallery {
  path: string;
  label: string;
  title: string;
  description: string;
  images: GalleryImage[];
}
