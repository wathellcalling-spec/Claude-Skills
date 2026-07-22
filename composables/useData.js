/* Dummy data for Houzeo Buyer Lead Flow */

export const PROPERTY = {
  price: "$3,150,000",
  priceNum: 3150000,
  address: "19555 NE 37th Ave",
  city: "Aventura, FL 33180",
  beds: 4,
  baths: 5,
  sqft: "4,300",
  type: "Townhouse",
  built: 1988,
  hoa: "$1,006/mo",
  ppsf: "$733/sq.ft",
  estMo: "$15,679/mo",
  lot: "—",
};

export const AGENT = {
  name: "Your Local Agent",
  title: "Licensed Real Estate Agent",
  brokerage: "Houzeo Realty · FL",
  phone: "(305) 555-0148",
  rating: "4.9",
  reviews: 212,
  initials: "LA",
};

// Pre-filled realistic dummy lead data
export const LEAD = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@gmail.com",
  phone: "(302) 401-9224",
  message:
    "I'm very interested in this property and would love to learn more about the waterfront access and HOA amenities. Please reach out.",
  timeline: "3 months",
  exclusiveAgency: "no",
  financeStatus: "yes",
};

// GPA pre-approval dense form dummy data
export const GPA = {
  purchasePrice: "$3,150,000",
  downPayment: "$630,000",
  downPct: "20%",
  loanType: "Conventional 30-yr Fixed",
  annualIncome: "$420,000",
  employment: "Employed — W2",
  creditBand: "740–799 (Very Good)",
  monthlyDebts: "$2,850",
  coBorrower: "Yes",
  propertyUse: "Primary Residence",
  assets: "$880,000",
};

export const IMG = {
  hero: "/assets/hero.svg",
  exterior: "/assets/exterior.svg",
  street: "/assets/street.svg",
  dining: "/assets/dining.svg",
  more: "/assets/more.svg",
  thumb: "/assets/thumb.svg",
};

/* Mock Google account (in production this comes from the OAuth response) */
export const GOOGLE_ACCOUNT = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@gmail.com",
};
