export interface HumanitarianContact {
  id: string;
  name: string;
  number: string;
  email?: string;
  whatsapp?: string;
  sector: string;
  description: string;
  available: string;
  county?: string;
  verified: boolean;
}

export const HUMANITARIAN_CONTACTS: HumanitarianContact[] = [
  // Kenya Red Cross
  {
    id: "hum1",
    name: "Kenya Red Cross Society",
    number: "1199",
    email: "info@redcross.or.ke",
    sector: "Humanitarian Aid",
    description: "Emergency response, blood donation, disaster relief, community health",
    available: "24/7",
    verified: true,
  },
  {
    id: "hum2",
    name: "Kenya Red Cross HQ",
    number: "020 3950000",
    email: "info@redcross.or.ke",
    sector: "Humanitarian Aid",
    description: "Headquarters — Nairobi Upper Hill",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: true,
  },

  // UN & International Orgs
  {
    id: "hum3",
    name: "UNHCR Kenya (Refugees)",
    number: "020 4451605",
    email: "kenna@unhcr.org",
    sector: "Refugee & Displaced",
    description: "UN refugee agency — protection, asylum, and resettlement",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: true,
  },
  {
    id: "hum4",
    name: "UNICEF Kenya",
    number: "020 7622155",
    sector: "Children & Women",
    description: "Children's rights, child protection, nutrition, and education",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: true,
  },
  {
    id: "hum5",
    name: "World Food Programme Kenya",
    number: "020 7625770",
    sector: "Food Security",
    description: "Emergency food aid and nutrition programs",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: true,
  },
  {
    id: "hum6",
    name: "MSF (Doctors Without Borders)",
    number: "020 4453399",
    sector: "Medical Aid",
    description: "Emergency medical care in conflict and crisis zones",
    available: "24/7",
    county: "Nairobi",
    verified: true,
  },
  {
    id: "hum7",
    name: "ICRC Kenya",
    number: "020 2623000",
    sector: "Conflict & Detention",
    description: "International Committee of Red Cross — conflict and detention support",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: true,
  },

  // Local NGOs
  {
    id: "hum8",
    name: "Oxfam Kenya",
    number: "020 2720809",
    sector: "Poverty & Disaster",
    description: "Humanitarian aid, poverty relief, and disaster response",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: true,
  },
  {
    id: "hum9",
    name: "Save the Children Kenya",
    number: "020 2710527",
    sector: "Children",
    description: "Child protection, education, and emergency response",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: true,
  },
  {
    id: "hum10",
    name: "CARE International Kenya",
    number: "020 2715557",
    sector: "Women & Poverty",
    description: "Poverty alleviation, women empowerment, and emergency aid",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: true,
  },
  {
    id: "hum11",
    name: "World Vision Kenya",
    number: "020 4984000",
    sector: "Children & Community",
    description: "Child welfare, community development, and disaster response",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: false,
  },
  {
    id: "hum12",
    name: "ActionAid Kenya",
    number: "020 3872873",
    sector: "Poverty & Women",
    description: "Emergency response, women rights, and poverty reduction",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: false,
  },

  // Mental Health & Suicide
  {
    id: "hum13",
    name: "Befrienders Kenya (Suicide)",
    number: "0722 178 177",
    sector: "Mental Health Crisis",
    description: "Confidential suicide prevention and emotional support",
    available: "24/7",
    verified: true,
  },
  {
    id: "hum14",
    name: "Niskize Mental Health",
    number: "0900 620 800",
    sector: "Mental Health Crisis",
    description: "Free mental health crisis line — Safaricom toll-free",
    available: "24/7",
    verified: true,
    isTollFree: true,
  } as any,
  {
    id: "hum15",
    name: "Kenya Psychiatric Association",
    number: "020 2726300",
    sector: "Mental Health",
    description: "Referral to mental health professionals and facilities",
    available: "Mon–Fri, 8am–5pm",
    county: "Nairobi",
    verified: false,
  },

  // GBV & Child Protection
  {
    id: "hum16",
    name: "Gender Violence Hotline",
    number: "1195",
    sector: "GBV & Abuse",
    description: "Gender-based violence support, counseling, and referral",
    available: "24/7",
    verified: true,
    isTollFree: true,
  } as any,
  {
    id: "hum17",
    name: "Child Helpline Kenya",
    number: "116",
    sector: "Child Protection",
    description: "Report child abuse, neglect, and child labor — toll-free",
    available: "24/7",
    verified: true,
    isTollFree: true,
  } as any,
  {
    id: "hum18",
    name: "National GBV Hotline",
    number: "0800 723 253",
    sector: "GBV & Abuse",
    description: "Ministry of Health gender-based violence free hotline",
    available: "24/7",
    verified: true,
    isTollFree: true,
  } as any,

  // Missing Persons
  {
    id: "hum19",
    name: "Missing Persons (Police)",
    number: "0800 722 203",
    sector: "Missing Persons",
    description: "Report missing persons to Kenya Police — toll-free",
    available: "24/7",
    verified: true,
    isTollFree: true,
  } as any,

  // Blood
  {
    id: "hum20",
    name: "National Blood Transfusion",
    number: "020 2120468",
    sector: "Blood Donation",
    description: "Kenya National Blood Transfusion Service — donate or request blood",
    available: "Mon–Sat, 7am–5pm",
    county: "Nairobi",
    verified: true,
  },
  {
    id: "hum21",
    name: "KNBTS Toll-Free",
    number: "0800 720 021",
    sector: "Blood Donation",
    description: "Blood donation inquiries and emergency blood requests",
    available: "24/7",
    verified: false,
    isTollFree: true,
  } as any,
];
