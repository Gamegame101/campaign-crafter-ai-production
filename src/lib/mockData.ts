import { supabase } from "@/integrations/supabase/client";

// Demo campaign images for preview
import demoCampaign1 from "@/assets/demo-campaign-1.jpg";
import demoCampaign2 from "@/assets/demo-campaign-2.jpg";
import demoCampaign3 from "@/assets/demo-campaign-3.jpg";
import demoCampaign4 from "@/assets/demo-campaign-4.jpg";
import demoCampaign5 from "@/assets/demo-campaign-5.jpg";
import demoCampaign6 from "@/assets/demo-campaign-6.jpg";

export const DEMO_CAMPAIGN_IMAGES = [
  demoCampaign1,
  demoCampaign2,
  demoCampaign3,
  demoCampaign4,
  demoCampaign5,
  demoCampaign6,
];

export const getRandomDemoImage = (): string => {
  const randomIndex = Math.floor(Math.random() * DEMO_CAMPAIGN_IMAGES.length);
  return DEMO_CAMPAIGN_IMAGES[randomIndex];
};

// Content Strategy Types
export type ContentStrategy = "organic" | "paid" | "mixed";
export type PostingFrequency = "daily" | "3-per-week" | "weekly";

export const CONTENT_STRATEGIES = [
  { 
    value: "organic" as ContentStrategy, 
    label: "Organic Posts", 
    labelTh: "โพสต์ทั่วไป",
    description: "Multiple varied posts per platform",
    descriptionTh: "สร้างหลายโพสต์ต่อ platform กระจายตามความถี่ที่เลือก",
    icon: "Megaphone",
    recommended: "Engagement"
  },
  { 
    value: "paid" as ContentStrategy, 
    label: "Paid Ads", 
    labelTh: "โฆษณา",
    description: "1-3 creatives with daily ad runs",
    descriptionTh: "1-3 Creative หลักต่อ platform พร้อม schedule ยิงโฆษณาทุกวัน",
    icon: "DollarSign",
    recommended: "Conversion"
  },
  { 
    value: "mixed" as ContentStrategy, 
    label: "Mixed", 
    labelTh: "ผสมผสาน",
    description: "Organic posts + boosted/ads",
    descriptionTh: "ผสมทั้งโพสต์ Organic และ Boosted Posts/Ads",
    icon: "Layers",
    recommended: "Both"
  }
];

export const POSTING_FREQUENCIES = [
  { value: "daily" as PostingFrequency, label: "Daily", labelTh: "ทุกวัน" },
  { value: "3-per-week" as PostingFrequency, label: "3x per week", labelTh: "3 ครั้ง/สัปดาห์" },
  { value: "weekly" as PostingFrequency, label: "Weekly", labelTh: "สัปดาห์ละครั้ง" }
];

// Calculate number of posts based on frequency and campaign days
export const calculatePostCount = (frequency: PostingFrequency, campaignDays: number): number => {
  switch (frequency) {
    case "daily":
      return Math.min(campaignDays, 7); // Cap at 7 for AI generation
    case "3-per-week":
      return Math.ceil((campaignDays / 7) * 3);
    case "weekly":
      return Math.ceil(campaignDays / 7);
    default:
      return 3;
  }
};

export interface CampaignFormData {
  industry: string;
  targetAudience: string;
  objective: string;
  budget: string;
  customBudget?: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  channels: string[];
  creativeTheme: string;
  kpis: string[];
  campaignBrief?: string;
  contentStrategy: ContentStrategy;
  postingFrequency: PostingFrequency;
  organization_id?: string;
  product_id?: string;
  service_id?: string;
  campaign_focus: 'general' | 'product' | 'service';
}

export interface KPICategory {
  name: string;
  objective: string;
  kpis: string[];
}

// Facebook Ads Manager KPIs based on actual analytics
export const FACEBOOK_KPI_CATEGORIES: KPICategory[] = [
  {
    name: "Awareness",
    objective: "Brand Awareness",
    kpis: [
      "Reach",
      "Impressions",
      "CPM",
      "Frequency",
    ],
  },
  {
    name: "Engagement",
    objective: "Engagement",
    kpis: [
      "Post Engagement",
      "Page Likes",
      "CTR",
      "CPC",
    ],
  },
  {
    name: "Traffic",
    objective: "Consideration",
    kpis: [
      "Link Clicks",
      "Landing Page Views",
      "Cost per Link Click",
    ],
  },
  {
    name: "Conversions",
    objective: "Conversion",
    kpis: [
      "Conversions",
      "Cost per Conversion",
      "ROAS",
      "Purchase Value",
    ],
  },
];

