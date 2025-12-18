import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { 
  CalendarIcon, 
  Sparkles, 
  Target, 
  Users, 
  Palette, 
  DollarSign, 
  Calendar, 
  Building2,
  BarChart3,
  TrendingUp,
  Star,
  FileText,
  Shuffle,
  Megaphone,
  Layers,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  CampaignFormData, 
  CAMPAIGN_OBJECTIVES, 
  INDUSTRIES, 
  TARGET_AUDIENCES,
  AVAILABLE_CHANNELS,
  KPI_CATEGORIES,
  BUDGET_OPTIONS,
  CONTENT_STRATEGIES,
  POSTING_FREQUENCIES,
  ContentStrategy,
  PostingFrequency,
  Organization,
  Product,
  Service
} from "@/lib/mockData";
import { getOrganizations, getProducts, getServices } from "@/lib/organizationDb";
import { useLanguage } from "@/contexts/LanguageContext";

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
  isLoading: boolean;
  buttonText?: string;
  initialData?: CampaignFormData | null;
}

export const CampaignForm = ({ onSubmit, isLoading, buttonText, initialData }: CampaignFormProps) => {
  const { t, language } = useLanguage();
  const submitButtonText = buttonText || t('generateCampaign');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [formData, setFormData] = useState<CampaignFormData>(() => {
    if (initialData) {
      return initialData;
    }
    return {
      industry: "",
      targetAudience: "",
      objective: "",
      budget: "",
      customBudget: "",
      startDate: undefined,
      endDate: undefined,
      channels: [],
      creativeTheme: "",
      kpis: [],
      campaignBrief: "",
      contentStrategy: "organic",
      postingFrequency: "daily",
      campaign_focus: "general",
      organization_id: "",
      product_id: "",
      service_id: "",
    };
  });

  // Load organizations, products, and services
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgsData, productsData, servicesData] = await Promise.all([
          getOrganizations(),
          getProducts(),
          getServices()
        ]);
        setOrganizations(orgsData);
        setProducts(productsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChannelToggle = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleKPIToggle = (kpi: string) => {
    setFormData((prev) => ({
      ...prev,
      kpis: prev.kpis.includes(kpi)
        ? prev.kpis.filter((k) => k !== kpi)
        : [...prev.kpis, kpi],
    }));
  };

  const isKPIRecommended = (categoryObjective: string) => {
    return formData.objective === categoryObjective;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Campaign scenarios templates
  const CAMPAIGN_SCENARIOS = [
    // การตลาดทั่วไป (5 ชุด)
    {
      campaign_focus: "general",
      industry: "Technology",
      targetAudience: "Tech Enthusiasts",
      objective: "Brand Awareness",
      channels: ["Facebook", "Instagram", "YouTube"],
      theme: "Tech & Futuristic",
      brief: "สร้างการรับรู้แบรนด์บริษัทเทคโนโลยี เน้นนวัตกรรมและความเป็นผู้นำในวงการเทคโนโลยี",
      kpis: ["Reach", "Impressions", "CPM", "Frequency"]
    },
    {
      campaign_focus: "general",
      industry: "Healthcare",
      targetAudience: "Working Moms / Dads",
      objective: "Consideration",
      channels: ["Facebook", "Line OA", "YouTube"],
      theme: "Modern & Minimalist",
      brief: "สร้างภาพลักษณ์ของโรงพยาบาลที่ใส่ใจสุขภาพและความปลอดภัย เน้นการดูแลครอบครัวอย่างครบถ้วน",
      kpis: ["Link Clicks", "Landing Page Views", "Reach", "Cost per Link Click"]
    },
    {
      campaign_focus: "general",
      industry: "Education",
      targetAudience: "Students",
      objective: "Brand Awareness",
      channels: ["TikTok", "Instagram", "YouTube"],
      theme: "Playful & Fun",
      brief: "สร้างภาพลักษณ์ของสถาบันการศึกษาที่ทันสมัยและมีคุณภาพ เน้นการเรียนรู้แบบใหม่",
      kpis: ["Reach", "Impressions", "Post Engagement", "CTR"]
    },
    {
      campaign_focus: "general",
      industry: "Healthcare",
      targetAudience: "SME Business Owners",
      objective: "Conversion",
      channels: ["Facebook", "YouTube", "Line OA"],
      theme: "Clean & Professional",
      brief: "สร้างภาพลักษณ์ของธนาคารที่น่าเชื่อถือและมีเสถียรภาพทางการเงินที่มั่นคง เน้นความปลอดภัยและความโปร่งใส",
      kpis: ["Conversions", "Cost per Conversion", "Link Clicks", "Landing Page Views"]
    },
    {
      campaign_focus: "general",
      industry: "Travel & Hospitality",
      targetAudience: "Young Professionals (25–34)",
      objective: "Consideration",
      channels: ["Instagram", "YouTube", "Facebook"],
      theme: "Natural & Organic",
      brief: "สร้างภาพลักษณ์ของบริษัทท่องเที่ยวที่ใส่ใจสิ่งแวดล้อมและประสบการณ์ที่ไม่ลืม เน้นความยั่งยืนและผ่อนคลาย",
      kpis: ["Link Clicks", "Landing Page Views", "Cost per Link Click", "Reach"]
    },
    // เน้นสินค้า (5 ชุด)
    {
      campaign_focus: "product",
      industry: "Food & Beverage",
      targetAudience: "Young Professionals (25–34)",
      objective: "Conversion",
      channels: ["Facebook", "Instagram", "TikTok"],
      theme: "Fresh & Healthy Living",
      brief: "เปิดตัวเครื่องดื่มสุขภาพใหม่ เน้นส่วนผสมธรรมชาติและผลไม้สด ต้องการกระตุ้นยอดขายและทดลองซื้อ",
      kpis: ["Conversions", "Cost per Conversion", "ROAS", "Link Clicks"]
    },
    {
      campaign_focus: "product",
      industry: "Retail",
      targetAudience: "Young Women (18–30)",
      objective: "Engagement",
      channels: ["Instagram", "TikTok", "Line OA"],
      theme: "Elegant & Luxury",
      brief: "เปิดตัวผลิตภัณฑ์ skincare ใหม่ เน้นส่วนผสมจากสมุนไพรและเทคโนโลยีขั้นสูง ต้องการสร้าง engagement และการทดลองผลิตภัณฑ์",
      kpis: ["Post Engagement", "Page Likes", "CTR", "CPC"]
    },
    {
      campaign_focus: "product",
      industry: "Technology",
      targetAudience: "Tech Enthusiasts",
      objective: "Conversion",
      channels: ["Facebook", "YouTube", "Instagram"],
      theme: "Tech & Futuristic",
      brief: "เปิดตัว Gadget ใหม่ล่าสุด เน้นการขายออนไลน์ ต้องการ conversion สูง พร้อม demo ฟีเจอร์เด่นๆ ผ่าน video content",
      kpis: ["Conversions", "Cost per Conversion", "ROAS", "Link Clicks"]
    },
    {
      campaign_focus: "product",
      industry: "Retail",
      targetAudience: "Young Professionals (25–34)",
      objective: "Conversion",
      channels: ["Facebook", "Line OA", "Instagram"],
      theme: "Bold & Vibrant",
      brief: "โปรโมทสินค้ายอดนิยมในราคาพิเศษ เน้นคุณภาพและความคุ้มค่าที่ดี ต้องการกระตุ้นยอดขายและ traffic เข้าเว็บไซต์",
      kpis: ["Conversions", "Cost per Conversion", "Link Clicks", "Purchase Value"]
    },
    {
      campaign_focus: "product",
      industry: "Technology",
      targetAudience: "SME Business Owners",
      objective: "Consideration",
      channels: ["Facebook", "YouTube", "Instagram"],
      theme: "Modern & Minimalist",
      brief: "เปิดตัวรถยนต์รุ่นใหม่ เน้น feature ความปลอดภัยและประหยัดน้ำมัน ต้องการให้กลุ่มเป้าหมายนัด test drive",
      kpis: ["Link Clicks", "Landing Page Views", "Reach", "Impressions"]
    },
    // เน้นบริการ (5 ชุด)
    {
      campaign_focus: "service",
      industry: "Healthcare",
      targetAudience: "Working Moms / Dads",
      objective: "Consideration",
      channels: ["Facebook", "Line OA", "YouTube"],
      theme: "Modern & Minimalist",
      brief: "โปรโมทโปรแกรมตรวจสุขภาพครอบครัว เน้นความสะดวกและครอบคลุม ต้องการให้คนสนใจและนัดหมายผ่านออนไลน์",
      kpis: ["Link Clicks", "Landing Page Views", "Reach", "Cost per Link Click"]
    },
    {
      campaign_focus: "service",
      industry: "Healthcare",
      targetAudience: "SME Business Owners",
      objective: "Conversion",
      channels: ["Facebook", "YouTube", "Line OA"],
      theme: "Clean & Professional",
      brief: "นำเสนอบริการสินเชื่อ SME ใหม่ เน้นความน่าเชื่อถือและขั้นตอนง่าย ต้องการให้ผู้ประกอบการสมัครผ่านช่องทางออนไลน์",
      kpis: ["Conversions", "Cost per Conversion", "Link Clicks", "Landing Page Views"]
    },
    {
      campaign_focus: "service",
      industry: "Education",
      targetAudience: "Students",
      objective: "Brand Awareness",
      channels: ["TikTok", "Instagram", "YouTube"],
      theme: "Playful & Fun",
      brief: "โปรโมทคอร์สเรียนออนไลน์สำหรับนักศึกษา เน้นความสนุกและเข้าถึงง่าย ใช้ content สั้นๆ ที่ดึงดูดความสนใจ",
      kpis: ["Reach", "Impressions", "Post Engagement", "CTR"]
    },
    {
      campaign_focus: "service",
      industry: "Retail",
      targetAudience: "Luxury Lifestyle Seekers",
      objective: "Conversion",
      channels: ["Facebook", "Instagram", "YouTube"],
      theme: "Elegant & Luxury",
      brief: "โปรโมทบริการคอนโดหรูใจกลางเมือง เน้นความพรีเมียมและ lifestyle ระดับสูง ต้องการให้ลูกค้านัดชมห้องตัวอย่าง",
      kpis: ["Conversions", "Cost per Conversion", "Link Clicks", "Reach"]
    },
    {
      campaign_focus: "service",
      industry: "Travel & Hospitality",
      targetAudience: "Young Professionals (25–34)",
      objective: "Consideration",
      channels: ["Instagram", "YouTube", "Facebook"],
      theme: "Natural & Organic",
      brief: "โปรโมท package ท่องเที่ยวเชิงธรรมชาติ ต้องการสร้าง inspiration ให้คนอยากเดินทาง เน้น visual สวยๆ และ storytelling",
      kpis: ["Link Clicks", "Landing Page Views", "Cost per Link Click", "Reach"]
    }
  ];

  // Campaign scenario templates
  const SCENARIO_TEMPLATES = [
    {
      campaign_focus: "product",
      industry: "Technology",
      targetAudience: "SME Business Owners",
      objective: "Conversion",
      channels: ["Facebook", "YouTube", "Line OA"],
      theme: "Tech & Futuristic",
      brief: "เปิดตัวผลิตภัณฑ์เทคโนโลยีใหม่ เน้นการเพิ่มประสิทธิภาพและลดต้นทุนการดำเนินงาน",
      kpis: ["Conversions", "Cost per Conversion", "ROAS", "Link Clicks"]
    },
    {
      campaign_focus: "service",
      industry: "Healthcare",
      targetAudience: "Health-Conscious Consumers",
      objective: "Consideration",
      channels: ["Instagram", "Facebook", "TikTok"],
      theme: "Clean & Professional",
      brief: "โปรโมทบริการสุขภาพ เน้นโปรแกรมเฉพาะบุคคลและผลลัพธ์ที่เห็นได้ชัด",
      kpis: ["Link Clicks", "Landing Page Views", "Post Engagement", "Reach"]
    },
    {
      campaign_focus: "product",
      industry: "Food & Beverage",
      targetAudience: "Health-Conscious Consumers",
      objective: "Brand Awareness",
      channels: ["Instagram", "TikTok", "YouTube"],
      theme: "Fresh & Healthy Living",
      brief: "เปิดตัวผลิตภัณฑ์อาหารสุขภาพใหม่ เน้นส่วนผสมธรรมชาติและรสชาติที่อร่อย",
      kpis: ["Reach", "Impressions", "Post Engagement", "CTR"]
    },
    {
      campaign_focus: "product",
      industry: "Retail",
      targetAudience: "Young Women (18–30)",
      objective: "Conversion",
      channels: ["Instagram", "Facebook", "TikTok"],
      theme: "Elegant & Luxury",
      brief: "เปิดตัวคอลเลกชั่นแฟชั่นใหม่ เน้นดีไซน์เฉพาะตัวและคุณภาพพรีเมียม",
      kpis: ["Conversions", "Cost per Conversion", "ROAS", "Purchase Value"]
    },
    {
      campaign_focus: "service",
      industry: "Education",
      targetAudience: "Students",
      objective: "Engagement",
      channels: ["TikTok", "Instagram", "YouTube"],
      theme: "Playful & Fun",
      brief: "โปรโมทคอร์สเรียนออนไลน์ใหม่ เน้นการเรียนรู้ที่สนุกและมีประสิทธิภาพ",
      kpis: ["Post Engagement", "CTR", "Link Clicks", "Reach"]
    }
  ];

  // Random fill function using real DB data
  const handleRandomFill = () => {
    // Ensure we have data loaded
    if (dataLoading || organizations.length === 0) {
      console.warn('Data not loaded yet, cannot perform random fill');
      return;
    }

    // Pick a random scenario from comprehensive list
    const scenario = CAMPAIGN_SCENARIOS[Math.floor(Math.random() * CAMPAIGN_SCENARIOS.length)];
    
    // Random budget based on industry
    const budgetByIndustry: Record<string, string[]> = {
      "Food & Beverage": ["30000", "50000", "100000"],
      "Technology": ["100000", "300000", "500000"],
      "Retail": ["50000", "100000", "300000"],
      "Education": ["30000", "50000", "100000"],
      "Healthcare": ["50000", "100000", "300000"]
    };
    const budgets = budgetByIndustry[scenario.industry] || ["50000", "100000", "300000"];
    const randomBudget = budgets[Math.floor(Math.random() * budgets.length)];
    
    // Random start date between today and 14 days from now
    const today = new Date();
    const randomStartOffset = Math.floor(Math.random() * 14);
    const startDate = addDays(today, randomStartOffset);
    
    // Duration based on objective
    const durationByObjective: Record<string, number[]> = {
      "Brand Awareness": [14, 21, 30],
      "Engagement": [7, 14, 21],
      "Consideration": [14, 21, 30],
      "Conversion": [7, 14, 21]
    };
    const durations = durationByObjective[scenario.objective] || [14, 21, 30];
    const randomDuration = durations[Math.floor(Math.random() * durations.length)];
    const endDate = addDays(startDate, randomDuration);

    // Determine content strategy based on objective
    const strategyByObjective: Record<string, { strategy: "organic" | "paid" | "mixed"; frequency: "daily" | "3-per-week" | "weekly" }> = {
      "Brand Awareness": { strategy: "organic", frequency: "daily" },
      "Engagement": { strategy: "organic", frequency: "3-per-week" },
      "Consideration": { strategy: "mixed", frequency: "3-per-week" },
      "Conversion": { strategy: "paid", frequency: "daily" }
    };
    const strategyConfig = strategyByObjective[scenario.objective] || { strategy: "organic", frequency: "daily" };

    // Auto-select from real DB data based on campaign focus
    let selectedOrgId = "";
    let selectedProductId = "";
    let selectedServiceId = "";
    let actualTargetAudience = scenario.targetAudience;
    let actualIndustry = scenario.industry;
    let actualBrief = scenario.brief;
    let actualTheme = scenario.theme;

    // CRITICAL: Ensure product/service focus ALWAYS selects specific items
    if (scenario.campaign_focus === "product") {
      if (products.length === 0) {
        console.error('No products available for product focus');
        return;
      }
      // Pick any random product from DB
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      selectedProductId = randomProduct.id;
      selectedOrgId = randomProduct.organization_id;
      
      // Use product's target audience and org's industry
      actualTargetAudience = randomProduct.target_audience;
      const org = organizations.find(o => o.id === randomProduct.organization_id);
      if (org) {
        actualIndustry = org.industry;
        actualBrief = `เปิดตัว ${randomProduct.name} ${randomProduct.description} เน้น${randomProduct.features.slice(0,2).join('และ')}`;
        // Match theme to industry
        actualTheme = org.industry === 'Technology' ? 'Tech & Futuristic' :
                    org.industry === 'Food & Beverage' ? 'Fresh & Healthy Living' :
                    org.industry === 'Retail' ? 'Elegant & Luxury' :
                    org.industry === 'Education' ? 'Playful & Fun' : 
                    org.industry === 'Healthcare' ? 'Clean & Professional' : scenario.theme;
      }
    } else if (scenario.campaign_focus === "service") {
      if (services.length === 0) {
        console.error('No services available for service focus');
        return;
      }
      // Pick any random service from DB
      const randomService = services[Math.floor(Math.random() * services.length)];
      selectedServiceId = randomService.id;
      selectedOrgId = randomService.organization_id;
      
      // Use service's target audience and org's industry
      actualTargetAudience = randomService.target_audience;
      const org = organizations.find(o => o.id === randomService.organization_id);
      if (org) {
        actualIndustry = org.industry;
        actualBrief = `โปรโมท ${randomService.name} ${randomService.description} เน้น${randomService.features.slice(0,2).join('และ')}`;
        // Match theme to industry
        actualTheme = org.industry === 'Technology' ? 'Tech & Futuristic' :
                    org.industry === 'Healthcare' ? 'Clean & Professional' :
                    org.industry === 'Retail' ? 'Elegant & Luxury' :
                    org.industry === 'Education' ? 'Playful & Fun' : 
                    org.industry === 'Food & Beverage' ? 'Fresh & Healthy Living' : scenario.theme;
      }
    } else {
      // General marketing - just pick random org
      const randomOrg = organizations[Math.floor(Math.random() * organizations.length)];
      selectedOrgId = randomOrg.id;
      actualIndustry = randomOrg.industry;
      actualBrief = `สร้างการรับรู้แบรนด์ ${randomOrg.name} เน้นความเป็นผู้นำในวงการ${randomOrg.industry}`;
      actualTheme = randomOrg.industry === 'Technology' ? 'Tech & Futuristic' :
                  randomOrg.industry === 'Healthcare' ? 'Clean & Professional' :
                  randomOrg.industry === 'Retail' ? 'Elegant & Luxury' :
                  randomOrg.industry === 'Education' ? 'Playful & Fun' : 
                  randomOrg.industry === 'Food & Beverage' ? 'Fresh & Healthy Living' : scenario.theme;
    }

    // Validation: Ensure product focus has product_id and service focus has service_id
    if (scenario.campaign_focus === "product" && !selectedProductId) {
      console.error('Product focus but no product selected');
      return;
    }
    if (scenario.campaign_focus === "service" && !selectedServiceId) {
      console.error('Service focus but no service selected');
      return;
    }

    console.log('Random Fill Debug:', {
      actualTargetAudience,
      selectedProductId,
      selectedServiceId,
      campaign_focus: scenario.campaign_focus
    });

    setFormData({
      industry: actualIndustry,
      targetAudience: actualTargetAudience,
      objective: scenario.objective,
      budget: randomBudget,
      customBudget: "",
      startDate,
      endDate,
      channels: scenario.channels,
      creativeTheme: actualTheme,
      kpis: scenario.kpis,
      campaignBrief: actualBrief,
      contentStrategy: strategyConfig.strategy,
      postingFrequency: strategyConfig.frequency,
      campaign_focus: scenario.campaign_focus,
      organization_id: selectedOrgId,
      product_id: selectedProductId,
      service_id: selectedServiceId,
    });
  };

  // Get actual budget value
  const getActualBudget = () => {
    if (formData.budget === 'custom') {
      return formData.customBudget || '';
    }
    return formData.budget;
  };

  const isFormValid =
    formData.industry &&
    formData.targetAudience &&
    formData.objective &&
    (formData.budget && (formData.budget !== 'custom' || formData.customBudget)) &&
    formData.startDate &&
    formData.endDate &&
    formData.channels.length > 0 &&
    formData.creativeTheme;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Random Fill Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRandomFill}
          className="gap-2 text-muted-foreground hover:text-primary hover:border-primary/50"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Random Fill
        </Button>
      </div>

      {/* Campaign Focus Selection */}
      <Card className="border-2 border-dashed border-border/70 bg-muted/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
เลือกประเภทแคมเปญ
          </CardTitle>
          <CardDescription>
เลือกว่าแคมเปญนี้จะเน้นไปที่อะไร
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'general', label: 'การตลาดทั่วไป', desc: 'โปรโมทแบรนด์หรือองค์กรโดยรวม' },
              { value: 'product', label: 'เน้นสินค้า', desc: 'โปรโมทสินค้าเฉพาะ' },
              { value: 'service', label: 'เน้นบริการ', desc: 'โปรโมทบริการเฉพาะ' }
            ].map((focus) => (
              <Card
                key={focus.value}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  formData.campaign_focus === focus.value
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setFormData({ ...formData, campaign_focus: focus.value as 'general' | 'product' | 'service', product_id: '', service_id: '' })}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{focus.label}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{focus.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Organization Selection */}
          {formData.campaign_focus !== 'general' && (
            <div className="space-y-3">
              <Label>เลือกองค์กร</Label>
              <Select
                value={formData.organization_id}
                onValueChange={(value) => setFormData({ ...formData, organization_id: value, product_id: '', service_id: '' })}
              >
                <SelectTrigger className="h-12 bg-card border-border hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="เลือกองค์กร" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{org.name}</span>
                        <span className="text-sm text-muted-foreground">{org.industry}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Product Selection */}
          {formData.campaign_focus === 'product' && formData.organization_id && (
            <div className="space-y-3">
              <Label>เลือกสินค้า</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
              >
                <SelectTrigger className="h-12 bg-card border-border hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="เลือกสินค้า" />
                </SelectTrigger>
                <SelectContent>
                  {products
                    .filter(product => product.organization_id === formData.organization_id)
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground">฿{typeof product.price === 'string' ? parseFloat(product.price).toLocaleString() : product.price?.toLocaleString()} - {product.category}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              {/* Show selected product details */}
              {formData.product_id && (() => {
                const selectedProduct = products.find(p => p.id === formData.product_id);
                return selectedProduct ? (
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <h4 className="font-medium text-sm mb-2">{selectedProduct.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{selectedProduct.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedProduct.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">กลุ่มเป้าหมาย: {selectedProduct.target_audience}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Service Selection */}
          {formData.campaign_focus === 'service' && formData.organization_id && (
            <div className="space-y-3">
              <Label>เลือกบริการ</Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              >
                <SelectTrigger className="h-12 bg-card border-border hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="เลือกบริการ" />
                </SelectTrigger>
                <SelectContent>
                  {services
                    .filter(service => service.organization_id === formData.organization_id)
                    .map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-sm text-muted-foreground">฿{typeof service.price === 'string' ? parseFloat(service.price).toLocaleString() : service.price?.toLocaleString()} - {service.duration}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              {/* Show selected service details */}
              {formData.service_id && (() => {
                const selectedService = services.find(s => s.id === formData.service_id);
                return selectedService ? (
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <h4 className="font-medium text-sm mb-2">{selectedService.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{selectedService.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedService.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>กลุ่มเป้าหมาย: {selectedService.target_audience}</span>
                      {selectedService.duration && <span>ระยะเวลา: {selectedService.duration}</span>}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </CardContent>
      </Card>



      {/* Target Audience */}
      <div className="space-y-3">
        <Label htmlFor="audience" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="h-4 w-4 text-primary" />
          {t('targetAudience')}
        </Label>
        <Select
          value={formData.targetAudience}
          onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
        >
          <SelectTrigger className="h-12 bg-card border-border hover:border-primary/50 transition-colors">
            <SelectValue placeholder={t('selectTargetAudience')} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border shadow-xl max-h-[300px]">
            {TARGET_AUDIENCES.map((audience) => (
              <SelectItem 
                key={audience} 
                value={audience} 
                className="cursor-pointer hover:bg-primary/5 focus:bg-primary/10"
              >
                {audience}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Objective */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Target className="h-4 w-4 text-primary" />
          {t('campaignObjective')}
        </Label>
        <Select
          value={formData.objective}
          onValueChange={(value) => setFormData({ ...formData, objective: value })}
        >
          <SelectTrigger className="h-12 bg-card border-border hover:border-primary/50 transition-colors">
            <SelectValue placeholder={t('selectCampaignObjective')} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border shadow-xl">
            {CAMPAIGN_OBJECTIVES.map((objective) => (
              <SelectItem 
                key={objective} 
                value={objective} 
                className="cursor-pointer hover:bg-primary/5 focus:bg-primary/10"
              >
                {objective}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <Label htmlFor="budget" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <DollarSign className="h-4 w-4 text-primary" />
          {t('budget')}
        </Label>
        <Select
          value={formData.budget}
          onValueChange={(value) => setFormData({ ...formData, budget: value, customBudget: value === 'custom' ? formData.customBudget : '' })}
        >
          <SelectTrigger className="h-12 bg-card border-border hover:border-primary/50 transition-colors">
            <SelectValue placeholder={t('selectBudget')} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border shadow-xl">
            {BUDGET_OPTIONS.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value} 
                className="cursor-pointer hover:bg-primary/5 focus:bg-primary/10"
              >
                {option.value === 'custom' ? t('customBudget') : option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Custom Budget Input */}
        {formData.budget === 'custom' && (
          <Input
            id="customBudget"
            placeholder={t('enterCustomBudget')}
            value={formData.customBudget || ''}
            onChange={(e) => setFormData({ ...formData, customBudget: e.target.value })}
            className="h-12 bg-card border-border hover:border-primary/50 focus:border-primary transition-colors"
          />
        )}
      </div>

      {/* Campaign Duration */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          {t('campaignDuration')}
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 justify-start text-left font-normal bg-card border-border hover:border-primary/50 hover:bg-card transition-colors",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {formData.startDate ? format(formData.startDate, "MMM dd, yyyy") : t('startDate')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border shadow-xl" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => setFormData({ ...formData, startDate: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 justify-start text-left font-normal bg-card border-border hover:border-primary/50 hover:bg-card transition-colors",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {formData.endDate ? format(formData.endDate, "MMM dd, yyyy") : t('endDate')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border shadow-xl" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => setFormData({ ...formData, endDate: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Channels */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          {t('channels')}
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AVAILABLE_CHANNELS.map((channel) => (
            <label
              key={channel}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200",
                formData.channels.includes(channel)
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
              )}
            >
              <Checkbox
                checked={formData.channels.includes(channel)}
                onCheckedChange={() => handleChannelToggle(channel)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className={cn(
                "text-sm font-medium transition-colors",
                formData.channels.includes(channel) ? "text-primary" : "text-foreground"
              )}>
                {channel}
              </span>
            </label>
          ))}
      </div>

      {/* Content Strategy Section */}
      <Card className="border-2 border-dashed border-border/70 bg-muted/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            {language === "th" ? "กลยุทธ์เนื้อหา" : "Content Strategy"}
          </CardTitle>
          <CardDescription>
            {language === "th" 
              ? "เลือกรูปแบบการสร้างเนื้อหาที่เหมาะกับเป้าหมายของคุณ"
              : "Choose the content creation approach that fits your goals"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Strategy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CONTENT_STRATEGIES.map((strategy) => {
              const isSelected = formData.contentStrategy === strategy.value;
              const Icon = strategy.icon === "Megaphone" ? Megaphone : strategy.icon === "DollarSign" ? DollarSign : Layers;
              const iconColor = strategy.value === "organic" ? "text-green-500" : strategy.value === "paid" ? "text-orange-500" : "text-purple-500";
              
              return (
                <Card
                  key={strategy.value}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setFormData({ ...formData, contentStrategy: strategy.value })}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Icon className={cn("h-6 w-6", iconColor)} />
                      {isSelected && (
                        <Badge variant="default" className="text-xs">
                          {language === "th" ? "เลือกแล้ว" : "Selected"}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">
                      {language === "th" ? strategy.labelTh : strategy.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {language === "th" ? strategy.descriptionTh : strategy.description}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {language === "th" ? "แนะนำสำหรับ" : "Recommended for"} {strategy.recommended}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Posting Frequency (only show for organic/mixed) */}
          {formData.contentStrategy !== "paid" && (
            <div className="space-y-3 pt-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                {language === "th" ? "ความถี่ในการโพสต์" : "Posting Frequency"}
              </Label>
              <Select
                value={formData.postingFrequency}
                onValueChange={(value: PostingFrequency) => setFormData({ ...formData, postingFrequency: value })}
              >
                <SelectTrigger className="h-12 bg-card border-border hover:border-primary/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border shadow-xl">
                  {POSTING_FREQUENCIES.map((freq) => (
                    <SelectItem 
                      key={freq.value} 
                      value={freq.value}
                      className="cursor-pointer hover:bg-primary/5 focus:bg-primary/10"
                    >
                      {language === "th" ? freq.labelTh : freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}


        </CardContent>
      </Card>
      </div>

      {/* Campaign Brief / Pre-prompt */}
      <div className="space-y-3">
        <Label htmlFor="brief" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          {t('campaignBriefLabel')}
        </Label>
        <Textarea
          id="brief"
          placeholder={t('campaignBriefPlaceholder')}
          value={formData.campaignBrief || ''}
          onChange={(e) => setFormData({ ...formData, campaignBrief: e.target.value })}
          className="min-h-[120px] bg-card border-border hover:border-primary/50 focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Creative Theme */}
      <div className="space-y-3">
        <Label htmlFor="theme" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Palette className="h-4 w-4 text-primary" />
          {t('creativeTheme')}
        </Label>
        <Textarea
          id="theme"
          placeholder={t('creativePlaceholder')}
          value={formData.creativeTheme}
          onChange={(e) => setFormData({ ...formData, creativeTheme: e.target.value })}
          className="min-h-[100px] bg-card border-border hover:border-primary/50 focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* KPI Selection Section */}
      <Card className="border-2 border-dashed border-border/70 bg-muted/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            {t('kpiTitle')}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {t('kpiDesc')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {KPI_CATEGORIES.map((category) => {
            const isRecommended = isKPIRecommended(category.objective);
            
            return (
              <div 
                key={category.name} 
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300",
                  isRecommended 
                    ? "border-primary/50 bg-primary/5 shadow-md" 
                    : "border-border/50 bg-card/50"
                )}
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className={cn(
                    "h-4 w-4",
                    isRecommended ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h4 className={cn(
                    "font-semibold text-sm",
                    isRecommended ? "text-primary" : "text-foreground"
                  )}>
                    {category.name}
                  </h4>
                  {isRecommended && (
                    <Badge variant="default" className="ml-auto gap-1 text-xs bg-primary/90">
                      <Star className="h-3 w-3" />
                      {t('kpiRecommended')}
                    </Badge>
                  )}
                </div>
                
                {/* KPI Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.kpis.map((kpi) => (
                    <label
                      key={kpi}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                        formData.kpis.includes(kpi)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-background/50 border border-transparent hover:bg-muted/50 hover:border-border"
                      )}
                    >
                      <Checkbox
                        checked={formData.kpis.includes(kpi)}
                        onCheckedChange={() => handleKPIToggle(kpi)}
                        className={cn(
                          "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                          isRecommended && !formData.kpis.includes(kpi) && "border-primary/50"
                        )}
                      />
                      <span className={cn(
                        "text-sm transition-colors",
                        formData.kpis.includes(kpi) 
                          ? "text-primary font-medium" 
                          : "text-foreground"
                      )}>
                        {kpi}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Selected KPIs Summary */}
          {formData.kpis.length > 0 && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-semibold text-foreground">{formData.kpis.length}</span> {t('kpiSelected')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {formData.kpis.map((kpi) => (
                  <Badge 
                    key={kpi} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => handleKPIToggle(kpi)}
                  >
                    {kpi} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="xl"
          className="w-full sm:w-[70%] mx-auto flex gradient-hero text-primary-foreground font-semibold shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              {t('generatingCampaign')}
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              {submitButtonText}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
