export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  dishes: Dish[];
  // Optional business fields for admin-created restaurants
  address?: string;
  postalCode?: string;
  city?: string;
  contactEmail?: string;
}
