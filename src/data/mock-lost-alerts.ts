import type { LostAlert } from "@/types/lost-alert";

export const mockLostAlerts: LostAlert[] = [
  {
    id: "mock-1",
    description: "Blue Jansport backpack with a chemistry patch",
    locationLastSeen: "Near the bike racks after 6th period",
    createdAt: new Date().toISOString(),
    postedByUsername: "chem_student",
  },
  {
    id: "mock-2",
    description: "AirPods in a white case (initials A.M. on the lid)",
    locationLastSeen: "Library study room 2, Tuesday after school",
    createdAt: new Date().toISOString(),
    postedByUsername: "library_regular",
  },
];
