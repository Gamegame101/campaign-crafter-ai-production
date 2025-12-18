import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { CampaignFormData } from "@/lib/mockData";
import {
  TrendingUp,
  Users,
  MousePointerClick,
  ShoppingCart,
  Eye,
  Heart,
  BarChart3,
  Facebook,
  Instagram,
  Youtube,
  Music2,
  MessageCircle,
  Target,
  Zap,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface KPIDashboardProps {
  formData: CampaignFormData | null;
  platforms: string[];
  compact?: boolean;
}

// Mock CPM rates by platform (in THB)
const PLATFORM_CPM: Record<string, number> = {
  Facebook: 35,
  Instagram: 45,
  TikTok: 25,
  YouTube: 80,
  "Line OA": 50,
};

// Mock engagement rates by platform
const PLATFORM_ENGAGEMENT_RATES: Record<string, { low: number; high: number }> = {
  Facebook: { low: 0.8, high: 2.5 },
  Instagram: { low: 1.5, high: 4.5 },
  TikTok: { low: 3.0, high: 8.0 },
  YouTube: { low: 2.0, high: 5.0 },
  "Line OA": { low: 15.0, high: 35.0 },
};

// Mock CTR by platform
const PLATFORM_CTR: Record<string, { low: number; high: number }> = {
  Facebook: { low: 0.8, high: 1.8 },
  Instagram: { low: 0.5, high: 1.5 },
  TikTok: { low: 0.4, high: 1.2 },
  YouTube: { low: 1.0, high: 3.0 },
  "Line OA": { low: 5.0, high: 15.0 },
};

// Mock conversion rates by objective
const OBJECTIVE_CONVERSION_RATES: Record<string, number> = {
  "Brand Awareness": 0.5,
  "Engagement": 1.0,
  "Consideration": 2.0,
  "Conversion": 3.5,
  "Retention": 5.0,
  "Advocacy": 8.0,
};

// Industry benchmark thresholds for pass/fail
const KPI_BENCHMARKS = {
  engagementRate: { pass: 1.5, good: 3.0 },
  ctr: { pass: 0.8, good: 1.5 },
  conversionRate: { pass: 1.0, good: 2.5 },
  costPerConversion: { pass: 500, good: 200 }, // lower is better
};

const platformIcons: Record<string, React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
  TikTok: Music2,
  "Line OA": MessageCircle,
};

const platformColors: Record<string, string> = {
  Facebook: "text-blue-500",
  Instagram: "text-pink-500",
  YouTube: "text-red-500",
  TikTok: "text-gray-900 dark:text-gray-100",
  "Line OA": "text-green-500",
};

const platformBgColors: Record<string, string> = {
  Facebook: "bg-blue-500/10",
  Instagram: "bg-pink-500/10",
  YouTube: "bg-red-500/10",
  TikTok: "bg-gray-500/10",
  "Line OA": "bg-green-500/10",
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
};

const formatCurrency = (num: number): string => {
  return "฿" + formatNumber(num);
};

// Status indicator component
const StatusIndicator = ({ 
  status, 
  language 
}: { 
  status: "pass" | "warning" | "fail"; 
  language: string;
}) => {
  if (status === "pass") {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-xs font-medium">
          {language === "th" ? "ผ่านเกณฑ์" : "Pass"}
        </span>
      </div>
    );
  }
  if (status === "warning") {
    return (
      <div className="flex items-center gap-1 text-yellow-600">
        <AlertCircle className="h-4 w-4" />
        <span className="text-xs font-medium">
          {language === "th" ? "พอใช้" : "Fair"}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-red-600">
      <XCircle className="h-4 w-4" />
      <span className="text-xs font-medium">
        {language === "th" ? "ต่ำกว่าเกณฑ์" : "Below"}
      </span>
    </div>
  );
};

// Determine status based on metric type and value
const getMetricStatus = (
  metricType: "engagementRate" | "ctr" | "conversionRate" | "costPerConversion",
  value: number
): "pass" | "warning" | "fail" => {
  const benchmark = KPI_BENCHMARKS[metricType];
  
  if (metricType === "costPerConversion") {
    // Lower is better for cost
    if (value <= benchmark.good) return "pass";
    if (value <= benchmark.pass) return "warning";
    return "fail";
  }
  
  // Higher is better for rates
  if (value >= benchmark.good) return "pass";
  if (value >= benchmark.pass) return "warning";
  return "fail";
};

