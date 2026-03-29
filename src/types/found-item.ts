export type FoundItem = {
  id: string;
  /** Short description shown as the card heading */
  description: string;
  category: string;
  /** Building or area where the item was found */
  building: string;
  imageUrl?: string;
  /** Display name from profiles (never email) */
  postedByUsername: string;
};
