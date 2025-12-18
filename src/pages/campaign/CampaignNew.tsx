import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CampaignForm } from "@/components/CampaignForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AILoadingOverlay } from "@/components/AILoadingOverlay";
import { useCampaign } from "@/contexts/CampaignContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { generateCampaignPreview, mockGenerateCampaignPreview } from "@/lib/campaignApi";
import { getOrganizations, getProducts, getServices } from "@/lib/organizationDb";
import { CampaignFormData, Organization, Product, Service } from "@/lib/mockData";
import {
  Home,
  FileText,
  Sparkles,
  Building2,
  Package,
  Settings,
} from "lucide-react";

const CampaignNew = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    formData: savedFormData,
    setFormData,
    setPreview,
    isGeneratingPreview,
    setIsGeneratingPreview,
  } = useCampaign();

  const [focusType, setFocusType] = useState<string>(savedFormData?.campaign_focus?.type || "");
  const [focusItem, setFocusItem] = useState<string>(savedFormData?.campaign_focus?.item_id || "");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync focus values with saved form data
  useEffect(() => {
    if (savedFormData?.campaign_focus) {
      setFocusType(savedFormData.campaign_focus.type || "");
      setFocusItem(savedFormData.campaign_focus.item_id || "");
    }
  }, [savedFormData]);

  useEffect(() => {
    const loadData = async () => {
      if (focusType && focusType !== "none") {
        setLoading(true);
        try {
          if (focusType === "organization") {
            const orgs = await getOrganizations();
            setOrganizations(orgs);
          } else if (focusType === "product") {
            const prods = await getProducts();
            setProducts(prods);
          } else if (focusType === "service") {
            const servs = await getServices();
            setServices(servs);
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [focusType]);

  const getSelectedItemDetails = () => {
    if (!focusItem || focusType === "none") return null;
    
    if (focusType === "organization") {
      return organizations.find(org => org.id === focusItem);
    } else if (focusType === "product") {
      return products.find(prod => prod.id === focusItem);
    } else if (focusType === "service") {
      return services.find(serv => serv.id === focusItem);
    }
    return null;
  };

  const selectedItem = getSelectedItemDetails();

  const handleSubmit = async (data: CampaignFormData) => {
    setIsGeneratingPreview(true);
    
    // Clear any existing preview to force fresh generation
    setPreview(null);
    
    // Add campaign focus to form data
    const dataWithFocus = {
      ...data,
      campaign_focus: focusType && focusType !== "none" ? {
        type: focusType,
        item_id: focusItem,
        item_details: selectedItem
      } : undefined
    };
    
    setFormData(dataWithFocus);

    try {
      // Use AI-powered generation with language
      const preview = await generateCampaignPreview(dataWithFocus, language);
      setPreview(preview);
      navigate("/campaign/preview");

      toast({
        title: "Preview Generated!",
        description: "Your campaign preview is ready for review.",
      });
    } catch (error) {
      console.error("Error generating preview:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate preview";

      if (errorMessage.includes("Rate limit")) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Please wait a moment and try again.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("credits")) {
        toast({
          title: "AI Credits Exhausted",
          description: "Please add more credits to continue using AI features.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  return (
    <>
      {/* AI Loading Overlay */}
      <AILoadingOverlay isVisible={isGeneratingPreview} type="preview" />

      <div className="min-h-screen bg-background flex flex-col">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] gradient-hero-bg opacity-50" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2 -ml-2 mb-6 text-muted-foreground hover:text-foreground group"
        >
          <Home className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          {t("backToHome")}
        </Button>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium">
              <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs">1</span>
              {t("stepBrief")}
            </span>
            <div className="h-px w-8 bg-border" />
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">2</span>
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

        {/* Campaign Brief Input Form */}
        <div className="max-w-4xl mx-auto">
          <div>
            <Card className="shadow-xl border-border/50 bg-card/95 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {t("aiPowered")}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                  <FileText className="h-7 w-7 text-primary" />
                  {t("campaignBrief")}
                </h1>

                <p className="text-muted-foreground mt-2 text-base">
                  {t("campaignBriefDesc")}
                </p>

                <Separator className="mt-6" />
              </CardHeader>

              <CardContent className="pt-2 pb-8">
                <CampaignForm
                  onSubmit={handleSubmit}
                  isLoading={isGeneratingPreview}
                  buttonText={isGeneratingPreview ? t("generatingPreview") : t("generatePreview")}
                  initialData={savedFormData}
                />
              </CardContent>
            </Card>
          </div>


        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("stepOf")} 1 {t("of")} 4 — {t("campaignBrief")}
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default CampaignNew;
