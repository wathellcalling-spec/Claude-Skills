/* Shared flow helpers: validators + formatters */

export const isEmail = (s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((s || "").trim());
export const isPhone = (s) => (s || "").replace(/[^0-9]/g, "").length >= 10;
export const req = (s) => !!(s && String(s).trim());

export function contactErrors(v) {
  const e = {};
  if (!req(v.firstName)) e.firstName = "Required";
  if (!req(v.lastName)) e.lastName = "Required";
  if (!req(v.email)) e.email = "Email is required";
  else if (!isEmail(v.email)) e.email = "Enter a valid email address";
  if (!req(v.phone)) e.phone = "Phone is required";
  else if (!isPhone(v.phone)) e.phone = "Enter a valid 10-digit number";
  return e;
}

export const cap = (s) =>
  s == null ? "—" : String(s).charAt(0).toUpperCase() + String(s).slice(1);

export function fmtMoney(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

/* Sign a lead in with the mock Google account */
export function signInGoogle(set) {
  set("firstName", GOOGLE_ACCOUNT.firstName);
  set("lastName", GOOGLE_ACCOUNT.lastName);
  set("email", GOOGLE_ACCOUNT.email);
  set("googleVerified", true);
}

/* Timeline options shared across steps */
export const TIMELINE_OPTS = [
  { value: "immediate", label: "Immediate", sub: "ASAP" },
  { value: "3 months", label: "3 Months", sub: "Soon" },
  { value: "6 months", label: "6 Months", sub: "Planning" },
  { value: "over the years", label: "Over Time", sub: "Browsing" },
];

export const LOAN_TYPES = [
  "Conventional 30-yr Fixed",
  "Conventional 15-yr Fixed",
  "FHA",
  "VA",
  "Jumbo",
  "ARM 7/6",
];
export const CREDIT_BANDS = [
  "800+ (Excellent)",
  "740–799 (Very Good)",
  "670–739 (Good)",
  "580–669 (Fair)",
  "Below 580",
];
export const EMPLOYMENT = [
  "Employed — W2",
  "Self-employed",
  "Business owner",
  "Retired",
  "Other",
];

/* Calendar helpers (SAS / injected showing) */
export function buildDays() {
  const base = new Date(2026, 5, 3); // June 3, 2026
  const days = [];
  for (let i = 0; i < 10; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push({
      key: i,
      dow: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: String(d.getDate()).padStart(2, "0"),
      mon: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days;
}

export const TIMES = [
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM",
  "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
];
