import { cache } from "react";
import { getDishById } from "@/services/api/dishes";

export const fetchDishById = cache(async (id: string) => {
  return getDishById(id);
});