export const KPIDashboard = ({ formData, platforms, compact = false }: KPIDashboardProps) => {
  const { language } = useLanguage();

  if (!formData) return null;

  // Parse budget
  const budgetValue = formData.budget === "custom" 
    ? parseInt(formData.customBudget || "50000") 
    : parseInt(formData.budget);

  // Calculate mock KPIs
  const calculatePlatformMetrics = (platform: string, budgetShare: number) => {
    const cpm = PLATFORM_CPM[platform] || 40;
    const engagementRate = PLATFORM_ENGAGEMENT_RATES[platform] || { low: 1, high: 3 };
    const ctr = PLATFORM_CTR[platform] || { low: 0.5, high: 1.5 };
    const conversionRate = OBJECTIVE_CONVERSION_RATES[formData.objective] || 2;

    const reach = Math.round((budgetShare / cpm) * 1000);
    const impressions = Math.round(reach * 2.5); // Avg frequency of 2.5
    const avgEngagement = (engagementRate.low + engagementRate.high) / 2;
    const engagements = Math.round(reach * (avgEngagement / 100));
    const avgCtr = (ctr.low + ctr.high) / 2;
    const clicks = Math.round(impressions * (avgCtr / 100));
    const conversions = Math.round(clicks * (conversionRate / 100));

    return {
      reach,
      impressions,
      engagementRate: avgEngagement,
      engagements,
      ctr: avgCtr,
      clicks,
      conversions,
      costPerConversion: conversions > 0 ? budgetShare / conversions : 0,
    };
  };

  // Distribute budget across platforms
  const budgetPerPlatform = budgetValue / platforms.length;
  
  const platformMetrics = platforms.map(platform => ({
    platform,
    metrics: calculatePlatformMetrics(platform, budgetPerPlatform),
  }));

  // Aggregate totals
  const totalReach = platformMetrics.reduce((sum, p) => sum + p.metrics.reach, 0);
  const totalImpressions = platformMetrics.reduce((sum, p) => sum + p.metrics.impressions, 0);
  const totalEngagements = platformMetrics.reduce((sum, p) => sum + p.metrics.engagements, 0);
  const totalClicks = platformMetrics.reduce((sum, p) => sum + p.metrics.clicks, 0);
  const totalConversions = platformMetrics.reduce((sum, p) => sum + p.metrics.conversions, 0);
  const avgEngagementRate = totalReach > 0 ? (totalEngagements / totalReach) * 100 : 0;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const costPerConversion = totalConversions > 0 ? budgetValue / totalConversions : 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  const summaryMetrics = [
    {
      icon: Users,
      label: language === "th" ? "การเข้าถึง" : "Reach",
      value: formatNumber(totalReach),
      subtext: language === "th" ? "คนที่จะเห็นแคมเปญ" : "people will see your campaign",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      showStatus: false,
    },
    {
      icon: Eye,
      label: language === "th" ? "การแสดงผล" : "Impressions",
      value: formatNumber(totalImpressions),
      subtext: language === "th" ? "จำนวนครั้งที่แสดง" : "total views",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      showStatus: false,
    },
    {
      icon: Heart,
      label: language === "th" ? "Engagement Rate" : "Engagement Rate",
      value: avgEngagementRate.toFixed(2) + "%",
      subtext: `${language === "th" ? "เกณฑ์ผ่าน" : "Benchmark"}: ≥${KPI_BENCHMARKS.engagementRate.pass}%`,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      showStatus: true,
      status: getMetricStatus("engagementRate", avgEngagementRate),
    },
    {
      icon: MousePointerClick,
      label: language === "th" ? "CTR" : "Click-Through Rate",
      value: avgCtr.toFixed(2) + "%",
      subtext: `${language === "th" ? "เกณฑ์ผ่าน" : "Benchmark"}: ≥${KPI_BENCHMARKS.ctr.pass}%`,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      showStatus: true,
      status: getMetricStatus("ctr", avgCtr),
    },
    {
      icon: ShoppingCart,
      label: language === "th" ? "คอนเวอร์ชัน" : "Conversions",
      value: formatNumber(totalConversions),
      subtext: `${language === "th" ? "เกณฑ์ผ่าน" : "Benchmark"}: ≥${KPI_BENCHMARKS.conversionRate.pass}%`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      showStatus: true,
      status: getMetricStatus("conversionRate", conversionRate),
    },
    {
      icon: DollarSign,
      label: language === "th" ? "ต้นทุน/คอนเวอร์ชัน" : "Cost/Conversion",
      value: formatCurrency(costPerConversion),
      subtext: `${language === "th" ? "เกณฑ์ผ่าน" : "Benchmark"}: ≤฿${KPI_BENCHMARKS.costPerConversion.pass}`,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      showStatus: true,
      status: getMetricStatus("costPerConversion", costPerConversion),
    },
  ];

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Estimated Badge for Compact */}
        <div className="flex items-center justify-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <Info className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">
            {language === "th" 
              ? "ค่าประมาณการ - ยังไม่ใช่ผลลัพธ์จริง" 
              : "Estimated Values - Not Actual Results"}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {summaryMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="p-4 bg-card rounded-xl border border-border/50 text-center hover:shadow-md transition-shadow relative"
              >
                {/* Estimated tag */}
                <Badge 
                  variant="outline" 
                  className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                >
                  EST.
                </Badge>
                
                <div className={`inline-flex p-2 rounded-lg ${metric.bgColor} mb-2 mt-1`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                
                {/* Status indicator */}
                {metric.showStatus && metric.status && (
                  <div className="mt-2 flex justify-center">
                    <StatusIndicator status={metric.status} language={language} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Big Estimated Warning Banner */}
      <div className="flex items-center gap-3 p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl">
        <div className="p-2.5 rounded-full bg-amber-500/20">
          <AlertCircle className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-amber-700 dark:text-amber-400">
            {language === "th" ? "ค่าประมาณการ (Estimated)" : "Estimated Values"}
          </h4>
          <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
            {language === "th" 
              ? "ตัวเลขทั้งหมดเป็นการคาดการณ์จาก AI ผลลัพธ์จริงจะแสดงหลังจาก publish และเชื่อมต่อ analytics" 
              : "All numbers are AI predictions. Actual results will show after publishing and connecting analytics."}
          </p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30">
          <Zap className="h-3 w-3 mr-1" />
          {language === "th" ? "AI คาดการณ์" : "AI Projected"}
        </Badge>
      </div>

      {/* Summary Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2.5 rounded-xl bg-primary/20">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            {language === "th" ? "สรุป KPI โดยประมาณ" : "Estimated KPI Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {summaryMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className={`p-4 bg-card rounded-xl border text-center hover:shadow-md transition-shadow relative ${
                    metric.showStatus 
                      ? metric.status === "pass" 
                        ? "border-green-500/30" 
                        : metric.status === "warning" 
                          ? "border-yellow-500/30" 
                          : "border-red-500/30"
                      : "border-border/50"
                  }`}
                >
                  {/* Estimated tag */}
                  <Badge 
                    variant="outline" 
                    className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  >
                    EST.
                  </Badge>
                  
                  <div className={`inline-flex p-2.5 rounded-lg ${metric.bgColor} mb-3 mt-1`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-1">{metric.label}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{metric.subtext}</p>
                  
                  {/* Status indicator */}
                  {metric.showStatus && metric.status && (
                    <div className="mt-2 pt-2 border-t border-border/50 flex justify-center">
                      <StatusIndicator status={metric.status} language={language} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Legend */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">
                {language === "th" ? "ผ่านเกณฑ์ (ดีมาก)" : "Pass (Excellent)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">
                {language === "th" ? "พอใช้ (ควรปรับปรุง)" : "Fair (Room for improvement)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">
                {language === "th" ? "ต่ำกว่าเกณฑ์ (ต้องปรับปรุง)" : "Below (Needs attention)"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <Card className="border-border/50">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2.5 rounded-xl bg-accent/20">
              <Target className="h-5 w-5 text-accent" />
            </div>
            {language === "th" ? "ประสิทธิภาพตามแพลตฟอร์ม" : "Platform Performance Breakdown"}
            <Badge 
              variant="outline" 
              className="ml-auto text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
            >
              {language === "th" ? "ค่าประมาณการ" : "Estimated"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {platformMetrics.map(({ platform, metrics }) => {
              const Icon = platformIcons[platform] || MessageCircle;
              const color = platformColors[platform] || "text-gray-500";
              const bgColor = platformBgColors[platform] || "bg-gray-500/10";
              
              // Calculate performance score (0-100)
              const performanceScore = Math.min(100, Math.round(
                (metrics.engagementRate * 10) + 
                (metrics.ctr * 20) + 
                (metrics.conversions / 10)
              ));
              
              const engagementStatus = getMetricStatus("engagementRate", metrics.engagementRate);
              const ctrStatus = getMetricStatus("ctr", metrics.ctr);
              const costStatus = getMetricStatus("costPerConversion", metrics.costPerConversion);

              return (
                <div key={platform} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${bgColor}`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{platform}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === "th" ? "งบประมาณ:" : "Budget:"} {formatCurrency(budgetPerPlatform)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          performanceScore >= 70 
                            ? "bg-green-500/10 text-green-600 border-green-500/30" 
                            : performanceScore >= 40 
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30" 
                              : "bg-red-500/10 text-red-600 border-red-500/30"
                        }`}
                      >
                        {performanceScore >= 70 && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {performanceScore >= 40 && performanceScore < 70 && <AlertCircle className="h-3 w-3 mr-1" />}
                        {performanceScore < 40 && <XCircle className="h-3 w-3 mr-1" />}
                        {language === "th" ? "คะแนน" : "Score"}: {performanceScore}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{language === "th" ? "ประสิทธิภาพโดยรวม" : "Overall Performance"}</span>
                      <span>{performanceScore}%</span>
                    </div>
                    <Progress value={performanceScore} className="h-2" />
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-card rounded-lg text-center">
                      <p className="text-lg font-bold text-foreground">{formatNumber(metrics.reach)}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "th" ? "การเข้าถึง" : "Reach"}
                      </p>
                    </div>
                    <div className={`p-3 bg-card rounded-lg text-center border ${
                      engagementStatus === "pass" ? "border-green-500/30" : 
                      engagementStatus === "warning" ? "border-yellow-500/30" : "border-red-500/30"
                    }`}>
                      <p className="text-lg font-bold text-foreground">{metrics.engagementRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <div className="mt-1">
                        <StatusIndicator status={engagementStatus} language={language} />
                      </div>
                    </div>
                    <div className={`p-3 bg-card rounded-lg text-center border ${
                      ctrStatus === "pass" ? "border-green-500/30" : 
                      ctrStatus === "warning" ? "border-yellow-500/30" : "border-red-500/30"
                    }`}>
                      <p className="text-lg font-bold text-foreground">{metrics.ctr.toFixed(2)}%</p>
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <div className="mt-1">
                        <StatusIndicator status={ctrStatus} language={language} />
                      </div>
                    </div>
                    <div className={`p-3 bg-card rounded-lg text-center border ${
                      costStatus === "pass" ? "border-green-500/30" : 
                      costStatus === "warning" ? "border-yellow-500/30" : "border-red-500/30"
                    }`}>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(metrics.costPerConversion)}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "th" ? "ต้นทุน/Conv" : "Cost/Conv"}
                      </p>
                      <div className="mt-1">
                        <StatusIndicator status={costStatus} language={language} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  {language === "th" ? "หมายเหตุสำคัญ" : "Important Note"}
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                  {language === "th" 
                    ? "ตัวเลขทั้งหมดเป็นการประมาณการจาก AI โดยอิงจากค่าเฉลี่ยของอุตสาหกรรม ผลลัพธ์จริงจะแสดงหลังจากคุณ publish แคมเปญและเชื่อมต่อกับ analytics ของแต่ละ platform" 
                    : "All figures are AI-estimated projections based on industry averages. Actual results will be shown after you publish your campaign and connect to each platform's analytics."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
