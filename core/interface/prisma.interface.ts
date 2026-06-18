export enum Status {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export interface BaseEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: Status | string;
}

export interface Faq extends BaseEntity {
  question?: string;
  answer?: string;
  order?: number;
}

export interface Campaign extends BaseEntity {
  title?: string;
  description?: string;
  isLive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Collection extends BaseEntity {
  title?: string;
  slug?: string;
  isLive?: boolean;
  tag?: string[];
  image?: string;
}

export interface Category extends BaseEntity {
  name?: string;
  slug?: string;
  parentId?: string | null;
  children?: Category[];
  viewType?: string;
}

export interface Holiday extends BaseEntity {
  name?: string;
  date?: string;
}

export interface Review extends BaseEntity {
  rating?: number;
  comment?: string;
  productId?: string;
}

export interface Article extends BaseEntity {
  title?: string;
  slug?: string;
  content?: string;
  tag?: string[];
}

export interface Feed extends BaseEntity {
  title?: string;
  content?: string;
  tag?: string[];
}

export interface DeliveryMethod extends BaseEntity {
  name?: string;
  isCompanySpecificVisible?: boolean;
  tags?: string[];
}

export interface PaymentMethod extends BaseEntity {
  name?: string;
  isCompanySpecificVisible?: boolean;
  tags?: string[];
}

export interface BankAccount extends BaseEntity {
  bankName?: string;
  iban?: string;
  isCompanySpecificVisible?: boolean;
  tags?: string[];
}

export interface Brand extends BaseEntity {
  name?: string;
  slug?: string;
  tag?: string[];
  logo?: string;
}

export interface Organization extends BaseEntity {
  name?: string;
  slug?: string;
  email?: string;
  phone?: string;
  address?: string;
}