// Keep old name for backward compatibility
export const KPI_CATEGORIES = FACEBOOK_KPI_CATEGORIES;

// Budget options
export const BUDGET_OPTIONS = [
  { value: "10000", label: "฿10,000" },
  { value: "30000", label: "฿30,000" },
  { value: "50000", label: "฿50,000" },
  { value: "100000", label: "฿100,000" },
  { value: "300000", label: "฿300,000" },
  { value: "500000", label: "฿500,000" },
  { value: "1000000", label: "฿1,000,000" },
  { value: "custom", label: "Custom" },
];

// Post types
export type PostType = "organic" | "boosted" | "ad";

// Single post item structure (new format supports arrays)
export interface PostItemData {
  day?: number;
  time?: string;
  postType?: PostType;
  caption?: string;
  visual_prompt?: string;
  carousel?: string[];
  hook?: string;
  script?: string;
  title?: string;
  description?: string;
  message?: string;
  cta?: string;
}

// Ad Schedule item for paid campaigns
export interface AdScheduleItem {
  platform: string;
  daily_budget: number;
  total_budget: number;
  run_dates: string[];
}

export interface CampaignResult {
  campaign_summary: string;
  big_idea: string;
  key_messages: string[];
  visual_direction: string;
  audience_insights?: string;
  channel_strategy?: string;
  posts: {
    Facebook?: PostItemData | PostItemData[];
    Instagram?: PostItemData | PostItemData[];
    TikTok?: PostItemData | PostItemData[];
    YouTube?: PostItemData | PostItemData[];
    "Line OA"?: PostItemData | PostItemData[];
  };
  ad_schedule?: AdScheduleItem[];
}

