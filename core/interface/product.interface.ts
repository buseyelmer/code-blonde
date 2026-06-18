import { Status } from './prisma.interface';

export interface Product {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  articleNumber?: string;
  price?: number;
  salePrice?: number;
  originalPrice?: number;
  status?: Status | string;
  tag?: string[];
  tags?: string[];
  image?: string;
  images?: string[];
  media?: { path?: string } | Array<{ path?: string }>;
  categoryId?: string;
  category?: string;
  brandId?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  categories?: Array<{
    id?: string;
    name?: string;
    slug?: string;
    parentId?: string;
  }>;
}
