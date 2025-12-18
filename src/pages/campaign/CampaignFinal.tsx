import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformCard } from "@/components/PlatformCard";
import { CampaignResults } from "@/components/CampaignResults";
import { ContentCalendar } from "@/components/ContentCalendar";
import { KPIDashboard } from "@/components/KPIDashboard";

import { useCampaign } from "@/contexts/CampaignContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CampaignResult } from "@/lib/mockData";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  CalendarDays,
  Target,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

const CampaignFinal = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { formData, fullCampaign, setFullCampaign } = useCampaign();
  const [activeTab, setActiveTab] = useState("calendar");

  const handleUpdateResult = (updatedResult: CampaignResult) => {
    setFullCampaign(updatedResult);
  };

  // Show error if no campaign data
  if (!fullCampaign || !formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-4">ไม่พบข้อมูลแคมเปญ</h2>
            <p className="text-muted-foreground mb-6">กรุณาสร้างแคมเปญใหม่หรือกลับไปหน้าก่อนหน้า</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/campaign/new")}>
                สร้างแคมเปญใหม่
              </Button>
              <Button onClick={() => navigate("/")}>
                กลับหน้าหลัก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const platformCount = fullCampaign.posts ? Object.keys(fullCampaign.posts).length : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] gradient-hero-bg opacity-50" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/50 flex items-center justify-center text-xs text-primary-foreground">✓</span>
              {t("stepBrief")}
            </span>
            <div className="h-px w-8 bg-primary/50" />
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/50 flex items-center justify-center text-xs text-primary-foreground">✓</span>
              {t("stepPreview")}
            </span>
            <div className="h-px w-8 bg-primary/50" />
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium">
              <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs">3</span>
              {t("stepFinal")}
            </span>
            <div className="h-px w-8 bg-border" />
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">4</span>
              {t("stepPublish")}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">{t("finalCampaignTitle")}</h1>
            <p className="text-muted-foreground max-w-2xl">
              {t("finalCampaignDesc")}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {platformCount} {t("platforms")}
              </Badge>
            </div>
          </div>

        </div>

        {/* Tabs for Calendar, Overview and KPIs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid mb-6 bg-muted/50 p-1.5 rounded-xl">
            <TabsTrigger
              value="calendar"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-primary transition-all"
            >
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">{language === "th" ? "ปฏิทิน" : "Calendar"}</span>
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-primary transition-all"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t("overview")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="kpis"
              className="gap-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md data-[state=active]:text-primary transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{t("kpis")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-0 space-y-6 animate-fade-in">
            <Card className="shadow-xl border-border/50">
              <CardContent className="pt-6">
                <ContentCalendar
                  result={fullCampaign}
                  formData={formData}
                  onUpdateResult={handleUpdateResult}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="mt-0 space-y-6 animate-fade-in">
            <CampaignResults result={fullCampaign} />
          </TabsContent>

          <TabsContent value="kpis" className="mt-0 space-y-6 animate-fade-in">
            {/* KPI Dashboard */}
            <KPIDashboard
              formData={formData}
              platforms={fullCampaign.posts ? Object.keys(fullCampaign.posts) : []}
            />

            {/* KPI Mapping */}
            <Card className="shadow-xl border-border/50">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  {t("campaignKpis")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {formData?.kpis && formData.kpis.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.kpis.map((kpi, index) => (
                      <div
                        key={kpi}
                        className="p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg gradient-hero text-primary-foreground text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-foreground">{kpi}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {t("noKpisSelected")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card className="shadow-xl border-border/50">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-sm">
                    <BarChart3 className="h-5 w-5 text-accent" />
                  </div>
                  {t("campaignDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-center">
                    <p className="text-2xl font-bold text-primary">{formData?.industry || "N/A"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("industry")}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-center">
                    <p className="text-2xl font-bold text-primary">{formData?.objective || "N/A"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("campaignObjective")}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-center">
                    <p className="text-2xl font-bold text-primary">{formData?.budget || "N/A"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("budget")}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/50 text-center">
                    <p className="text-2xl font-bold text-primary">{platformCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("platforms")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border/50 mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/campaign/preview")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToPreview")}
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/campaign/publish")}
            className="flex-1 gap-2 gradient-hero text-primary-foreground shadow-lg hover:shadow-glow"
          >
            {t("publishCampaign")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("stepOf")} 3 {t("of")} 4 — {t("finalCampaignTitle")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CampaignFinal;
