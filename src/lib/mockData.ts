// Indian-context mock data + helpers used across modules.

export const PEOPLE = [
  { id: "p1", name: "Rahul Sharma", initials: "RS", dept: "Engineering" },
  { id: "p2", name: "Priya Mehta", initials: "PM", dept: "Sales" },
  { id: "p3", name: "Anita Kapoor", initials: "AK", dept: "Finance" },
  { id: "p4", name: "Dev Tiwari", initials: "DT", dept: "Engineering" },
  { id: "p5", name: "Kiran Bose", initials: "KB", dept: "Design" },
  { id: "p6", name: "Sara Joshi", initials: "SJ", dept: "HR" },
  { id: "p7", name: "Aarav Patel", initials: "AP", dept: "Engineering" },
  { id: "p8", name: "Meera Nair", initials: "MN", dept: "Marketing" },
  { id: "p9", name: "Vikram Singh", initials: "VS", dept: "Operations" },
  { id: "p10", name: "Neha Gupta", initials: "NG", dept: "Sales" },
];

export const COMPANIES = [
  "TechCorp India", "Infosys", "HCL Technologies", "Wipro", "Zomato",
  "Swiggy", "Razorpay", "Zepto", "Urban Company", "Nykaa",
  "Flipkart", "Paytm", "BYJU'S", "Ola", "Freshworks",
];

export function inr(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function inrFull(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Seeded random helpers
export function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export function daysFromNow(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().slice(0, 10);
}

export function timeAgo(min: number): string {
  if (min < 60) return `${min}m ago`;
  if (min < 1440) return `${Math.floor(min / 60)}h ago`;
  return `${Math.floor(min / 1440)}d ago`;
}
