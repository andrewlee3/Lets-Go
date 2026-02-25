// Menu Types
export interface Menu {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}
