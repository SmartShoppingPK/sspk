export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  category_id: string | null;
  affiliate_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};
