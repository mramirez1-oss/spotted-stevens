import type { FoundItem } from "@/types/found-item";

/** Sample data for local preview only (homepage uses Supabase when configured) */
export const mockFoundItems: FoundItem[] = [
  {
    id: "1",
    description: "Black water bottle",
    category: "Other",
    building: "Gymnasium",
    postedByUsername: "demo_user",
  },
  {
    id: "2",
    description: "Graphing calculator (TI-84)",
    category: "Electronics",
    building: "Science wing — Room 204",
    postedByUsername: "math_wing",
  },
  {
    id: "3",
    description: "Navy hoodie (size M)",
    category: "Clothing",
    building: "Cafeteria",
    postedByUsername: "campus_ops",
  },
];
