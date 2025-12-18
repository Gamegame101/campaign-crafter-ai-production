import { useState } from "react";
import { 
  Download, 
  CheckCircle2, 
  FileJson,
  FileText,
  Edit3,
  Save,
  X,
  Image,
  Facebook,
  Instagram,
  Youtube,
  Music2,
  MessageCircle,
  Package,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CampaignResult, CampaignFormData } from "@/lib/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface ExportPreviewProps {
  result: CampaignResult;
  formData: CampaignFormData | null;
  onUpdateResult: (updatedResult: CampaignResult) => void;
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

export const ExportPreview = ({ result, formData, onUpdateResult }: ExportPreviewProps) => {
  const { t } = useLanguage();
  const platforms = Object.keys(result.posts);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editVisualPrompt, setEditVisualPrompt] = useState<string>("");

  const getPostContent = (platform: string): string => {
    const post = result.posts[platform as keyof typeof result.posts];
    if (!post) return "";
    
    if ("caption" in post) return post.caption;
    if ("hook" in post) return post.hook;
    if ("message" in post) return post.message;
    if ("title" in post) return post.title;
    return "";
  };

  const getVisualPrompt = (platform: string): string => {
    const post = result.posts[platform as keyof typeof result.posts];
    if (!post) return "";
    if ("visual_prompt" in post) return post.visual_prompt;
    return "";
  };

  const startEditing = (platform: string) => {
    setEditingPlatform(platform);
    setEditContent(getPostContent(platform));
    setEditVisualPrompt(getVisualPrompt(platform));
  };

  const cancelEditing = () => {
    setEditingPlatform(null);
    setEditContent("");
    setEditVisualPrompt("");
  };

  const saveEditing = () => {
    if (!editingPlatform) return;

    const updatedPosts = { ...result.posts };
    const post = updatedPosts[editingPlatform as keyof typeof updatedPosts];
    
    if (post) {
      // Update content based on platform type
      if ("caption" in post) {
        (post as any).caption = editContent;
      } else if ("hook" in post) {
        (post as any).hook = editContent;
      } else if ("message" in post) {
        (post as any).message = editContent;
      } else if ("title" in post) {
        (post as any).title = editContent;
      }
      // Update visual prompt if applicable
      if ("visual_prompt" in post) {
        (post as any).visual_prompt = editVisualPrompt;
      }
    }

    onUpdateResult({ ...result, posts: updatedPosts });
    setEditingPlatform(null);
    
    toast({
      title: "Content Updated",
      description: `${editingPlatform} content has been updated.`,
    });
  };

  const exportAsJSON = () => {
    const exportData = {
      campaign: result,
      generatedAt: new Date().toISOString(),
      formData: formData,
      exportVersion: "1.0",
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported as JSON",
      description: "Campaign data downloaded successfully.",
    });
  };

  const exportAsText = () => {
    let textContent = `CAMPAIGN EXPORT\n${"=".repeat(50)}\n\n`;
    textContent += `Generated: ${new Date().toISOString()}\n\n`;
    
    textContent += `CAMPAIGN SUMMARY\n${"-".repeat(30)}\n`;
    textContent += `${result.campaign_summary}\n\n`;
    
    textContent += `BIG IDEA\n${"-".repeat(30)}\n`;
    textContent += `${result.big_idea}\n\n`;
    
    textContent += `KEY MESSAGES\n${"-".repeat(30)}\n`;
    result.key_messages.forEach((msg, i) => {
      textContent += `${i + 1}. ${msg}\n`;
    });
    textContent += "\n";
    
    textContent += `VISUAL DIRECTION\n${"-".repeat(30)}\n`;
    textContent += `${result.visual_direction}\n\n`;
    
    textContent += `PLATFORM CONTENT\n${"=".repeat(50)}\n\n`;
    
    platforms.forEach(platform => {
      textContent += `[${platform.toUpperCase()}]\n${"-".repeat(30)}\n`;
      textContent += `Content:\n${getPostContent(platform)}\n\n`;
      textContent += `Visual Prompt:\n${getVisualPrompt(platform)}\n\n`;
    });
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported as Text",
      description: "Campaign content downloaded as plain text.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <Card className="shadow-xl overflow-hidden border-border/50">
        <CardHeader className="gradient-hero text-primary-foreground">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2.5 rounded-xl bg-primary-foreground/20">
              <Package className="h-6 w-6" />
            </div>
            Preview & Export
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-card">
          <p className="text-muted-foreground leading-relaxed mb-4">
            Review and edit your campaign content before exporting. You can modify captions and visual prompts for each platform.
          </p>
          
          {/* Status Overview */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              {platforms.length} Platforms Ready
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <Edit3 className="h-3.5 w-3.5 text-primary" />
              Editable Content
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Platform Content Cards */}
      <div className="space-y-4">
        {platforms.map((platform, index) => {
          const Icon = platformIcons[platform] || MessageCircle;
          const colors = platformColors[platform] || { bg: "bg-muted", text: "text-foreground", border: "border-border" };
          const content = getPostContent(platform);
          const visualPrompt = getVisualPrompt(platform);
          const isEditing = editingPlatform === platform;

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
                      <p className="text-sm text-muted-foreground">
                        {isEditing ? "Editing content..." : "Click edit to modify"}
                      </p>
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(platform)}
                      className="gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={saveEditing}
                        className="gap-1"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                {/* Content */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`content-${platform}`} className="text-sm font-medium mb-2 block">
                        Caption / Content
                      </Label>
                      <Textarea
                        id={`content-${platform}`}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={6}
                        className="resize-none"
                        placeholder="Enter your caption or content..."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`visual-${platform}`} className="text-sm font-medium mb-2 block">
                        Visual Prompt / Direction
                      </Label>
                      <Textarea
                        id={`visual-${platform}`}
                        value={editVisualPrompt}
                        onChange={(e) => setEditVisualPrompt(e.target.value)}
                        rows={3}
                        className="resize-none"
                        placeholder="Describe the visual style..."
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Content Preview */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Caption / Content</p>
                      <div className="bg-muted/40 p-4 rounded-xl border border-border/50">
                        <p className="text-sm text-foreground whitespace-pre-line">
                          {content}
                        </p>
                      </div>
                    </div>

                    {/* Visual Prompt Preview */}
                    {visualPrompt && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Visual Prompt</p>
                        <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                          <p className="text-sm text-muted-foreground italic">
                            {visualPrompt}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Demo Image Placeholder */}
                    <div className="aspect-video max-h-[150px] bg-gradient-to-br from-muted via-muted/80 to-muted/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border/70">
                      <Image className="h-6 w-6 text-muted-foreground/40 mb-1" />
                      <p className="text-xs text-muted-foreground">Demo Image Preview</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Export Options */}
      <Card className="shadow-xl border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Download className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground text-lg mb-1">Export Options</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download your campaign in your preferred format. All edits will be included in the export.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Platforms', value: platforms.length },
              { label: 'Posts', value: platforms.length },
              { label: 'Key Messages', value: result.key_messages.length },
              { label: 'Edits', value: editingPlatform ? 1 : 0 },
            ].map((stat, i) => (
              <div key={i} className="p-3 bg-card rounded-xl border border-border/50 text-center">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg" 
              onClick={exportAsJSON}
              className="flex-1 gradient-hero text-primary-foreground shadow-lg hover:shadow-glow hover:scale-[1.01] transition-all gap-2"
            >
              <FileJson className="h-5 w-5" />
              Export as JSON
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={exportAsText}
              className="flex-1 gap-2"
            >
              <FileText className="h-5 w-5" />
              Export as Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-muted/30 border-dashed">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Publishing Layer (Mock)</p>
            <p className="text-sm text-muted-foreground">
              In the full version, you can connect social media APIs to publish directly. For now, export your content and use it with your preferred publishing tools.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
