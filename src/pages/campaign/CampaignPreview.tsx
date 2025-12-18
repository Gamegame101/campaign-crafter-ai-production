import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AILoadingOverlay } from "@/components/AILoadingOverlay";
import { useCampaign } from "@/contexts/CampaignContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { generateFullCampaign, mockGenerateFullCampaign } from "@/lib/campaignApi";
import { DEMO_CAMPAIGN_IMAGES } from "@/lib/mockData";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Sparkles,
  Lightbulb,
  MessageSquare,
  Palette,
  Loader2,
} from "lucide-react";

const CampaignPreview = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    formData,
    preview,
    setFullCampaign,
    isGeneratingFull,
    setIsGeneratingFull,
  } = useCampaign();

  // Redirect if no preview data
  useEffect(() => {
    if (!preview || !formData) {
      navigate("/campaign/new");
    }
  }, [preview, formData, navigate]);

  const handleGenerateFullCampaign = async () => {
    if (!formData || !preview) return;

    setIsGeneratingFull(true);

    try {
      const fullCampaign = await generateFullCampaign(formData, preview, language);
      setFullCampaign(fullCampaign);
      navigate("/campaign/final");

      toast({
        title: language === 'th' ? "สร้างแคมเปญเต็มรูปแบบแล้ว!" : "Full Campaign Generated!",
        description: language === 'th' ? "แคมเปญพร้อมเนื้อหาแพลตฟอร์มพร้อมแล้ว" : "Your complete campaign with platform content is ready.",
      });
    } catch (error) {
      console.error("Error generating full campaign:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate campaign";

      toast({
        title: language === 'th' ? "สร้างไม่สำเร็จ" : "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingFull(false);
    }
  };

  if (!preview) {
    return null;
  }

  return (
    <>
      {/* AI Loading Overlay */}
      <AILoadingOverlay isVisible={isGeneratingFull} type="full" />

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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">{t("aiPowered")}</span>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/50 flex items-center justify-center text-xs text-primary-foreground">✓</span>
              {t("stepBrief")}
            </span>
            <div className="h-px w-8 bg-primary/50" />
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium">
              <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs">2</span>
              {t("stepPreview")}
            </span>
            <div className="h-px w-8 bg-border" />
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">3</span>
              {t("stepFinal")}
            </span>
            <div className="h-px w-8 bg-border" />
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">4</span>
              {t("stepPublish")}
            </span>
          </div>
        </div>

        {/* Preview Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">{t("campaignPreviewTitle")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("campaignPreviewDesc")}
          </p>
        </div>

        {/* Preview Cards */}
        <div className="space-y-6 animate-fade-in">
          {/* Campaign Summary */}
          <Card className="shadow-xl overflow-hidden border-border/50 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="gradient-hero text-primary-foreground pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-primary-foreground/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                {t("campaignSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6 bg-card">
              <p className="text-foreground leading-relaxed text-base">
                {preview.campaign_summary}
              </p>
            </CardContent>
          </Card>

          {/* Big Idea */}
          <Card className="shadow-xl border-l-4 border-l-accent border-border/50 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-sm">
                  <Lightbulb className="h-5 w-5 text-accent" />
                </div>
                {t("bigIdea")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="p-5 bg-gradient-to-r from-accent/5 to-transparent rounded-xl border border-accent/20">
                <p className="text-xl font-semibold text-foreground italic leading-relaxed">
                  "{preview.big_idea}"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Messages */}
          <Card className="shadow-xl border-border/50 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                {t("keyMessages")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              <ul className="space-y-4">
                {preview.key_messages.map((message, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl gradient-hero text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                      {index + 1}
                    </span>
                    <span className="text-foreground leading-relaxed pt-2 font-medium">
                      {message}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Visual Direction */}
          <Card className="shadow-xl border-border/50 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-lg text-foreground">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 shadow-sm">
                  <Palette className="h-5 w-5 text-purple-500" />
                </div>
                {t("visualDirection")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              <div className="p-5 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent rounded-xl border border-purple-500/20">
                <p className="text-foreground leading-relaxed">
                  {preview.visual_direction}
                </p>
              </div>

              {/* Visual Preview */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {DEMO_CAMPAIGN_IMAGES.slice(0, 3).map((image, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all hover:scale-105 cursor-pointer shadow-md hover:shadow-xl"
                  >
                    <img
                      src={image}
                      alt={`Campaign visual ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Draft Notice */}
          <Card className="p-4 bg-amber-500/10 border-amber-500/30 border-dashed">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-500/20">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {t("previewDraftNotice")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("previewDraftDesc")}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/campaign/new")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToEditBrief")}
            </Button>
            <Button
              size="lg"
              onClick={handleGenerateFullCampaign}
              disabled={isGeneratingFull}
              className="flex-1 gap-2 gradient-hero text-primary-foreground shadow-lg hover:shadow-glow"
            >
              {isGeneratingFull ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("generatingFullCampaign")}
                </>
              ) : (
                <>
                  {t("generateFullCampaign")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("stepOf")} 2 {t("of")} 4 — {t("campaignPreviewTitle")}
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default CampaignPreview;
