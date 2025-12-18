import { useState, useMemo } from "react";
import { format, addDays, eachDayOfInterval } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { CampaignResult, CampaignFormData, DEMO_CAMPAIGN_IMAGES } from "@/lib/mockData";
import { AdScheduleView } from "./AdScheduleView";
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Clock,
  Edit3,
  X,
  Check,
  Calendar,
  Image as ImageIcon,
  Filter,
  Eye,
  Sparkles,
  Video,
  Type,
  Hash,
  Link,
  MessageSquare,
  Upload,
  Wand2,
  Megaphone,
  DollarSign,
  Zap,
} from "lucide-react";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface ContentCalendarProps {
  result: CampaignResult;
  formData: CampaignFormData | null;
  onUpdateResult?: (result: CampaignResult) => void;
}

interface PostItem {
  platform: string;
  day: number;
  content: string;
  visualPrompt?: string;
  type: string;
  time: string;
  hashtags?: string[];
  cta?: string;
  thumbnail?: string;
  postType?: "organic" | "boosted" | "ad";
  postIndex?: number;
}

const platformIcons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <TikTokIcon className="h-4 w-4" />,
  YouTube: <Youtube className="h-4 w-4" />,
  "Line OA": <MessageCircle className="h-4 w-4" />,
};

const platformColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  Facebook: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/30", gradient: "from-blue-500 to-blue-600" },
  Instagram: { bg: "bg-pink-500/10", text: "text-pink-600", border: "border-pink-500/30", gradient: "from-pink-500 via-purple-500 to-orange-400" },
  TikTok: { bg: "bg-slate-500/10", text: "text-slate-600", border: "border-slate-500/30", gradient: "from-slate-700 to-slate-900" },
  YouTube: { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/30", gradient: "from-red-500 to-red-600" },
  "Line OA": { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/30", gradient: "from-green-500 to-green-600" },
};

const postTypeBadges: Record<string, { icon: React.ReactNode; label: Record<string, string>; color: string }> = {
  organic: { 
    icon: <Megaphone className="h-3 w-3" />, 
    label: { en: "Organic", th: "ออร์แกนิค" },
    color: "bg-green-500/10 text-green-600 border-green-500/30"
  },
  boosted: { 
    icon: <Zap className="h-3 w-3" />, 
    label: { en: "Boosted", th: "บูสต์" },
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30"
  },
  ad: { 
    icon: <DollarSign className="h-3 w-3" />, 
    label: { en: "Ad", th: "โฆษณา" },
    color: "bg-orange-500/10 text-orange-600 border-orange-500/30"
  },
};

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00"
];

