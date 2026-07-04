export interface TrustStat {
  value: string;
  label: string;
}

export type WhyUsIconKey = "factory" | "shield" | "certificate" | "route";

export interface WhyUsItem {
  title: string;
  description: string;
  icon: WhyUsIconKey;
}
