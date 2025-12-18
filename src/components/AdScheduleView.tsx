import { useMemo } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AdScheduleItem } from "@/lib/mockData";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface AdScheduleViewProps {
  schedule?: AdScheduleItem[];
  totalBudget?: number;
  startDate: Date;
  endDate: Date;
}

const platformIcons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <TikTokIcon className="h-4 w-4" />,
  YouTube: <Youtube className="h-4 w-4" />,
  "Line OA": <MessageCircle className="h-4 w-4" />,
};

const platformColors: Record<string, { bg: string; text: string; border: string }> = {
  Facebook: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/30" },
  Instagram: { bg: "bg-pink-500/10", text: "text-pink-600", border: "border-pink-500/30" },
  TikTok: { bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-500/30" },
  YouTube: { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/30" },
  "Line OA": { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/30" },
};

export const AdScheduleView = ({ schedule, totalBudget, startDate, endDate }: AdScheduleViewProps) => {
  const { language } = useLanguage();
  const dateLocale = language === "th" ? th : enUS;

  const campaignDays = useMemo(() => 
    eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]
  );

  const totalDays = campaignDays.length;

  // Calculate stats
  const stats = useMemo(() => {
    if (!schedule || schedule.length === 0) return null;

    const totalAdSpend = schedule.reduce((sum, item) => sum + item.total_budget, 0);
    const avgDailyBudget = schedule.reduce((sum, item) => sum + item.daily_budget, 0) / schedule.length;

    return {
      totalAdSpend,
      avgDailyBudget,
      platformCount: schedule.length,
    };
  }, [schedule]);

  if (!schedule || schedule.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <DollarSign className="h-5 w-5 text-orange-500" />
          </div>
          {language === "th" ? "ตารางโฆษณา" : "Ad Schedule"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">
                ฿{stats.totalAdSpend.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "th" ? "งบโฆษณารวม" : "Total Ad Spend"}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">
                ฿{Math.round(stats.avgDailyBudget).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "th" ? "งบเฉลี่ย/วัน" : "Avg Daily Budget"}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">
                {totalDays} {language === "th" ? "วัน" : "days"}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "th" ? "ระยะเวลา" : "Duration"}
              </p>
            </div>
          </div>
        )}

        {/* Platform Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            {language === "th" ? "แยกตามแพลตฟอร์ม" : "By Platform"}
          </h4>

          {schedule.map((item, index) => {
            const colors = platformColors[item.platform] || platformColors.Facebook;
            const budgetPercentage = totalBudget 
              ? (item.total_budget / totalBudget) * 100 
              : 0;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={colors.text}>{platformIcons[item.platform]}</span>
                    <span className="font-medium">{item.platform}</span>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3" />
                    {language === "th" ? "ยิงโฆษณา" : "Running Ads"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground text-xs">
                      {language === "th" ? "งบ/วัน" : "Daily"}
                    </p>
                    <p className="font-semibold">฿{item.daily_budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">
                      {language === "th" ? "รวม" : "Total"}
                    </p>
                    <p className="font-semibold">฿{item.total_budget.toLocaleString()}</p>
                  </div>
                </div>

                {/* Budget Allocation Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === "th" ? "สัดส่วนงบ" : "Budget Share"}</span>
                    <span>{budgetPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={budgetPercentage} className="h-2" />
                </div>

                {/* Run Dates */}
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {item.run_dates.length > 2 
                      ? `${format(new Date(item.run_dates[0]), "d MMM", { locale: dateLocale })} - ${format(new Date(item.run_dates[item.run_dates.length - 1]), "d MMM", { locale: dateLocale })} (${item.run_dates.length} ${language === "th" ? "วัน" : "days"})`
                      : item.run_dates.map(d => format(new Date(d), "d MMM", { locale: dateLocale })).join(", ")
                    }
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Budget Comparison */}
        {totalBudget && stats && (
          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {language === "th" ? "งบ Campaign ทั้งหมด" : "Total Campaign Budget"}
              </span>
              <span className="font-bold">฿{totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {language === "th" ? "จัดสรรให้โฆษณา" : "Allocated to Ads"}
              </span>
              <span className="font-bold text-orange-500">
                ฿{stats.totalAdSpend.toLocaleString()} ({((stats.totalAdSpend / totalBudget) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