export const ContentCalendar = ({ result, formData, onUpdateResult }: ContentCalendarProps) => {
  const { language } = useLanguage();
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editVisualPrompt, setEditVisualPrompt] = useState("");
  const [editTime, setEditTime] = useState("10:00");
  const [editHashtags, setEditHashtags] = useState("");
  const [editCta, setEditCta] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const dateLocale = language === "th" ? th : enUS;

  // Generate dates from campaign period
  const startDate = formData?.startDate || new Date();
  const endDate = formData?.endDate || addDays(startDate, 6);
  const campaignDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Get available platforms from result
  const availablePlatforms = useMemo(() => {
    return Object.keys(result.posts).filter(p => result.posts[p as keyof typeof result.posts]);
  }, [result.posts]);

  // Get random demo image for a platform
  const getDemoImage = (platform: string, index: number) => {
    const platformHash = platform.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return DEMO_CAMPAIGN_IMAGES[(platformHash + index) % DEMO_CAMPAIGN_IMAGES.length];
  };

  // Helper to extract post data from different formats
  const extractPostContent = (platform: string, postData: any, postIndex: number = 0): Omit<PostItem, 'platform' | 'day' | 'time' | 'thumbnail'> => {
    let content = "";
    let visualPrompt = "";
    let type = "post";
    let hashtags: string[] = [];
    let cta = "";
    let postType: "organic" | "boosted" | "ad" = postData.postType || "organic";

    if (platform === "Facebook") {
      content = postData.caption || "";
      visualPrompt = postData.visual_prompt || "";
      type = "post";
      const hashtagMatch = content.match(/#\w+/g);
      hashtags = hashtagMatch || [];
    } else if (platform === "Instagram") {
      content = postData.caption || "";
      visualPrompt = Array.isArray(postData.carousel) ? postData.carousel.join("\n") : (postData.visual_prompt || "");
      type = postData.carousel ? "carousel" : "post";
      const hashtagMatch = content.match(/#\w+/g);
      hashtags = hashtagMatch || [];
    } else if (platform === "TikTok") {
      content = (postData.hook || "") + "\n\n" + (postData.script || "");
      visualPrompt = "Video script with trending audio";
      type = "video";
    } else if (platform === "YouTube") {
      content = (postData.title || "") + "\n\n" + (postData.description || "");
      visualPrompt = "YouTube thumbnail with engaging title overlay";
      type = "video";
      const hashtagMatch = (postData.description || "").match(/#\w+/g);
      hashtags = hashtagMatch || [];
    } else if (platform === "Line OA") {
      content = postData.message || "";
      cta = postData.cta || "";
      type = "message";
    }

    return { content, visualPrompt, type, hashtags, cta, postType, postIndex };
  };

  // Generate posts array with scheduling - supports both single post and array of posts
  const generateScheduledPosts = (): PostItem[] => {
    const posts: PostItem[] = [];
    const platforms = Object.keys(result.posts);

    const defaultTimes: Record<string, string> = {
      Facebook: "10:00",
      Instagram: "18:00",
      TikTok: "20:00",
      YouTube: "12:00",
      "Line OA": "11:00",
    };

    platforms.forEach((platform) => {
      const postData = result.posts[platform as keyof typeof result.posts];
      if (!postData) return;

      // Check if postData is an array (new format) or single object (old format)
      if (Array.isArray(postData)) {
        // New format: array of posts
        postData.forEach((singlePost, postIndex) => {
          const dayIndex = singlePost.day !== undefined 
            ? singlePost.day - 1 // day is 1-indexed from API
            : postIndex % campaignDays.length;

          const extracted = extractPostContent(platform, singlePost, postIndex);

          posts.push({
            platform,
            day: Math.min(dayIndex, campaignDays.length - 1),
            time: singlePost.time || defaultTimes[platform] || "10:00",
            thumbnail: getDemoImage(platform, postIndex),
            ...extracted,
          });
        });
      } else {
        // Old format: single post object - distribute across days
        const dayIndex = platforms.indexOf(platform) % campaignDays.length;
        const extracted = extractPostContent(platform, postData, 0);

        posts.push({
          platform,
          day: dayIndex,
          time: defaultTimes[platform] || "10:00",
          thumbnail: getDemoImage(platform, dayIndex),
          ...extracted,
        });
      }
    });

    // Sort by day
    return posts.sort((a, b) => a.day - b.day);
  };

  const scheduledPosts = useMemo(() => generateScheduledPosts(), [result, formData]);

  const getPostsForDay = (dayIndex: number) => {
    return scheduledPosts.filter((post) => {
      if (selectedPlatform !== "all" && post.platform !== selectedPlatform) return false;
      return post.day === dayIndex;
    });
  };

  const filteredPosts = useMemo(() => {
    if (selectedPlatform === "all") return scheduledPosts;
    return scheduledPosts.filter(p => p.platform === selectedPlatform);
  }, [scheduledPosts, selectedPlatform]);

  const handleEditPost = (post: PostItem) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditVisualPrompt(post.visualPrompt || "");
    setEditTime(post.time);
    setEditHashtags(post.hashtags?.join(" ") || "");
    setEditCta(post.cta || "");
    setEditThumbnail(post.thumbnail || "");
  };

  const handleGenerateImage = () => {
    // Random pick from demo images
    const randomImage = DEMO_CAMPAIGN_IMAGES[Math.floor(Math.random() * DEMO_CAMPAIGN_IMAGES.length)];
    setEditThumbnail(randomImage);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditThumbnail(url);
    }
  };

  const handleSaveEdit = () => {
    if (!editingPost || !onUpdateResult) {
      setEditingPost(null);
      return;
    }

    const newResult = { ...result };
    const platform = editingPost.platform as keyof typeof result.posts;

    if (platform === "Facebook" && newResult.posts.Facebook) {
      newResult.posts.Facebook = {
        caption: editContent,
        visual_prompt: editVisualPrompt,
      };
    } else if (platform === "Instagram" && newResult.posts.Instagram) {
      newResult.posts.Instagram = {
        caption: editContent,
        carousel: editVisualPrompt.split("\n").filter(Boolean),
      };
    } else if (platform === "TikTok" && newResult.posts.TikTok) {
      const [hook, ...scriptParts] = editContent.split("\n\n");
      newResult.posts.TikTok = {
        hook: hook || "",
        script: scriptParts.join("\n\n"),
      };
    } else if (platform === "YouTube" && newResult.posts.YouTube) {
      const [title, ...descParts] = editContent.split("\n\n");
      newResult.posts.YouTube = {
        title: title || "",
        description: descParts.join("\n\n"),
      };
    } else if (platform === "Line OA" && newResult.posts["Line OA"]) {
      newResult.posts["Line OA"] = {
        message: editContent,
        cta: editCta,
      };
    }

    onUpdateResult(newResult);
    setEditingPost(null);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, Record<string, string>> = {
      post: { en: "Post", th: "โพสต์" },
      carousel: { en: "Carousel", th: "แคโรเซล" },
      video: { en: "Video", th: "วิดีโอ" },
      message: { en: "Message", th: "ข้อความ" },
    };
    return labels[type]?.[language] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      post: <ImageIcon className="h-3 w-3" />,
      carousel: <Sparkles className="h-3 w-3" />,
      video: <Video className="h-3 w-3" />,
      message: <MessageSquare className="h-3 w-3" />,
    };
    return icons[type] || <ImageIcon className="h-3 w-3" />;
  };

  const getPostTypeBadge = (postType?: string) => {
    if (!postType) return null;
    const badge = postTypeBadges[postType];
    if (!badge) return null;
    return (
      <Badge variant="outline" className={`text-[10px] px-1 py-0 h-4 gap-0.5 ${badge.color}`}>
        {badge.icon}
        {badge.label[language]}
      </Badge>
    );
  };

  // Check if this is a paid campaign
  const isPaidCampaign = formData?.contentStrategy === "paid" || formData?.contentStrategy === "mixed";

  return (
    <div className="space-y-6">
      {/* Ad Schedule View for Paid/Mixed Campaigns */}
      {isPaidCampaign && result.ad_schedule && (
        <AdScheduleView
          schedule={result.ad_schedule}
          totalBudget={formData?.budget ? parseInt(formData.budget) : undefined}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {/* Calendar Header with Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {language === "th" ? "ปฏิทินเนื้อหา" : "Content Calendar"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "th" ? "คลิกที่โพสต์เพื่อดูและแก้ไข" : "Click on a post to view and edit"}
            </p>
          </div>
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 mr-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {language === "th" ? "แพลตฟอร์ม:" : "Platform:"}
            </span>
          </div>
          <Button
            variant={selectedPlatform === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform("all")}
            className="h-8"
          >
            {language === "th" ? "ทั้งหมด" : "All"}
          </Button>
          {availablePlatforms.map((platform) => {
            const colors = platformColors[platform];
            const isSelected = selectedPlatform === platform;
            return (
              <Button
                key={platform}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(platform)}
                className={`h-8 gap-1.5 ${isSelected ? "" : `${colors.text} hover:${colors.bg}`}`}
              >
                {platformIcons[platform]}
                <span className="hidden sm:inline">{platform}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("calendar")}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          {language === "th" ? "ปฏิทิน" : "Calendar"}
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          {language === "th" ? "รายการ" : "List"}
        </Button>
      </div>

      {viewMode === "calendar" ? (
        /* Calendar Grid */
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {campaignDays.slice(0, 7).map((day, index) => (
            <div key={`header-${index}`} className="p-2 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                {format(day, "EEE", { locale: dateLocale })}
              </p>
            </div>
          ))}

          {/* Calendar Days */}
          {campaignDays.map((day, dayIndex) => {
            const dayPosts = getPostsForDay(dayIndex);
            const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <Card
                key={dayIndex}
                className={`min-h-[140px] ${isToday ? "ring-2 ring-primary" : ""} border-border/50`}
              >
                <CardContent className="p-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : "text-foreground"}`}>
                      {format(day, "d")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(day, "MMM", { locale: dateLocale })}
                    </span>
                  </div>

                  {/* Posts for this day */}
                  <div className="space-y-1.5">
                    {dayPosts.map((post, postIndex) => {
                      const colors = platformColors[post.platform] || platformColors.Facebook;
                      return (
                        <button
                          key={postIndex}
                          onClick={() => handleEditPost(post)}
                          className={`w-full p-2 rounded-lg ${colors.bg} border ${colors.border} text-left hover:opacity-80 transition-opacity group`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={colors.text}>{platformIcons[post.platform]}</span>
                            <span className={`text-xs font-medium ${colors.text}`}>
                              {post.platform}
                            </span>
                            <Edit3 className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {post.content.slice(0, 50)}...
                          </p>
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 gap-0.5">
                              {getTypeIcon(post.type)}
                              {getTypeLabel(post.type)}
                            </Badge>
                            {getPostTypeBadge(post.postType)}
                            <Clock className="h-3 w-3 text-muted-foreground ml-auto" />
                            <span className="text-[10px] text-muted-foreground">{post.time}</span>
                          </div>
                        </button>
                      );
                    })}

                    {dayPosts.length === 0 && (
                      <div className="h-16 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">
                          {language === "th" ? "ไม่มีโพสต์" : "No posts"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View - Platform by Platform */
        <div className="space-y-4">
          {filteredPosts.map((post, index) => {
            const colors = platformColors[post.platform] || platformColors.Facebook;
            const postDate = campaignDays[post.day] || startDate;

            return (
              <Card
                key={index}
                className={`overflow-hidden border ${colors.border} hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => handleEditPost(post)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="md:w-48 h-32 md:h-auto relative overflow-hidden bg-muted">
                    <img
                      src={post.thumbnail}
                      alt={`${post.platform} preview`}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-20`} />
                    <div className="absolute top-2 left-2">
                      <Badge className={`bg-white/90 backdrop-blur-sm ${colors.text} border ${colors.border} gap-1 shadow-sm`}>
                        {platformIcons[post.platform]}
                        {post.platform}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="gap-1">
                          {getTypeIcon(post.type)}
                          {getTypeLabel(post.type)}
                        </Badge>
                        {getPostTypeBadge(post.postType)}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(postDate, "d MMM", { locale: dateLocale })}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.time}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                        <Edit3 className="h-4 w-4" />
                        {language === "th" ? "แก้ไข" : "Edit"}
                      </Button>
                    </div>

                    {post.content && (
                      <p className="text-sm text-foreground line-clamp-3 mb-3">
                        {post.content}
                      </p>
                    )}
                    {!post.content && (
                      <p className="text-sm text-muted-foreground italic mb-3">
                        {language === "th" ? "ไม่มีเนื้อหา - คลิกเพื่อแก้ไข" : "No content - click to edit"}
                      </p>
                    )}

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.hashtags.slice(0, 5).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.hashtags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.hashtags.length - 5}
                          </Badge>
                        )}
                      </div>
                    )}

                    {post.cta && (
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <Link className="h-3.5 w-3.5" />
                        {post.cta}
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {editingPost && (
                <>
                  <div className={`p-2 rounded-lg ${platformColors[editingPost.platform]?.bg}`}>
                    <span className={platformColors[editingPost.platform]?.text}>
                      {platformIcons[editingPost.platform]}
                    </span>
                  </div>
                  <div>
                    <span className="block">
                      {language === "th" ? `แก้ไขโพสต์ ${editingPost.platform}` : `Edit ${editingPost.platform} Post`}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="gap-1">
                        {getTypeIcon(editingPost.type)}
                        {getTypeLabel(editingPost.type)}
                      </Badge>
                    </span>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Preview Image */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {language === "th" ? "ตัวอย่าง" : "Preview"}
              </Label>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                {editThumbnail ? (
                  <>
                    <img
                      src={editThumbnail}
                      alt="Post preview"
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${editingPost ? platformColors[editingPost.platform]?.gradient : ""} opacity-10`} />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Image Actions */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  className="flex-1 gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  {language === "th" ? "สร้างรูป" : "Generate"}
                </Button>
                <label className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                      {language === "th" ? "อัปโหลด" : "Upload"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Visual Prompt */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {language === "th" ? "คำอธิบายภาพ / Visual Prompt" : "Visual Prompt"}
                </Label>
                <Textarea
                  value={editVisualPrompt}
                  onChange={(e) => setEditVisualPrompt(e.target.value)}
                  rows={3}
                  className="font-mono text-sm"
                  placeholder={language === "th" ? "อธิบายภาพที่ต้องการ..." : "Describe the visual..."}
                />
              </div>
            </div>

            {/* Content & Settings */}
            <div className="space-y-4">
              {/* Schedule Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {language === "th" ? "เวลาโพส" : "Post Time"}
                  </Label>
                  <Select value={editTime} onValueChange={setEditTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {editingPost?.platform === "Line OA" && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      CTA
                    </Label>
                    <Input
                      value={editCta}
                      onChange={(e) => setEditCta(e.target.value)}
                      placeholder="Call to action..."
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  {language === "th" ? "เนื้อหา" : "Content"}
                </Label>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              {/* Hashtags (for applicable platforms) */}
              {(editingPost?.platform === "Facebook" || 
                editingPost?.platform === "Instagram" || 
                editingPost?.platform === "YouTube") && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    {language === "th" ? "แฮชแท็ก" : "Hashtags"}
                  </Label>
                  <Input
                    value={editHashtags}
                    onChange={(e) => setEditHashtags(e.target.value)}
                    placeholder="#hashtag1 #hashtag2 #hashtag3"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingPost(null)} className="gap-2">
              <X className="h-4 w-4" />
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleSaveEdit} className="gap-2 gradient-hero text-primary-foreground">
              <Check className="h-4 w-4" />
              {language === "th" ? "บันทึก" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