// AI-powered campaign generation using Lovable AI
export const generateCampaign = async (formData: CampaignFormData): Promise<CampaignResult> => {
  const { data, error } = await supabase.functions.invoke('generate-campaign', {
    body: {
      industry: formData.industry,
      targetAudience: formData.targetAudience,
      objective: formData.objective,
      budget: formData.budget,
      startDate: formData.startDate?.toISOString(),
      endDate: formData.endDate?.toISOString(),
      channels: formData.channels,
      creativeTheme: formData.creativeTheme,
      kpis: formData.kpis,
    },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "Failed to generate campaign");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as CampaignResult;
};

// Fallback mock generation for testing/demo
export const mockGenerateCampaign = (formData: CampaignFormData): Promise<CampaignResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result: CampaignResult = {
        campaign_summary: `An innovative ${formData.objective.toLowerCase()} campaign targeting ${formData.targetAudience} in the ${formData.industry} industry. This campaign leverages ${formData.channels.join(", ")} to create maximum impact with the theme of "${formData.creativeTheme}". Budget allocation of ${formData.budget} will be distributed strategically across all touchpoints.`,
        big_idea: `"${formData.creativeTheme}" — Empowering ${formData.targetAudience} to discover new possibilities through authentic storytelling and immersive digital experiences that resonate with their lifestyle.`,
        key_messages: [
          `Unlock your potential with ${formData.industry}'s most innovative solutions`,
          `Designed specifically for ${formData.targetAudience} who demand excellence`,
          `Join thousands who have already transformed their experience`,
          `Limited time opportunity — Act now for exclusive benefits`,
        ],
        visual_direction: `Modern, vibrant visuals featuring authentic lifestyle photography combined with bold typography. Color palette: energetic gradients with pops of ${formData.industry === "Technology" ? "electric blue" : "warm coral"}. Emphasis on human connection and emotional storytelling. Clean layouts with ample white space for premium feel.`,
        audience_insights: `${formData.targetAudience} are digitally native, value authenticity, and respond to content that speaks to their aspirations. They spend significant time on ${formData.channels.join(" and ")}, preferring snackable content with strong visual appeal.`,
        channel_strategy: `A synchronized multi-channel approach where ${formData.channels[0]} drives awareness, supported by complementary content across ${formData.channels.slice(1).join(", ")}. Each platform plays a specific role in the customer journey.`,
        posts: {},
      };

      if (formData.channels.includes("Facebook")) {
        result.posts.Facebook = {
          caption: `🚀 Ready to transform your ${formData.industry.toLowerCase()} experience?\n\n${formData.targetAudience}, we hear you. That's why we created something special just for you.\n\n✨ Discover the difference that matters\n💡 Innovation meets simplicity\n🎯 Results that speak for themselves\n\nTap the link to learn more! 👆\n\n#${formData.industry.replace(/\s+/g, "")} #Innovation #${formData.objective.replace(/\s+/g, "")}`,
          visual_prompt: `Professional lifestyle photo showing diverse ${formData.targetAudience.toLowerCase()} engaging with modern ${formData.industry.toLowerCase()} products. Warm lighting, authentic expressions, premium setting. Overlay with subtle brand elements and call-to-action button.`,
        };
      }

      if (formData.channels.includes("Instagram")) {
        result.posts.Instagram = {
          caption: `The future of ${formData.industry.toLowerCase()} is here ✨\n\nSwipe to see how we're changing the game for ${formData.targetAudience.toLowerCase()} →\n\n#${formData.industry.replace(/\s+/g, "")} #Lifestyle #Innovation #${formData.objective.replace(/\s+/g, "")}`,
          carousel: [
            "Hero image: Bold typography with campaign tagline over gradient background",
            "Problem statement: Relatable pain point illustration",
            "Solution reveal: Product/service showcase with key benefits",
            "Social proof: Testimonial cards with user photos",
            "CTA: Swipe up prompt with limited offer details",
          ],
        };
      }

      if (formData.channels.includes("TikTok")) {
        result.posts.TikTok = {
          hook: `POV: You just discovered the secret that ${formData.targetAudience.toLowerCase()} don't want you to know... 👀`,
          script: `[0-3s] Hook with trending sound\n[3-8s] "You know that feeling when..."\n[8-15s] Problem agitation with relatable scenarios\n[15-25s] Solution reveal with visual transformation\n[25-30s] CTA: "Link in bio for exclusive access"\n\nTrending sounds: Use current viral audio\nText overlays: Bold, punchy statements\nEffects: Smooth transitions, slight zoom`,
        };
      }

      if (formData.channels.includes("YouTube")) {
        result.posts.YouTube = {
          title: `How ${formData.targetAudience} Are Revolutionizing ${formData.industry} in 2024 | Must Watch`,
          description: `In this video, we explore the groundbreaking ways ${formData.targetAudience.toLowerCase()} are transforming the ${formData.industry.toLowerCase()} landscape.\n\n🔔 Subscribe for more insights\n👍 Like if you found this valuable\n💬 Comment your thoughts below\n\nTimestamps:\n0:00 - Introduction\n1:30 - The Problem\n3:45 - Our Solution\n6:00 - Real Results\n8:30 - How to Get Started\n\n🔗 Links:\n→ Learn more: [website]\n→ Free trial: [link]\n→ Community: [discord]\n\n#${formData.industry.replace(/\s+/g, "")} #${formData.objective.replace(/\s+/g, "")}`,
        };
      }

      if (formData.channels.includes("Line OA")) {
        result.posts["Line OA"] = {
          message: `🎉 Exclusive for our LINE friends!\n\nHi there! We have exciting news for ${formData.targetAudience.toLowerCase()} like you.\n\n✅ Special early access\n✅ Member-only discounts\n✅ Priority support\n\nReply "START" to unlock your exclusive benefits!`,
          cta: "Tap to claim your offer →",
        };
      }

      resolve(result);
    }, 2000);
  });
};

export const CAMPAIGN_OBJECTIVES = [
  "Brand Awareness",
  "Engagement",
  "Consideration",
  "Conversion",
  "Retention",
  "Advocacy",
];

export const INDUSTRIES = [
  "Food & Beverage",
  "Technology",
  "Healthcare",
  "Retail",
  "Education",
  "Finance",
  "Automotive",
  "Travel & Hospitality",
  "Beauty & Personal Care",
  "Real Estate",
];

