import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useCampaign } from "@/contexts/CampaignContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { DEMO_CAMPAIGN_IMAGES } from "@/lib/mockData";
import { KPIDashboard } from "@/components/KPIDashboard";

import {
  ArrowLeft,
  Zap,
  Send,
  CheckCircle2,
  Facebook,
  Instagram,
  Youtube,
  Music2,
  MessageCircle,
  Download,
  FileJson,
  FileText,
  Clock,
  Hash,
  MousePointerClick,
  Pencil,
  Filter,
  Image as ImageIcon,
  Calendar,
  Eye,
  ChevronDown,
  BarChart3,
} from "lucide-react";

// TikTok icon component
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const platformIcons: Record<string, React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
  TikTok: Music2,
  "Line OA": MessageCircle,
};

const platformColors: Record<string, { bg: string; text: string; border: string; gradient: string; badge: string }> = {
  Facebook: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/30", gradient: "from-blue-600 to-blue-700", badge: "bg-blue-500" },
  Instagram: { bg: "bg-pink-500/10", text: "text-pink-500", border: "border-pink-500/30", gradient: "from-pink-500 via-purple-500 to-orange-400", badge: "bg-gradient-to-r from-pink-500 to-purple-500" },
  YouTube: { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/30", gradient: "from-red-600 to-red-700", badge: "bg-red-500" },
  TikTok: { bg: "bg-gray-900/10", text: "text-gray-900 dark:text-gray-100", border: "border-gray-500/30", gradient: "from-gray-900 to-gray-700", badge: "bg-gray-900" },
  "Line OA": { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/30", gradient: "from-green-500 to-green-600", badge: "bg-green-500" },
};

interface PostData {
  platform: string;
  content: string;
  thumbnail: string;
  scheduledTime: string;
  scheduledDate: string;
  hashtags: string[];
  cta: string;
  status: "draft" | "scheduled" | "published";
}

const getPostContent = (platform: string, data: any): string => {
  if (!data) return "";
  if ("caption" in data) return data.caption;
  if ("hook" in data) return data.hook;
  if ("message" in data) return data.message;
  if ("title" in data) return data.title;
  return "";
};

const getPostHashtags = (data: any): string[] => {
  if (!data) return [];
  if ("hashtags" in data && Array.isArray(data.hashtags)) return data.hashtags;
  return ["#marketing", "#campaign", "#brand"];
};

const getPostCta = (data: any): string => {
  if (!data) return "";
  if ("cta" in data) return data.cta;
  return "Learn More";
};

const CampaignPublish = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { formData, fullCampaign, resetCampaign } = useCampaign();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [posts, setPosts] = useState<PostData[]>([]);
  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Edit form state
  const [editContent, setEditContent] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editHashtags, setEditHashtags] = useState("");
  const [editCta, setEditCta] = useState("");

  // Initialize posts from campaign data
  useEffect(() => {
    if (fullCampaign) {
      const initialPosts: PostData[] = Object.entries(fullCampaign.posts).map(([platform, data], index) => ({
        platform,
        content: getPostContent(platform, data),
        thumbnail: DEMO_CAMPAIGN_IMAGES[(index + platform.length) % DEMO_CAMPAIGN_IMAGES.length],
        scheduledTime: `${10 + index}:00`,
        scheduledDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hashtags: getPostHashtags(data),
        cta: getPostCta(data),
        status: "scheduled" as const,
      }));
      setPosts(initialPosts);
    }
  }, [fullCampaign]);

  // Redirect if no campaign data
  useEffect(() => {
    if (!fullCampaign || !formData) {
      navigate("/campaign/new");
    }
  }, [fullCampaign, formData, navigate]);

  const handleEditPost = (post: PostData) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditTime(post.scheduledTime);
    setEditDate(post.scheduledDate);
    setEditHashtags(post.hashtags.join(" "));
    setEditCta(post.cta);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;

    setPosts(prev => prev.map(p => 
      p.platform === editingPost.platform 
        ? {
            ...p,
            content: editContent,
            scheduledTime: editTime,
            scheduledDate: editDate,
            hashtags: editHashtags.split(/\s+/).filter(h => h.startsWith("#") || h.length > 0).map(h => h.startsWith("#") ? h : `#${h}`),
            cta: editCta,
          }
        : p
    ));
    setIsEditDialogOpen(false);
    setEditingPost(null);
    toast({
      title: language === "th" ? "บันทึกแล้ว" : "Saved",
      description: language === "th" ? "อัปเดตโพสต์เรียบร้อยแล้ว" : "Post updated successfully",
    });
  };

  const handleSimulatePublish = (platform: string) => {
    setPosts(prev => prev.map(p => 
      p.platform === platform 
        ? { ...p, status: "published" as const }
        : p
    ));
    toast({
      title: language === "th" ? "เผยแพร่แล้ว!" : "Published!",
      description: language === "th" 
        ? `โพสต์ ${platform} ถูกเผยแพร่เรียบร้อยแล้ว (จำลอง)` 
        : `${platform} post published successfully (simulated)`,
    });
  };

  const handlePublishAll = () => {
    setPosts(prev => prev.map(p => ({ ...p, status: "published" as const })));
    toast({
      title: language === "th" ? "เผยแพร่ทั้งหมดแล้ว!" : "All Published!",
      description: language === "th" 
        ? "โพสต์ทั้งหมดถูกเผยแพร่เรียบร้อยแล้ว (จำลอง)" 
        : "All posts published successfully (simulated)",
    });
  };

  const handleExportJSON = () => {
    if (!fullCampaign) return;

    const exportData = {
      campaign: fullCampaign,
      posts: posts,
      generatedAt: new Date().toISOString(),
      formData: formData,
      exportVersion: "1.0",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: t("exportedAsJson"),
      description: t("exportedAsJsonDesc"),
    });
  };

  const handleExportText = () => {
    if (!fullCampaign) return;

    let textContent = `CAMPAIGN EXPORT\n${"=".repeat(50)}\n\n`;
    textContent += `Generated: ${new Date().toISOString()}\n\n`;
    textContent += `CAMPAIGN SUMMARY\n${"-".repeat(30)}\n`;
    textContent += `${fullCampaign.campaign_summary}\n\n`;
    textContent += `BIG IDEA\n${"-".repeat(30)}\n`;
    textContent += `${fullCampaign.big_idea}\n\n`;
    textContent += `KEY MESSAGES\n${"-".repeat(30)}\n`;
    fullCampaign.key_messages.forEach((msg, i) => {
      textContent += `${i + 1}. ${msg}\n`;
    });
    textContent += "\n";
    textContent += `VISUAL DIRECTION\n${"-".repeat(30)}\n`;
    textContent += `${fullCampaign.visual_direction}\n\n`;
    textContent += `PLATFORM CONTENT\n${"=".repeat(50)}\n\n`;

    posts.forEach((post) => {
      textContent += `[${post.platform.toUpperCase()}]\n${"-".repeat(30)}\n`;
      textContent += `Status: ${post.status}\n`;
      textContent += `Scheduled: ${post.scheduledDate} at ${post.scheduledTime}\n`;
      textContent += `CTA: ${post.cta}\n`;
      textContent += `Hashtags: ${post.hashtags.join(" ")}\n`;
      textContent += `Content:\n${post.content}\n\n`;
    });

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: t("exportedAsText"),
      description: t("exportedAsTextDesc"),
    });
  };

  const handleStartNew = () => {
    resetCampaign();
    navigate("/campaign/new");
  };

  if (!fullCampaign) {
    return null;
  }

  const allPlatforms = ["all", ...posts.map(p => p.platform)];
  const filteredPosts = selectedPlatform === "all" 
    ? posts 
    : posts.filter(p => p.platform === selectedPlatform);

  const publishedCount = posts.filter(p => p.status === "published").length;
  const scheduledCount = posts.filter(p => p.status === "scheduled").length;
  const [isKpiOpen, setIsKpiOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] gradient-hero-bg opacity-50" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {language === "th" ? "ตรวจสอบและเผยแพร่" : "Review & Publish"}
              </h1>
              <p className="text-muted-foreground">
                {language === "th" 
                  ? "ตรวจสอบโพสต์ทั้งหมดก่อนเผยแพร่ไปยังแพลตฟอร์มโซเชียลมีเดีย" 
                  : "Review all posts before publishing to social media platforms"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-2 px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {publishedCount} {language === "th" ? "เผยแพร่แล้ว" : "Published"}
              </Badge>
              <Badge variant="outline" className="gap-2 px-4 py-2">
                <Clock className="h-4 w-4 text-orange-500" />
                {scheduledCount} {language === "th" ? "รอเผยแพร่" : "Scheduled"}
              </Badge>
            </div>
          </div>
          

        </div>

        {/* Filter Bar */}
        <Card className="mb-6 border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === "th" ? "กรองตามแพลตฟอร์ม:" : "Filter by platform:"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allPlatforms.map((platform) => {
                  const isActive = selectedPlatform === platform;
                  const Icon = platform === "all" ? Eye : platformIcons[platform] || MessageCircle;
                  const colors = platformColors[platform];
                  
                  return (
                    <Button
                      key={platform}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPlatform(platform)}
                      className={`gap-2 ${isActive ? "" : "hover:bg-muted"}`}
                    >
                      <Icon className="h-4 w-4" />
                      {platform === "all" 
                        ? (language === "th" ? "ทั้งหมด" : "All") 
                        : platform}
                      {platform !== "all" && (
                        <span className="text-xs opacity-70">
                          ({posts.filter(p => p.platform === platform).length})
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
              {scheduledCount > 0 && (
                <Button 
                  onClick={handlePublishAll}
                  className="ml-auto gap-2 gradient-hero text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                  {language === "th" ? "เผยแพร่ทั้งหมด" : "Publish All"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI Summary */}
        <Card className="border-border/50 overflow-hidden mb-8">
          <CardHeader className="py-4">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              {language === "th" ? "สรุป KPI โดยประมาณ" : "Estimated KPI Summary"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <KPIDashboard
              formData={formData}
              platforms={posts.map(p => p.platform)}
              compact={false}
            />
          </CardContent>
        </Card>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredPosts.map((post) => {
            const Icon = platformIcons[post.platform] || MessageCircle;
            const colors = platformColors[post.platform] || { bg: "bg-muted", text: "text-foreground", border: "border-border", gradient: "from-gray-500 to-gray-600", badge: "bg-gray-500" };
            const isPublished = post.status === "published";

            return (
              <Card
                key={post.platform}
                className={`overflow-hidden border-border/50 transition-all hover:shadow-lg ${
                  isPublished ? "ring-2 ring-green-500/30" : ""
                }`}
              >
                {/* Platform Header */}
                <div className={`p-4 bg-gradient-to-r ${colors.gradient} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-bold">{post.platform}</span>
                    </div>
                    <Badge 
                      className={`${
                        isPublished 
                          ? "bg-green-500/20 text-white border-green-500/50" 
                          : "bg-white/20 text-white border-white/30"
                      } gap-1.5`}
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {language === "th" ? "เผยแพร่แล้ว" : "Published"}
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5" />
                          {language === "th" ? "รอเผยแพร่" : "Scheduled"}
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={post.thumbnail}
                    alt={`${post.platform} preview`}
                    className="w-full h-full object-cover"
                  />
                  {isPublished && (
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 drop-shadow-lg" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-4">
                  {/* Caption */}
                  <div>
                    <p className="text-sm text-foreground line-clamp-3">
                      {post.content}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{post.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{post.scheduledTime}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm">
                    <MousePointerClick className="h-4 w-4 text-primary" />
                    <Badge variant="secondary">{post.cta}</Badge>
                  </div>

                  {/* Hashtags */}
                  <div className="flex items-start gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="text-xs text-primary">
                          {tag}
                        </span>
                      ))}
                      {post.hashtags.length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +{post.hashtags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                      className="flex-1 gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      {language === "th" ? "แก้ไข" : "Edit"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSimulatePublish(post.platform)}
                      disabled={isPublished}
                      className={`flex-1 gap-2 ${
                        isPublished 
                          ? "bg-green-500/20 text-green-600 border-green-500/30" 
                          : "gradient-hero text-primary-foreground"
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          {language === "th" ? "เผยแพร่แล้ว" : "Published"}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {language === "th" ? "เผยแพร่" : "Publish"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export Options */}
        <Card className="shadow-xl border-2 border-primary/20 bg-primary/5 mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <Download className="h-5 w-5 text-primary" />
              </div>
              {t("exportCampaign")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <p className="text-sm text-muted-foreground mb-6">
              {t("exportCampaignDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handleExportJSON}
                className="flex-1 gap-2 gradient-hero text-primary-foreground shadow-lg hover:shadow-glow"
              >
                <FileJson className="h-5 w-5" />
                {t("exportAsJson")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleExportText}
                className="flex-1 gap-2"
              >
                <FileText className="h-5 w-5" />
                {t("exportAsText")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/campaign/final")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToCampaign")}
          </Button>
          <Button
            size="lg"
            onClick={handleStartNew}
            className="flex-1 gap-2 gradient-hero text-primary-foreground shadow-lg hover:shadow-glow"
          >
            <Send className="h-4 w-4" />
            {t("startNewCampaign")}
          </Button>
        </div>
      </main>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {editingPost && (
                <>
                  {(() => {
                    const Icon = platformIcons[editingPost.platform] || MessageCircle;
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {language === "th" ? `แก้ไขโพสต์ ${editingPost.platform}` : `Edit ${editingPost.platform} Post`}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Thumbnail Preview */}
            {editingPost && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={editingPost.thumbnail}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {language === "th" ? "เนื้อหา" : "Caption"}
              </Label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {language === "th" ? "วันที่" : "Date"}
                </Label>
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {language === "th" ? "เวลา" : "Time"}
                </Label>
                <Input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MousePointerClick className="h-4 w-4" />
                {language === "th" ? "ปุ่ม CTA" : "CTA Button"}
              </Label>
              <Input
                value={editCta}
                onChange={(e) => setEditCta(e.target.value)}
                placeholder="Learn More, Shop Now, etc."
              />
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                {language === "th" ? "แฮชแท็ก" : "Hashtags"}
              </Label>
              <Input
                value={editHashtags}
                onChange={(e) => setEditHashtags(e.target.value)}
                placeholder="#marketing #campaign #brand"
              />
              <p className="text-xs text-muted-foreground">
                {language === "th" ? "คั่นด้วยช่องว่าง" : "Separate with spaces"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleSaveEdit} className="gradient-hero text-primary-foreground">
              {language === "th" ? "บันทึก" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("stepOf")} 4 {t("of")} 4 — {t("publishCampaignTitle")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CampaignPublish;
