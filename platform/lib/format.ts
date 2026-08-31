/** Display helpers matching the mockup's formatting. */

export const rand = (n: number) => new Intl.NumberFormat("en-ZA").format(n);

export const money = (n: number) =>
  "R " + new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 }).format(n);

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });

/** Estimated value of one truck on a load. */
export const perTruck = (ratePerTon: number, tonnage: number) => ratePerTon * tonnage;