export const TARGET_AUDIENCES = [
  "Gen Z (18–24)",
  "Young Professionals (25–34)",
  "Millennials (25–40)",
  "Gen X (35–50)",
  "Students",
  "Office Workers",
  "Freelancers / Remote Workers",
  "Working Moms / Dads",
  "Pet Owners",
  "Fitness Enthusiasts",
  "Beauty & Cosmetic Enthusiasts",
  "Tech Enthusiasts",
  "Budget-Conscious Shoppers",
  "Luxury Lifestyle Seekers",
  "Heavy TikTok Users",
  "Instagram Visual Consumers",
  "YouTube Learners",
  "SME Business Owners",
];

export const AVAILABLE_CHANNELS = [
  "Facebook",
  "Instagram",
  "TikTok",
  "YouTube",
  "Line OA",
];

// Organization, Product, and Service Management
export interface Organization {
  id: string;
  name: string;
  description: string;
  industry: string;
  logo?: string;
  website?: string;
  created_at: string;
}

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  image?: string;
  features: string[];
  target_audience: string;
  created_at: string;
}

export interface Service {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  duration?: string;
  features: string[];
  target_audience: string;
  created_at: string;
}

// Mock data
export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "TechFlow Solutions",
    description: "Leading software development company specializing in AI and automation",
    industry: "Technology",
    website: "https://techflow.com",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "org-2",
    name: "GreenLeaf Organics",
    description: "Organic food and beverage company promoting healthy living",
    industry: "Food & Beverage",
    website: "https://greenleaf.co.th",
    created_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "org-3",
    name: "FitLife Gym",
    description: "Modern fitness center with personal training services",
    industry: "Healthcare",
    website: "https://fitlife.co.th",
    created_at: "2024-01-20T00:00:00Z"
  },
  {
    id: "org-4",
    name: "StyleCraft Boutique",
    description: "Premium fashion retailer specializing in designer collections",
    industry: "Retail",
    website: "https://stylecraft.co.th",
    created_at: "2024-01-25T00:00:00Z"
  },
  {
    id: "org-5",
    name: "EduTech Academy",
    description: "Online education platform offering professional courses",
    industry: "Education",
    website: "https://edutech.co.th",
    created_at: "2024-02-01T00:00:00Z"
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    organization_id: "org-1",
    name: "AI Assistant Pro",
    description: "Advanced AI-powered virtual assistant for businesses",
    category: "Software",
    price: 2999,
    features: ["24/7 Support", "Multi-language", "Custom Training", "API Integration"],
    target_audience: "SME Business Owners",
    created_at: "2024-01-10T00:00:00Z"
  },
  {
    id: "prod-2",
    organization_id: "org-1",
    name: "Smart Analytics Dashboard",
    description: "Real-time business intelligence and analytics platform",
    category: "Software",
    price: 1999,
    features: ["Real-time Data", "Custom Reports", "Mobile App", "Team Collaboration"],
    target_audience: "Young Professionals (25–34)",
    created_at: "2024-01-20T00:00:00Z"
  },
  {
    id: "prod-3",
    organization_id: "org-2",
    name: "Organic Smoothie",
    description: "Fresh organic fruit smoothies with superfoods",
    category: "Food & Beverage",
    price: 120,
    features: ["100% Organic", "No Sugar Added", "Superfood Boost", "Fresh Daily"],
    target_audience: "Health-Conscious Consumers",
    created_at: "2024-02-01T00:00:00Z"
  },
  {
    id: "prod-4",
    organization_id: "org-2",
    name: "Protein Energy Bar",
    description: "Natural protein bars made with organic ingredients",
    category: "Food & Beverage",
    price: 45,
    features: ["Plant-based Protein", "Gluten-free", "No Preservatives", "Eco Packaging"],
    target_audience: "Fitness Enthusiasts",
    created_at: "2024-02-05T00:00:00Z"
  },
  {
    id: "prod-5",
    organization_id: "org-4",
    name: "Designer Handbag",
    description: "Luxury leather handbag from exclusive designer collection",
    category: "Fashion",
    price: 8900,
    features: ["Genuine Leather", "Limited Edition", "Handcrafted", "Lifetime Warranty"],
    target_audience: "Young Women (18–30)",
    created_at: "2024-02-10T00:00:00Z"
  },
  {
    id: "prod-6",
    organization_id: "org-4",
    name: "Premium Watch",
    description: "Swiss-made luxury watch with automatic movement",
    category: "Fashion",
    price: 15900,
    features: ["Swiss Movement", "Sapphire Crystal", "Water Resistant", "Premium Box"],
    target_audience: "Luxury Lifestyle Seekers",
    created_at: "2024-02-15T00:00:00Z"
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: "serv-1",
    organization_id: "org-1",
    name: "AI Consultation",
    description: "Expert consultation on AI implementation for your business",
    category: "Consulting",
    price: 5000,
    duration: "2 hours",
    features: ["Strategy Planning", "Technical Assessment", "ROI Analysis", "Implementation Roadmap"],
    target_audience: "SME Business Owners",
    created_at: "2024-01-05T00:00:00Z"
  },
  {
    id: "serv-2",
    organization_id: "org-1",
    name: "Custom Software Development",
    description: "Tailored software solutions for your business needs",
    category: "Development",
    price: 50000,
    duration: "3 months",
    features: ["Custom Design", "Full Stack Development", "Testing & QA", "Maintenance Support"],
    target_audience: "Tech Enthusiasts",
    created_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "serv-3",
    organization_id: "org-2",
    name: "Nutrition Consultation",
    description: "Personalized nutrition planning with organic food recommendations",
    category: "Consulting",
    price: 800,
    duration: "1 hour",
    features: ["Health Assessment", "Custom Meal Plan", "Organic Food Guide", "Follow-up Support"],
    target_audience: "Health-Conscious Consumers",
    created_at: "2024-02-10T00:00:00Z"
  },
  {
    id: "serv-4",
    organization_id: "org-3",
    name: "Personal Training",
    description: "One-on-one fitness training with certified trainers",
    category: "Fitness",
    price: 1200,
    duration: "1 hour",
    features: ["Certified Trainer", "Custom Workout Plan", "Progress Tracking", "Nutrition Advice"],
    target_audience: "Fitness Enthusiasts",
    created_at: "2024-02-20T00:00:00Z"
  },
  {
    id: "serv-5",
    organization_id: "org-3",
    name: "Group Fitness Classes",
    description: "High-energy group workout sessions for all fitness levels",
    category: "Fitness",
    price: 300,
    duration: "45 minutes",
    features: ["Expert Instructors", "All Levels Welcome", "Modern Equipment", "Community Support"],
    target_audience: "Working Moms / Dads",
    created_at: "2024-02-25T00:00:00Z"
  },
  {
    id: "serv-6",
    organization_id: "org-4",
    name: "Personal Styling",
    description: "Professional styling consultation for your wardrobe",
    category: "Consulting",
    price: 2500,
    duration: "2 hours",
    features: ["Style Assessment", "Wardrobe Planning", "Shopping Assistance", "Color Analysis"],
    target_audience: "Young Women (18–30)",
    created_at: "2024-03-01T00:00:00Z"
  },
  {
    id: "serv-7",
    organization_id: "org-5",
    name: "Online Course",
    description: "Comprehensive online courses with certification",
    category: "Education",
    price: 1500,
    duration: "6 weeks",
    features: ["Interactive Lessons", "Expert Instructors", "Certificate", "Lifetime Access"],
    target_audience: "Students",
    created_at: "2024-03-05T00:00:00Z"
  },
  {
    id: "serv-8",
    organization_id: "org-5",
    name: "Corporate Training",
    description: "Professional development training for corporate teams",
    category: "Training",
    price: 15000,
    duration: "1 day",
    features: ["Customized Content", "Expert Trainers", "Materials Included", "Follow-up Support"],
    target_audience: "Office Workers",
    created_at: "2024-03-10T00:00:00Z"
  }
];

// Product/Service categories
export const PRODUCT_CATEGORIES = [
  "Software",
  "Hardware",
  "Food & Beverage",
  "Fashion",
  "Beauty",
  "Health",
  "Education",
  "Entertainment"
];

export const SERVICE_CATEGORIES = [
  "Consulting",
  "Design",
  "Development",
  "Marketing",
  "Catering",
  "Maintenance",
  "Training",
  "Support"
];

// Updated CampaignFormData to include product/service selection
export interface CampaignFormDataExtended extends CampaignFormData {
  organization_id?: string;
  product_id?: string;
  service_id?: string;
  campaign_focus: 'general' | 'product' | 'service';
}
