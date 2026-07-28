// category.model.ts (or inside your service file)
export interface Category {
  id?: number; // Optional if creating a new one, always present when reading
  name: string;
}