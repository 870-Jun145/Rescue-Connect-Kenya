export type HospitalLevel = "Level 1" | "Level 2" | "Level 3" | "Level 4" | "Level 5" | "Level 6";
export type HospitalType = "public" | "private" | "faith-based";

export interface Hospital {
  id: string;
  name: string;
  county: string;
  subCounty?: string;
  level: HospitalLevel;
  type: HospitalType;
  phone?: string;
  phone2?: string;
  email?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  isBloodBank: boolean;
  isMentalHealth: boolean;
  verified: boolean;
  specialties?: string[];
}

export const KENYA_HOSPITALS: Hospital[] = [
  // ===========================
  // 1. NAIROBI COUNTY
  // ===========================
  {
    id: "nrb1",
    name: "Kenyatta National Hospital (KNH)",
    county: "Nairobi",
    subCounty: "Nairobi Central",
    level: "Level 6",
    type: "public",
    phone: "020 2726300",
    phone2: "020 2725795",
    email: "info@knh.or.ke",
    address: "Hospital Road, Upper Hill, Nairobi",
    coordinates: { lat: -1.2993, lng: 36.8110 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Trauma", "Oncology", "Cardiology", "Neurology", "Burns"],
  },
  {
    id: "nrb2",
    name: "Kenyatta University Teaching, Referral & Research Hospital",
    county: "Nairobi",
    subCounty: "Kahawa",
    level: "Level 6",
    type: "public",
    phone: "020 2055000",
    address: "Kenyatta University Campus, Thika Road, Nairobi",
    coordinates: { lat: -1.1821, lng: 36.9357 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Oncology", "Transplant", "Cardiology"],
  },
  {
    id: "nrb3",
    name: "Mathare National Teaching & Referral Hospital",
    county: "Nairobi",
    subCounty: "Mathare",
    level: "Level 5",
    type: "public",
    phone: "020 2725600",
    address: "Thika Road, Mathare, Nairobi",
    coordinates: { lat: -1.2641, lng: 36.8686 },
    isBloodBank: false,
    isMentalHealth: true,
    verified: true,
    specialties: ["Psychiatry", "Psychology", "Neurology", "Substance Abuse"],
  },
  {
    id: "nrb4",
    name: "Nairobi Hospital",
    county: "Nairobi",
    subCounty: "Upper Hill",
    level: "Level 5",
    type: "private",
    phone: "020 2845000",
    email: "info@nairobihospital.org",
    address: "Argwings Kodhek Road, Upper Hill, Nairobi",
    coordinates: { lat: -1.2968, lng: 36.8138 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Cardiology", "Oncology", "Orthopedics"],
  },
  {
    id: "nrb5",
    name: "Aga Khan University Hospital, Nairobi",
    county: "Nairobi",
    subCounty: "Parklands",
    level: "Level 5",
    type: "private",
    phone: "020 3662000",
    email: "hospitality@aku.edu",
    address: "3rd Parklands Avenue, Nairobi",
    coordinates: { lat: -1.2614, lng: 36.8222 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Transplant", "Oncology", "Cardiology", "Neurosurgery"],
  },
  {
    id: "nrb6",
    name: "MP Shah Hospital",
    county: "Nairobi",
    subCounty: "Parklands",
    level: "Level 5",
    type: "private",
    phone: "020 4291000",
    email: "info@mpshahospital.org",
    address: "Shivachi Road, Parklands, Nairobi",
    coordinates: { lat: -1.2699, lng: 36.8259 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: true,
    specialties: ["Cardiology", "Dialysis", "Orthopedics"],
  },
  {
    id: "nrb7",
    name: "Karen Hospital",
    county: "Nairobi",
    subCounty: "Karen",
    level: "Level 4",
    type: "private",
    phone: "0719 095 000",
    email: "info@karenhospital.org",
    address: "Karen Road, Karen, Nairobi",
    coordinates: { lat: -1.3326, lng: 36.6948 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: true,
    specialties: ["Orthopedics", "Physiotherapy", "Radiology"],
  },
  {
    id: "nrb8",
    name: "Gertrude's Children's Hospital",
    county: "Nairobi",
    subCounty: "Muthaiga",
    level: "Level 4",
    type: "private",
    phone: "020 7206000",
    email: "customercare@gerties.org",
    address: "Muthaiga Road, Nairobi",
    coordinates: { lat: -1.2515, lng: 36.8431 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: true,
    specialties: ["Pediatrics", "Neonatology"],
  },
  {
    id: "nrb9",
    name: "Mater Hospital",
    county: "Nairobi",
    subCounty: "South B",
    level: "Level 4",
    type: "faith-based",
    phone: "020 2720161",
    email: "info@materhospital.co.ke",
    address: "Dunga Road, South B, Nairobi",
    coordinates: { lat: -1.3063, lng: 36.8369 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Cardiology", "Oncology", "Maternity"],
  },
  {
    id: "nrb10",
    name: "Pumwani Maternity Hospital",
    county: "Nairobi",
    subCounty: "Pumwani",
    level: "Level 5",
    type: "public",
    address: "Pumwani Road, Eastlands, Nairobi",
    coordinates: { lat: -1.2806, lng: 36.8553 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: ["Maternity", "Neonatology", "Obstetrics"],
  },
  {
    id: "nrb11",
    name: "Mbagathi District Hospital",
    county: "Nairobi",
    subCounty: "Dagoretti",
    level: "Level 4",
    type: "public",
    address: "Mbagathi Way, Nairobi",
    coordinates: { lat: -1.3138, lng: 36.7618 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: ["Infectious Disease", "HIV/AIDS"],
  },
  {
    id: "nrb12",
    name: "Avenue Hospital",
    county: "Nairobi",
    subCounty: "Parklands",
    level: "Level 4",
    type: "private",
    address: "4th Parklands Avenue, Nairobi",
    coordinates: { lat: -1.2637, lng: 36.8197 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: ["Surgery", "Radiology", "Physiotherapy"],
  },
  {
    id: "nrb13",
    name: "Coptic Hospital",
    county: "Nairobi",
    subCounty: "Woodlands",
    level: "Level 4",
    type: "faith-based",
    address: "Ngong Road, Nairobi",
    coordinates: { lat: -1.2989, lng: 36.7792 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: ["Surgery", "Maternity", "Ophthalmology"],
  },
  {
    id: "nrb14",
    name: "Nairobi West Hospital",
    county: "Nairobi",
    subCounty: "Langata",
    level: "Level 4",
    type: "public",
    address: "Nairobi West, Nairobi",
    coordinates: { lat: -1.3214, lng: 36.8023 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "nrb15",
    name: "Kenya National Blood Transfusion Centre",
    county: "Nairobi",
    subCounty: "Upper Hill",
    level: "Level 5",
    type: "public",
    phone: "020 2120468",
    address: "Hospital Road, Upper Hill, Nairobi",
    coordinates: { lat: -1.2993, lng: 36.8110 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Blood Bank", "Transfusion Medicine"],
  },
  {
    id: "nrb16",
    name: "Nairobi Adventist Hospital",
    county: "Nairobi",
    subCounty: "Westlands",
    level: "Level 4",
    type: "faith-based",
    address: "Nyari Estate, off Peponi Road, Nairobi",
    coordinates: { lat: -1.2574, lng: 36.7955 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 2. MOMBASA COUNTY
  // ===========================
  {
    id: "mbs1",
    name: "Coast General Teaching & Referral Hospital",
    county: "Mombasa",
    subCounty: "Mvita",
    level: "Level 5",
    type: "public",
    phone: "041 2314201",
    address: "Hospital Road, Mombasa Island",
    coordinates: { lat: -4.0490, lng: 39.6652 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Trauma", "Oncology", "Maternity"],
  },
  {
    id: "mbs2",
    name: "Aga Khan Hospital, Mombasa",
    county: "Mombasa",
    subCounty: "Tudor",
    level: "Level 4",
    type: "private",
    phone: "041 2227710",
    address: "Vanga Road, Mombasa",
    coordinates: { lat: -4.0617, lng: 39.6741 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: true,
    specialties: ["Surgery", "Maternity", "Cardiology"],
  },
  {
    id: "mbs3",
    name: "Pandya Memorial Hospital",
    county: "Mombasa",
    subCounty: "Mvita",
    level: "Level 4",
    type: "private",
    address: "Hospital Road, Mombasa",
    coordinates: { lat: -4.0510, lng: 39.6680 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: ["Surgery", "Maternity", "Orthopedics"],
  },
  {
    id: "mbs4",
    name: "Mombasa Hospital",
    county: "Mombasa",
    subCounty: "Mvita",
    level: "Level 4",
    type: "private",
    address: "Mama Ngina Drive, Mombasa",
    coordinates: { lat: -4.0604, lng: 39.6686 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "mbs5",
    name: "Port Reitz District Hospital",
    county: "Mombasa",
    subCounty: "Changamwe",
    level: "Level 4",
    type: "public",
    address: "Port Reitz, Changamwe, Mombasa",
    coordinates: { lat: -4.0230, lng: 39.5920 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 3. KISUMU COUNTY
  // ===========================
  {
    id: "ksm1",
    name: "Jaramogi Oginga Odinga Teaching & Referral Hospital",
    county: "Kisumu",
    subCounty: "Kisumu Central",
    level: "Level 5",
    type: "public",
    phone: "057 2020700",
    address: "Kisumu–Busia Road, Kisumu",
    coordinates: { lat: -0.0870, lng: 34.7648 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Oncology", "Cardiology", "Maternity"],
  },
  {
    id: "ksm2",
    name: "Aga Khan Hospital, Kisumu",
    county: "Kisumu",
    subCounty: "Kisumu Central",
    level: "Level 4",
    type: "private",
    phone: "057 2020600",
    address: "Oginga Odinga Road, Kisumu",
    coordinates: { lat: -0.0893, lng: 34.7582 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: true,
    specialties: ["Surgery", "Dialysis"],
  },
  {
    id: "ksm3",
    name: "Kisumu County Hospital",
    county: "Kisumu",
    subCounty: "Kisumu East",
    level: "Level 4",
    type: "public",
    address: "Kisumu County, Kisumu",
    coordinates: { lat: -0.0971, lng: 34.7880 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 4. NAKURU COUNTY
  // ===========================
  {
    id: "nkr1",
    name: "Nakuru Level 5 County Hospital",
    county: "Nakuru",
    subCounty: "Nakuru East",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Nakuru",
    coordinates: { lat: -0.3031, lng: 36.0800 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: ["Trauma", "Maternity", "Surgery"],
  },
  {
    id: "nkr2",
    name: "War Memorial Hospital Nakuru",
    county: "Nakuru",
    subCounty: "Nakuru",
    level: "Level 4",
    type: "faith-based",
    address: "Hospital Road, Nakuru",
    coordinates: { lat: -0.3050, lng: 36.0790 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "nkr3",
    name: "Naivasha District Hospital",
    county: "Nakuru",
    subCounty: "Naivasha",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Naivasha",
    coordinates: { lat: -0.7131, lng: 36.4318 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 5. UASIN GISHU (ELDORET)
  // ===========================
  {
    id: "ugs1",
    name: "Moi Teaching & Referral Hospital (MTRH)",
    county: "Uasin Gishu",
    subCounty: "Eldoret Central",
    level: "Level 6",
    type: "public",
    phone: "053 2033471",
    email: "info@mtrh.go.ke",
    address: "Nandi Road, Eldoret",
    coordinates: { lat: 0.5152, lng: 35.2698 },
    isBloodBank: true,
    isMentalHealth: true,
    verified: true,
    specialties: ["Transplant", "Oncology", "Cardiology", "Neurosurgery", "Psychiatry"],
  },
  {
    id: "ugs2",
    name: "Eldoret Hospital",
    county: "Uasin Gishu",
    subCounty: "Eldoret",
    level: "Level 4",
    type: "private",
    address: "Uganda Road, Eldoret",
    coordinates: { lat: 0.5214, lng: 35.2757 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "ugs3",
    name: "Huruma Hospital",
    county: "Uasin Gishu",
    subCounty: "Eldoret",
    level: "Level 3",
    type: "faith-based",
    address: "Huruma, Eldoret",
    coordinates: { lat: 0.4989, lng: 35.2812 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 6. MERU COUNTY
  // ===========================
  {
    id: "mer1",
    name: "Meru Teaching & Referral Hospital",
    county: "Meru",
    subCounty: "Imenti North",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Meru Town",
    coordinates: { lat: 0.0474, lng: 37.6494 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "mer2",
    name: "Consolata Hospital Nkubu",
    county: "Meru",
    subCounty: "Imenti South",
    level: "Level 4",
    type: "faith-based",
    address: "Nkubu, Meru County",
    coordinates: { lat: -0.0361, lng: 37.6002 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 7. EMBU COUNTY
  // ===========================
  {
    id: "emb1",
    name: "Embu Level 5 Teaching & Referral Hospital",
    county: "Embu",
    subCounty: "Embu East",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Embu Town",
    coordinates: { lat: -0.5320, lng: 37.4580 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 8. NYERI COUNTY
  // ===========================
  {
    id: "nyr1",
    name: "Nyeri County Referral Hospital",
    county: "Nyeri",
    subCounty: "Nyeri Central",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Nyeri Town",
    coordinates: { lat: -0.4218, lng: 36.9487 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "nyr2",
    name: "Consolata Hospital Nyeri",
    county: "Nyeri",
    subCounty: "Nyeri Central",
    level: "Level 4",
    type: "faith-based",
    address: "Hospital Road, Nyeri",
    coordinates: { lat: -0.4193, lng: 36.9491 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "nyr3",
    name: "Karatina District Hospital",
    county: "Nyeri",
    subCounty: "Mathira",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Karatina",
    coordinates: { lat: -0.4879, lng: 37.1274 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 9. KISII COUNTY
  // ===========================
  {
    id: "ksi1",
    name: "Kisii Teaching & Referral Hospital",
    county: "Kisii",
    subCounty: "Kisii Central",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Kisii Town",
    coordinates: { lat: -0.6822, lng: 34.7663 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "ksi2",
    name: "Kisii Hospital",
    county: "Kisii",
    subCounty: "Kisii Central",
    level: "Level 4",
    type: "private",
    address: "Moi Highway, Kisii",
    coordinates: { lat: -0.6793, lng: 34.7698 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 10. KAKAMEGA COUNTY
  // ===========================
  {
    id: "kkm1",
    name: "Kakamega County General Hospital",
    county: "Kakamega",
    subCounty: "Kakamega Central",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Kakamega Town",
    coordinates: { lat: 0.2827, lng: 34.7519 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 11. BUNGOMA COUNTY
  // ===========================
  {
    id: "bng1",
    name: "Bungoma County Referral Hospital",
    county: "Bungoma",
    subCounty: "Bungoma Central",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Bungoma Town",
    coordinates: { lat: 0.5635, lng: 34.5608 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 12. TRANS NZOIA COUNTY
  // ===========================
  {
    id: "tnz1",
    name: "Kitale County Referral Hospital",
    county: "Trans Nzoia",
    subCounty: "Kitale",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Kitale",
    coordinates: { lat: 1.0157, lng: 35.0057 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 13. MACHAKOS COUNTY
  // ===========================
  {
    id: "mck1",
    name: "Machakos Level 5 Hospital",
    county: "Machakos",
    subCounty: "Machakos Town",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Machakos Town",
    coordinates: { lat: -1.5177, lng: 37.2634 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 14. KIAMBU COUNTY
  // ===========================
  {
    id: "kmb1",
    name: "Kiambu Level 5 Hospital",
    county: "Kiambu",
    subCounty: "Kiambu",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Kiambu Town",
    coordinates: { lat: -1.1713, lng: 36.8282 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "kmb2",
    name: "Thika Level 5 Hospital",
    county: "Kiambu",
    subCounty: "Thika",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Thika",
    coordinates: { lat: -1.0380, lng: 37.0927 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "kmb3",
    name: "AIC Kijabe Hospital",
    county: "Kiambu",
    subCounty: "Lari",
    level: "Level 4",
    type: "faith-based",
    phone: "020 3242000",
    address: "Kijabe, Lari, Kiambu County",
    coordinates: { lat: -0.9384, lng: 36.5862 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: true,
    specialties: ["Neurosurgery", "Ophthalmology", "Cleft Surgery"],
  },
  {
    id: "kmb4",
    name: "PCEA Kikuyu Hospital",
    county: "Kiambu",
    subCounty: "Kikuyu",
    level: "Level 4",
    type: "faith-based",
    phone: "020 2032150",
    address: "Hospital Road, Kikuyu",
    coordinates: { lat: -1.2457, lng: 36.6643 },
    isBloodBank: true,
    isMentalHealth: false,
    verified: true,
    specialties: ["Ophthalmology", "Physiotherapy"],
  },

  // ===========================
  // 15. MURANGA COUNTY
  // ===========================
  {
    id: "mrg1",
    name: "Murang'a Level 5 Hospital",
    county: "Murang'a",
    subCounty: "Murang'a",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Murang'a Town",
    coordinates: { lat: -0.7218, lng: 37.1535 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 16. KIRINYAGA COUNTY
  // ===========================
  {
    id: "krg1",
    name: "Kerugoya District Hospital",
    county: "Kirinyaga",
    subCounty: "Kirinyaga Central",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kerugoya",
    coordinates: { lat: -0.5002, lng: 37.2811 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 17. NYANDARUA COUNTY
  // ===========================
  {
    id: "nnd1",
    name: "Ol Kalou District Hospital",
    county: "Nyandarua",
    subCounty: "Kinangop",
    level: "Level 4",
    type: "public",
    address: "Ol Kalou, Nyandarua County",
    coordinates: { lat: -0.2681, lng: 36.7907 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 18. LAIKIPIA COUNTY
  // ===========================
  {
    id: "lkp1",
    name: "Nyahururu District Hospital",
    county: "Laikipia",
    subCounty: "Laikipia North",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Nyahururu",
    coordinates: { lat: 0.0286, lng: 36.3673 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 19. GARISSA COUNTY
  // ===========================
  {
    id: "gar1",
    name: "Garissa County Referral Hospital",
    county: "Garissa",
    subCounty: "Garissa",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Garissa Town",
    coordinates: { lat: -0.4550, lng: 39.6453 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 20. WAJIR COUNTY
  // ===========================
  {
    id: "waj1",
    name: "Wajir District Hospital",
    county: "Wajir",
    subCounty: "Wajir",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Wajir Town",
    coordinates: { lat: 1.7471, lng: 40.0566 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 21. MANDERA COUNTY
  // ===========================
  {
    id: "man1",
    name: "Mandera County Referral Hospital",
    county: "Mandera",
    subCounty: "Mandera Central",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Mandera Town",
    coordinates: { lat: 3.9366, lng: 41.8669 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 22. MARSABIT COUNTY
  // ===========================
  {
    id: "mrs1",
    name: "Marsabit District Hospital",
    county: "Marsabit",
    subCounty: "Marsabit",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Marsabit Town",
    coordinates: { lat: 2.3284, lng: 37.9899 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 23. ISIOLO COUNTY
  // ===========================
  {
    id: "iso1",
    name: "Isiolo County Referral Hospital",
    county: "Isiolo",
    subCounty: "Isiolo",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Isiolo Town",
    coordinates: { lat: 0.3541, lng: 37.5820 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 24. THARAKA NITHI COUNTY
  // ===========================
  {
    id: "thn1",
    name: "Chuka District Hospital",
    county: "Tharaka Nithi",
    subCounty: "Chuka/Igambang'ombe",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Chuka",
    coordinates: { lat: -0.3353, lng: 37.6483 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 25. KITUI COUNTY
  // ===========================
  {
    id: "ktu1",
    name: "Kitui County Referral Hospital",
    county: "Kitui",
    subCounty: "Kitui Central",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kitui Town",
    coordinates: { lat: -1.3683, lng: 38.0105 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 26. MAKUENI COUNTY
  // ===========================
  {
    id: "mku1",
    name: "Makueni County Referral Hospital",
    county: "Makueni",
    subCounty: "Makueni",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Makueni Town",
    coordinates: { lat: -1.8000, lng: 37.6300 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 27. KAJIADO COUNTY
  // ===========================
  {
    id: "kjd1",
    name: "Kajiado District Hospital",
    county: "Kajiado",
    subCounty: "Kajiado Central",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kajiado Town",
    coordinates: { lat: -1.8521, lng: 36.7767 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "kjd2",
    name: "Ngong District Hospital",
    county: "Kajiado",
    subCounty: "Ngong",
    level: "Level 4",
    type: "public",
    address: "Ngong Town, Kajiado County",
    coordinates: { lat: -1.3595, lng: 36.6562 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 28. NAROK COUNTY
  // ===========================
  {
    id: "nrk1",
    name: "Narok County Referral Hospital",
    county: "Narok",
    subCounty: "Narok North",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Narok Town",
    coordinates: { lat: -1.0837, lng: 35.8691 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 29. KERICHO COUNTY
  // ===========================
  {
    id: "krc1",
    name: "Kericho County Referral Hospital",
    county: "Kericho",
    subCounty: "Kericho",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kericho Town",
    coordinates: { lat: -0.3686, lng: 35.2863 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 30. BOMET COUNTY
  // ===========================
  {
    id: "bmt1",
    name: "Bomet County Referral Hospital",
    county: "Bomet",
    subCounty: "Bomet Central",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Bomet Town",
    coordinates: { lat: -0.7842, lng: 35.3424 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "bmt2",
    name: "Tenwek Hospital",
    county: "Bomet",
    subCounty: "Bomet West",
    level: "Level 4",
    type: "faith-based",
    address: "Tenwek, Bomet County",
    coordinates: { lat: -0.8721, lng: 35.2897 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: ["Surgery", "Cardiac Surgery", "Ophthalmology"],
  },

  // ===========================
  // 31. BARINGO COUNTY
  // ===========================
  {
    id: "brg1",
    name: "Kabarnet District Hospital",
    county: "Baringo",
    subCounty: "Baringo Central",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kabarnet",
    coordinates: { lat: 0.4927, lng: 35.7424 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 32. NANDI COUNTY
  // ===========================
  {
    id: "nnd2",
    name: "Nandi Hills District Hospital",
    county: "Nandi",
    subCounty: "Nandi Hills",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Nandi Hills",
    coordinates: { lat: 0.1054, lng: 35.1778 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "nnd3",
    name: "Kapsabet District Hospital",
    county: "Nandi",
    subCounty: "Kapsabet",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kapsabet",
    coordinates: { lat: 0.2000, lng: 35.0997 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 33. ELGEYO MARAKWET COUNTY
  // ===========================
  {
    id: "elm1",
    name: "Iten District Hospital",
    county: "Elgeyo Marakwet",
    subCounty: "Keiyo North",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Iten",
    coordinates: { lat: 0.6720, lng: 35.5100 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 34. WEST POKOT COUNTY
  // ===========================
  {
    id: "wpk1",
    name: "Kapenguria District Hospital",
    county: "West Pokot",
    subCounty: "Kapenguria",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kapenguria",
    coordinates: { lat: 1.2382, lng: 35.1128 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 35. TURKANA COUNTY
  // ===========================
  {
    id: "trk1",
    name: "Lodwar District Hospital",
    county: "Turkana",
    subCounty: "Turkana Central",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Lodwar",
    coordinates: { lat: 3.1193, lng: 35.5950 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 36. SAMBURU COUNTY
  // ===========================
  {
    id: "smb1",
    name: "Maralal District Hospital",
    county: "Samburu",
    subCounty: "Samburu North",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Maralal",
    coordinates: { lat: 1.0983, lng: 36.6996 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 37. SIAYA COUNTY
  // ===========================
  {
    id: "sia1",
    name: "Siaya County Referral Hospital",
    county: "Siaya",
    subCounty: "Siaya",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Siaya Town",
    coordinates: { lat: 0.0618, lng: 34.2878 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 38. HOMA BAY COUNTY
  // ===========================
  {
    id: "hmb1",
    name: "Homa Bay County Teaching & Referral Hospital",
    county: "Homa Bay",
    subCounty: "Homa Bay Town",
    level: "Level 5",
    type: "public",
    address: "Hospital Road, Homa Bay",
    coordinates: { lat: -0.5270, lng: 34.4576 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 39. MIGORI COUNTY
  // ===========================
  {
    id: "mgr1",
    name: "Migori County Referral Hospital",
    county: "Migori",
    subCounty: "Migori",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Migori Town",
    coordinates: { lat: -1.0634, lng: 34.4731 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 40. NYAMIRA COUNTY
  // ===========================
  {
    id: "nyr4",
    name: "Nyamira District Hospital",
    county: "Nyamira",
    subCounty: "Nyamira North",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Nyamira Town",
    coordinates: { lat: -0.5671, lng: 34.9363 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 41. VIHIGA COUNTY
  // ===========================
  {
    id: "vhg1",
    name: "Vihiga District Hospital",
    county: "Vihiga",
    subCounty: "Vihiga",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Mbale, Vihiga",
    coordinates: { lat: 0.0736, lng: 34.7228 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 42. BUSIA COUNTY
  // ===========================
  {
    id: "bus1",
    name: "Busia District Hospital",
    county: "Busia",
    subCounty: "Busia",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Busia Town",
    coordinates: { lat: 0.4606, lng: 34.1112 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 43. KWALE COUNTY
  // ===========================
  {
    id: "kwl1",
    name: "Kwale District Hospital",
    county: "Kwale",
    subCounty: "Kwale",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kwale Town",
    coordinates: { lat: -4.1738, lng: 39.4491 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 44. KILIFI COUNTY
  // ===========================
  {
    id: "klf1",
    name: "Kilifi County Hospital",
    county: "Kilifi",
    subCounty: "Kilifi North",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Kilifi Town",
    coordinates: { lat: -3.6305, lng: 39.8499 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
  {
    id: "klf2",
    name: "Malindi District Hospital",
    county: "Kilifi",
    subCounty: "Malindi",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Malindi",
    coordinates: { lat: -3.2149, lng: 40.1169 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 45. TANA RIVER COUNTY
  // ===========================
  {
    id: "tnr1",
    name: "Hola District Hospital",
    county: "Tana River",
    subCounty: "Bura",
    level: "Level 3",
    type: "public",
    address: "Hola, Tana River County",
    coordinates: { lat: -1.4986, lng: 40.0226 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 46. LAMU COUNTY
  // ===========================
  {
    id: "lmu1",
    name: "King Fahad District Hospital",
    county: "Lamu",
    subCounty: "Lamu East",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Lamu Island",
    coordinates: { lat: -2.2694, lng: 40.9021 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },

  // ===========================
  // 47. TAITA TAVETA COUNTY
  // ===========================
  {
    id: "ttv1",
    name: "Moi District Hospital Voi",
    county: "Taita Taveta",
    subCounty: "Voi",
    level: "Level 4",
    type: "public",
    address: "Hospital Road, Voi",
    coordinates: { lat: -3.3963, lng: 38.5572 },
    isBloodBank: false,
    isMentalHealth: false,
    verified: false,
    specialties: [],
  },
];

export const KENYA_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet",
  "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay",
  "Migori", "Kisii", "Nyamira", "Nairobi",
] as const;

export type KenyaCounty = typeof KENYA_COUNTIES[number];
