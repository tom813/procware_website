export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  iconName: string;
  badge?: string;
}

export interface TestimonialItem {
  id: string;
  duration: string;
  headline: string;
  quote: string;
  authorName?: string;
  authorRole: string;
  orders?: string;
  rating: number;
  wistiaId?: string;
  videoDuration?: string;
  posterUrl?: string;
}

export interface FeatureItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  bullets: string[];
  imageUrl: string;
  imageAlt: string;
  secondaryImageUrl?: string;
  secondaryImageAlt?: string;
  tag?: string;
  highlightBadge?: string;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  actionText?: string;
}

export interface CountryItem {
  name: string;
  flagUrl: string;
  deliveryDays: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  category: "Online Shop" | "Agentur";
  brandName: string;
  date: string;
  imageUrl: string;
  summary: string;
  keyStats: { label: string; value: string }[];
  content: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  youtubeId?: string;
  imageUrl?: string;
  category: string;
  readTime: string;
  content: string;
  htmlContent?: string;
  paragraphs?: string[];
  keyTakeaways?: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
