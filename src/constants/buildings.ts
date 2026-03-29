/** Buildings users can pick when reporting a found item */
export const BUILDINGS = [
  "Main building",
  "Science wing",
  "Gymnasium",
  "Library",
  "Cafeteria",
  "Arts building",
  "Athletic fields",
] as const;

export type Building = (typeof BUILDINGS)[number];
