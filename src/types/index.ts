export type CategoryId =
  | "websites"
  | "mobile"
  | "ecommerce"
  | "ai"
  | "uiux"
  | "creative"
  | "features"
  | "academic";

export type ProjectStatus = "published" | "draft" | "archived";
export type Availability = "ready" | "queue";
export type VisualKind = "web" | "mobile" | "dash" | "shop" | "ai" | "brand" | "module";
export type VisualMood =
  | "ocean"
  | "sunset"
  | "forest"
  | "neon"
  | "gold"
  | "rose"
  | "mint"
  | "violet";

export type CardHeight = "short" | "medium" | "tall";

export type OrderStatus =
  | "pending"
  | "paid"
  | "in-progress"
  | "customization-required"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded";

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: CategoryId;
  subcategory: string;
  tags: string[];
  technologies: string[];
  features: string[];
  included: string[];
  notIncluded: string[];
  customizationNotes: string;
  maxCustomizationWords: number;
  price: number;
  currency: "USD";
  deliveryDays: number;
  customizable: boolean;
  readyMade: boolean;
  featured: boolean;
  trending: boolean;
  rating: number;
  reviewCount: number;
  views: number;
  favourites: number;
  status: ProjectStatus;
  availability: Availability;
  support: string;
  cover?: string;
  /** Up to 4 images for the project detail gallery (first also used as portfolio cover). */
  gallery?: string[];
  deleted?: boolean;
  createdAt?: string;
  publishedAt?: string;
  visual: {
    kind: VisualKind;
    mood: VisualMood;
    height: CardHeight;
  };
}

export interface Review {
  id: string;
  projectSlug?: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  projectType: string;
  sample: boolean;
  email?: string;
  createdAt?: string;
}

export type NoticeKind = "project" | "feature" | "sale" | "general";

export interface Notice {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  href?: string;
  createdAt: string;
}

export interface FeatureModule {
  id: string;
  name: string;
  summary: string;
  price: number;
  deliveryDays: number;
  tags: string[];
}

export interface UserAccount {
  uid?: string;
  name: string;
  email: string;
  role: "client" | "admin";
  emailVerified?: boolean;
}

export interface Order {
  id: string;
  projectId: string;
  projectTitle: string;
  slug: string;
  price: number;
  express: boolean;
  customized: boolean;
  customization?: string;
  status: OrderStatus;
  createdAt: string;
  deliveryDays: number;
  email?: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  project?: string;
  message: string;
  createdAt: string;
}

export interface CustomizationRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  email: string;
  name: string;
  words: string;
  wordCount: number;
  createdAt: string;
}

export interface Toast {
  id: string;
  title: string;
  detail?: string;
}
