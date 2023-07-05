import { Category } from "./Category";

export interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  categories: Category[];
}
