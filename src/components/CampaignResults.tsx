import { Lightbulb, MessageSquare, Sparkles, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignResult, DEMO_CAMPAIGN_IMAGES } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

interface CampaignResultsProps {
  result: CampaignResult;
}

export const CampaignResults = ({ result }: CampaignResultsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Campaign Summary */}
      <Card className="shadow-xl overflow-hidden border-border/50 hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="gradient-hero text-primary-foreground pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 rounded-lg bg-primary-foreground/20">
              <Sparkles className="h-5 w-5" />
            </div>
            {t('campaignSummary')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6 bg-card">
          <p className="text-foreground leading-relaxed text-base">{result.campaign_summary}</p>
        </CardContent>
      </Card>

      {/* Big Idea */}
      <Card className="shadow-xl border-l-4 border-l-accent border-border/50 hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg text-foreground">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 shadow-sm">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            {t('bigIdea')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="p-5 bg-gradient-to-r from-accent/5 to-transparent rounded-xl border border-accent/20">
            <p className="text-xl font-semibold text-foreground italic leading-relaxed">
              "{result.big_idea}"
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
            {t('keyMessages')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <ul className="space-y-4">
            {result.key_messages.map((message, index) => (
              <li
                key={index}
                className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-xl gradient-hero text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  {index + 1}
                </span>
                <span className="text-foreground leading-relaxed pt-2 font-medium">{message}</span>
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
            {t('visualDirection')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <div className="p-5 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent rounded-xl border border-purple-500/20">
            <p className="text-foreground leading-relaxed">{result.visual_direction}</p>
          </div>
          
          {/* Visual Preview with Demo Images */}
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
    </div>
  );
};
