import { 
  Send, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Link2, 
  AlertCircle,
  Facebook,
  Instagram,
  Youtube,
  Music2,
  MessageCircle,
  Image,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignResult } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

interface PublishingPreviewProps {
  result: CampaignResult;
}

const platformIcons: Record<string, React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
  TikTok: Music2,
  "Line OA": MessageCircle,
};

const platformColors: Record<string, { bg: string; text: string; border: string }> = {
  Facebook: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/30" },
  Instagram: { bg: "bg-pink-500/10", text: "text-pink-500", border: "border-pink-500/30" },
  YouTube: { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/30" },
  TikTok: { bg: "bg-gray-900/10", text: "text-gray-900 dark:text-gray-100", border: "border-gray-500/30" },
  "Line OA": { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/30" },
};

export const PublishingPreview = ({ result }: PublishingPreviewProps) => {
  const { t } = useLanguage();
  const platforms = Object.keys(result.posts);

  const getPostContent = (platform: string) => {
    const post = result.posts[platform as keyof typeof result.posts];
    if (!post) return "";
    
    if ("caption" in post) return post.caption;
    if ("hook" in post) return post.hook;
    if ("message" in post) return post.message;
    if ("title" in post) return post.title;
    return "";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <Card className="shadow-xl overflow-hidden border-border/50">
        <CardHeader className="gradient-hero text-primary-foreground">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2.5 rounded-xl bg-primary-foreground/20">
              <Send className="h-6 w-6" />
            </div>
            Ready to Publish
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-card">
          <p className="text-muted-foreground leading-relaxed mb-4">
            Review your campaign assets before posting. Connect your platforms to enable direct publishing.
          </p>
          
          {/* Status Overview */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              {platforms.length} Platforms Ready
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <Zap className="h-3.5 w-3.5 text-primary" />
              AI Optimized
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Platform Publishing Cards */}
      <div className="space-y-4">
        {platforms.map((platform, index) => {
          const Icon = platformIcons[platform] || MessageCircle;
          const colors = platformColors[platform] || { bg: "bg-muted", text: "text-foreground", border: "border-border" };
          const content = getPostContent(platform);

          return (
            <Card
              key={platform}
              className={`shadow-lg border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up ${colors.border} border-l-4`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                {/* Platform Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${colors.bg}`}>
                      <Icon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${colors.text}`}>{platform}</h3>
                      <p className="text-sm text-muted-foreground">Content ready for publishing</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Ready
                  </Badge>
                </div>

                {/* Content Preview */}
                <div className="mb-5">
                  <div className="bg-muted/40 p-4 rounded-xl border border-border/50">
                    <p className="text-sm text-foreground whitespace-pre-line line-clamp-4">
                      {content}
                    </p>
                  </div>
                </div>

                {/* Image Placeholder */}
                <div className="aspect-video max-h-[200px] bg-gradient-to-br from-muted via-muted/80 to-muted/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border/70 mb-5">
                  <Image className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Image Preview</p>
                </div>

                {/* Connect Button */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <Button 
                    variant="outline" 
                    disabled
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Link2 className="h-4 w-4" />
                    Connect to {platform}
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span className="italic">Integration available in full version</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Publishing Summary */}
      <Card className="shadow-xl border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground text-lg mb-1">{t('allSet')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {platforms.length} {t('platformsReady')}
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Platforms', value: platforms.length },
                  { label: 'Posts', value: platforms.length },
                  { label: 'Images', value: platforms.length },
                  { label: 'Videos', value: platforms.includes('TikTok') || platforms.includes('YouTube') ? 1 : 0 },
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-card rounded-xl border border-border/50 text-center">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg" 
              className="flex-1 gradient-hero text-primary-foreground shadow-lg hover:shadow-glow hover:scale-[1.01] transition-all"
            >
              <Send className="h-5 w-5" />
              {t('publishAll')}
            </Button>
            <Button variant="outline" size="lg" className="flex-1 gap-2">
              <Clock className="h-5 w-5" />
              {t('scheduleForLater')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-muted/30 border-dashed">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Demo Mode</p>
            <p className="text-sm text-muted-foreground">
              This is a demonstration of the publishing workflow. In the full version, you can connect your social media accounts and publish directly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
