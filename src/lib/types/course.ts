export interface CourseModule {
  title: string;
  lessons: string[];
  duration: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: CourseModule[];
  features: string[];
  tier: 'starter' | 'pro' | 'elite';
}

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
  tier: string;
}
