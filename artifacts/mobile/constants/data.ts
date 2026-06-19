export type ContactCategory =
  | "emergency"
  | "hospital"
  | "rescue"
  | "poison"
  | "mental";

export interface Contact {
  id: string;
  name: string;
  number: string;
  category: ContactCategory;
  description: string;
  available: string;
}

export const CONTACTS: Contact[] = [
  // Emergency
  {
    id: "e1",
    name: "Emergency Services",
    number: "911",
    category: "emergency",
    description: "Police, Fire & Ambulance — all emergency dispatch",
    available: "24/7",
  },
  {
    id: "e2",
    name: "National Guard",
    number: "1-800-464-8273",
    category: "emergency",
    description: "Disaster relief and civil emergency assistance",
    available: "24/7",
  },
  {
    id: "e3",
    name: "FEMA Disaster Helpline",
    number: "1-800-621-3362",
    category: "emergency",
    description: "Federal disaster assistance after major catastrophes",
    available: "24/7",
  },
  {
    id: "e4",
    name: "Coast Guard Emergency",
    number: "1-800-424-8802",
    category: "emergency",
    description: "Maritime rescue and coastal emergency response",
    available: "24/7",
  },
  {
    id: "e5",
    name: "Disaster Distress Helpline",
    number: "1-800-985-5990",
    category: "emergency",
    description: "Crisis counseling for disaster survivors",
    available: "24/7",
  },
  {
    id: "e6",
    name: "American Red Cross",
    number: "1-800-733-2767",
    category: "emergency",
    description: "Disaster relief, blood donation, and emergency shelter",
    available: "24/7",
  },

  // Hospitals
  {
    id: "h1",
    name: "Mayo Clinic",
    number: "1-507-284-2511",
    category: "hospital",
    description: "Rochester, MN — World-renowned multi-specialty hospital",
    available: "24/7",
  },
  {
    id: "h2",
    name: "Cleveland Clinic",
    number: "1-800-223-2273",
    category: "hospital",
    description: "Cleveland, OH — Top-ranked heart and vascular care",
    available: "24/7",
  },
  {
    id: "h3",
    name: "Johns Hopkins Hospital",
    number: "1-410-955-5000",
    category: "hospital",
    description: "Baltimore, MD — Leading academic medical center",
    available: "24/7",
  },
  {
    id: "h4",
    name: "Massachusetts General Hospital",
    number: "1-617-726-2000",
    category: "hospital",
    description: "Boston, MA — Harvard-affiliated teaching hospital",
    available: "24/7",
  },
  {
    id: "h5",
    name: "UCLA Medical Center",
    number: "1-310-825-9111",
    category: "hospital",
    description: "Los Angeles, CA — Comprehensive trauma and emergency care",
    available: "24/7",
  },
  {
    id: "h6",
    name: "Cedars-Sinai Medical Center",
    number: "1-310-423-3277",
    category: "hospital",
    description: "Los Angeles, CA — Leading emergency and surgical care",
    available: "24/7",
  },
  {
    id: "h7",
    name: "NewYork-Presbyterian Hospital",
    number: "1-212-305-2500",
    category: "hospital",
    description: "New York, NY — Comprehensive adult and pediatric care",
    available: "24/7",
  },
  {
    id: "h8",
    name: "Houston Methodist Hospital",
    number: "1-713-790-3311",
    category: "hospital",
    description: "Houston, TX — Advanced emergency and specialty care",
    available: "24/7",
  },

  // Rescue Organizations
  {
    id: "r1",
    name: "National Search & Rescue",
    number: "1-202-267-1948",
    category: "rescue",
    description: "USCG coordinated search and rescue operations",
    available: "24/7",
  },
  {
    id: "r2",
    name: "Mountain Rescue Association",
    number: "1-208-634-0023",
    category: "rescue",
    description: "Wilderness and mountain rescue across North America",
    available: "24/7",
  },
  {
    id: "r3",
    name: "NASAR",
    number: "1-703-222-6277",
    category: "rescue",
    description: "National Association for Search and Rescue coordination",
    available: "Mon–Fri, 9am–5pm",
  },
  {
    id: "r4",
    name: "Salvation Army Disaster",
    number: "1-800-725-2769",
    category: "rescue",
    description: "Food, shelter, and emotional care after disasters",
    available: "24/7",
  },
  {
    id: "r5",
    name: "Team Rubicon",
    number: "1-424-253-4460",
    category: "rescue",
    description: "Veteran-led disaster response and reconstruction",
    available: "24/7",
  },
  {
    id: "r6",
    name: "Direct Relief",
    number: "1-805-964-4767",
    category: "rescue",
    description: "Medical aid and equipment for disaster survivors",
    available: "24/7",
  },

  // Poison Control
  {
    id: "p1",
    name: "Poison Control Center",
    number: "1-800-222-1222",
    category: "poison",
    description: "Immediate guidance for poisoning and toxic exposure",
    available: "24/7",
  },
  {
    id: "p2",
    name: "Chemical Hazard Hotline",
    number: "1-800-424-9300",
    category: "poison",
    description: "CHEMTREC — Chemical emergency and spill response",
    available: "24/7",
  },
  {
    id: "p3",
    name: "Carbon Monoxide Hotline",
    number: "1-800-222-1222",
    category: "poison",
    description: "Guidance for CO poisoning and gas exposure symptoms",
    available: "24/7",
  },

  // Mental Health
  {
    id: "m1",
    name: "Suicide & Crisis Lifeline",
    number: "988",
    category: "mental",
    description: "Free confidential support for mental health crises",
    available: "24/7",
  },
  {
    id: "m2",
    name: "Crisis Text Line",
    number: "741741",
    category: "mental",
    description: "Text HOME to connect with a trained crisis counselor",
    available: "24/7",
  },
  {
    id: "m3",
    name: "SAMHSA Helpline",
    number: "1-800-662-4357",
    category: "mental",
    description: "Substance abuse and mental health treatment referrals",
    available: "24/7",
  },
  {
    id: "m4",
    name: "Domestic Violence Hotline",
    number: "1-800-799-7233",
    category: "mental",
    description: "Support and safety planning for abuse survivors",
    available: "24/7",
  },
  {
    id: "m5",
    name: "Missing Children Hotline",
    number: "1-800-843-5678",
    category: "mental",
    description: "NCMEC — Report and locate missing children",
    available: "24/7",
  },
];

export const CATEGORY_LABELS: Record<ContactCategory, string> = {
  emergency: "Emergency",
  hospital: "Hospitals",
  rescue: "Rescue",
  poison: "Poison",
  mental: "Support",
};

export const CATEGORY_ICONS: Record<ContactCategory, string> = {
  emergency: "alert-circle",
  hospital: "activity",
  rescue: "shield",
  poison: "zap",
  mental: "heart",
};
