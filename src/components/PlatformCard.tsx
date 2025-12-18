import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Music2, 
  Image,
  Play,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CampaignResult, DEMO_CAMPAIGN_IMAGES } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

interface PlatformCardProps {
  platform: string;
  data: CampaignResult["posts"][keyof CampaignResult["posts"]];
  index: number;
}

const platformConfig: Record<string, { 
  icon: React.ElementType; 
  gradient: string;
  bgGradient: string;
  color: string;
}> = {
  Facebook: { 
    icon: Facebook, 
    gradient: "from-blue-600 to-blue-700",
    bgGradient: "from-blue-500/10 to-blue-600/5",
    color: "text-blue-600"
  },
  Instagram: { 
    icon: Instagram, 
    gradient: "from-pink-500 via-purple-500 to-orange-400",
    bgGradient: "from-pink-500/10 via-purple-500/5 to-orange-400/10",
    color: "text-pink-500"
  },
  TikTok: { 
    icon: Music2, 
    gradient: "from-gray-900 to-gray-800",
    bgGradient: "from-gray-900/10 to-gray-800/5",
    color: "text-gray-900 dark:text-gray-100"
  },
  YouTube: { 
    icon: Youtube, 
    gradient: "from-red-600 to-red-700",
    bgGradient: "from-red-500/10 to-red-600/5",
    color: "text-red-600"
  },
  "Line OA": { 
    icon: MessageCircle, 
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-500/10 to-green-600/5",
    color: "text-green-600"
  },
};

export const PlatformCard = ({ platform, data, index }: PlatformCardProps) => {
  const { t } = useLanguage();
  const config = platformConfig[platform];
  const Icon = config?.icon || MessageCircle;
  
  // Get a random demo image based on platform and index
  const demoImage = useMemo(() => {
    const imageIndex = (index + platform.length) % DEMO_CAMPAIGN_IMAGES.length;
    return DEMO_CAMPAIGN_IMAGES[imageIndex];
  }, [index, platform]);

  if (!data) return null;

  return (
    <Card 
      className="shadow-xl overflow-hidden border-border/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-scale-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Platform Header */}
      <CardHeader className={`pb-4 bg-gradient-to-r ${config?.bgGradient || "from-gray-500/10 to-gray-600/5"} border-b border-border/50`}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config?.gradient || "from-gray-500 to-gray-600"} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className={`text-xl font-bold ${config?.color || "text-foreground"}`}>{platform}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Content Preview</p>
            </div>
          </div>
          <Badge variant="secondary" className="font-semibold text-xs uppercase tracking-wide">
            Ready
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-5 pb-6 space-y-5">
        {/* Facebook */}
        {"caption" in data && "visual_prompt" in data && (
          <>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5" />
                {t('caption')}
              </h4>
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {data.caption}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Image className="h-3.5 w-3.5" />
                {t('visualPrompt')}
              </h4>
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                <p className="text-sm text-foreground/80 italic">{data.visual_prompt}</p>
              </div>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
              <img 
                src={demoImage} 
                alt="Campaign preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </>
        )}

        {/* Instagram */}
        {"carousel" in data && (
          <>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5" />
                {t('caption')}
              </h4>
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {data.caption}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                {t('carousel')} ({data.carousel.length} slides)
              </h4>
              <div className="space-y-2">
                {data.carousel.map((slide, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Slide {i + 1}</p>
                      <p className="text-sm text-foreground">{slide}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TikTok */}
        {"hook" in data && (
          <>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Play className="h-3.5 w-3.5" />
                {t('hook')}
              </h4>
              <div className="bg-gradient-to-r from-gray-900/10 to-gray-800/5 p-4 rounded-xl border border-gray-900/20 dark:border-gray-100/20">
                <p className="text-base font-semibold text-foreground">
                  {data.hook}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5" />
                {t('script')}
              </h4>
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50 font-mono">
                <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                  {data.script}
                </p>
              </div>
            </div>
            <div className="aspect-[9/16] max-h-[300px] rounded-xl overflow-hidden border border-gray-700 group cursor-pointer relative">
              <img 
                src={demoImage} 
                alt="TikTok preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-4 rounded-full bg-white/20">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* YouTube */}
        {"title" in data && "description" in data && (
          <>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('title')}
              </h4>
              <p className="text-lg font-bold text-foreground">{data.title}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('description')}
              </h4>
              <div className="bg-muted/40 p-4 rounded-xl border border-border/50">
                <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                  {data.description}
                </p>
              </div>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-red-500/30 shadow-lg hover:shadow-xl transition-all group cursor-pointer relative">
              <img 
                src={demoImage} 
                alt="YouTube thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-4 rounded-full bg-red-500/80">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Line OA */}
        {"message" in data && "cta" in data && (
          <>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5" />
                {t('message')}
              </h4>
              <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/20">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {data.message}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('cta')}
              </h4>
              <button className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                {data.cta}
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
