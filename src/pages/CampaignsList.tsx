import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Plus,
  Search,
  Calendar,
  Target,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Megaphone,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Facebook,
  Instagram,
  Youtube,
  Music2,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock campaigns data
const MOCK_CAMPAIGNS = [
  {
    id: "1",
    name: "Summer Sale 2024",
    objective: "Conversion",
    budget: 50000,
    platforms: ["Facebook", "Instagram", "TikTok"],
    status: "published",
    createdAt: "2024-12-01",
    reach: 125000,
    conversions: 340,
  },
  {
    id: "2",
    name: "Brand Awareness Q4",
    objective: "Brand Awareness",
    budget: 100000,
    platforms: ["YouTube", "Facebook"],
    status: "draft",
    createdAt: "2024-12-05",
    reach: 0,
    conversions: 0,
  },
  {
    id: "3",
    name: "New Product Launch",
    objective: "Engagement",
    budget: 75000,
    platforms: ["Instagram", "TikTok", "Line OA"],
    status: "published",
    createdAt: "2024-11-20",
    reach: 89000,
    conversions: 156,
  },
  {
    id: "4",
    name: "Holiday Special Campaign",
    objective: "Conversion",
    budget: 120000,
    platforms: ["Facebook", "Instagram", "YouTube", "TikTok"],
    status: "scheduled",
    createdAt: "2024-12-08",
    reach: 0,
    conversions: 0,
  },
];

const platformIcons: Record<string, React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
  TikTok: Music2,
  "Line OA": MessageCircle,
};

const statusConfig: Record<string, { label: string; labelTh: string; color: string; icon: React.ElementType }> = {
  draft: { 
    label: "Draft", 
    labelTh: "แบบร่าง", 
    color: "bg-muted text-muted-foreground", 
    icon: FileText 
  },
  scheduled: { 
    label: "Scheduled", 
    labelTh: "กำหนดเวลา", 
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30", 
    icon: Clock 
  },
  published: { 
    label: "Published", 
    labelTh: "เผยแพร่แล้ว", 
    color: "bg-green-500/10 text-green-600 border-green-500/30", 
    icon: CheckCircle2 
  },
  paused: { 
    label: "Paused", 
    labelTh: "หยุดชั่วคราว", 
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", 
    icon: AlertCircle 
  },
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toLocaleString();
};

const formatCurrency = (num: number): string => {
  return "฿" + formatNumber(num);
};

const CampaignsList = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: MOCK_CAMPAIGNS.length,
    published: MOCK_CAMPAIGNS.filter((c) => c.status === "published").length,
    draft: MOCK_CAMPAIGNS.filter((c) => c.status === "draft").length,
    totalBudget: MOCK_CAMPAIGNS.reduce((sum, c) => sum + c.budget, 0),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div className="hidden sm:block h-6 w-px bg-border" />
            <nav className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                {language === "th" ? "หน้าแรก" : "Home"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="bg-muted"
              >
                {language === "th" ? "แคมเปญ" : "Campaigns"}
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              onClick={() => navigate("/campaign/new")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === "th" ? "สร้างแคมเปญใหม่" : "New Campaign"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {language === "th" ? "แคมเปญทั้งหมด" : "All Campaigns"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === "th" 
                ? "จัดการและติดตามแคมเปญการตลาดของคุณ" 
                : "Manage and track your marketing campaigns"}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "th" ? "แคมเปญทั้งหมด" : "Total Campaigns"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.published}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "th" ? "เผยแพร่แล้ว" : "Published"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "th" ? "แบบร่าง" : "Drafts"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalBudget)}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "th" ? "งบประมาณรวม" : "Total Budget"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === "th" ? "ค้นหาแคมเปญ..." : "Search campaigns..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter 
                    ? (language === "th" ? statusConfig[statusFilter].labelTh : statusConfig[statusFilter].label)
                    : (language === "th" ? "สถานะทั้งหมด" : "All Status")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  {language === "th" ? "ทั้งหมด" : "All"}
                </DropdownMenuItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <DropdownMenuItem key={key} onClick={() => setStatusFilter(key)}>
                    {language === "th" ? config.labelTh : config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Campaigns List */}
          {filteredCampaigns.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-16 text-center">
                <Megaphone className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {language === "th" ? "ไม่พบแคมเปญ" : "No campaigns found"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === "th" 
                    ? "เริ่มต้นสร้างแคมเปญแรกของคุณ" 
                    : "Get started by creating your first campaign"}
                </p>
                <Button onClick={() => navigate("/campaign/new")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {language === "th" ? "สร้างแคมเปญใหม่" : "Create Campaign"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => {
                const status = statusConfig[campaign.status];
                const StatusIcon = status.icon;
                
                return (
                  <Card 
                    key={campaign.id} 
                    className="border-border/50 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
                    onClick={() => navigate("/campaign/final")}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Campaign Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                              <Megaphone className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-foreground truncate">
                                  {campaign.name}
                                </h3>
                                <Badge variant="outline" className={status.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {language === "th" ? status.labelTh : status.label}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Target className="h-3.5 w-3.5" />
                                  {campaign.objective}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  {formatCurrency(campaign.budget)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {new Date(campaign.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Platforms */}
                        <div className="flex items-center gap-2">
                          {campaign.platforms.slice(0, 4).map((platform) => {
                            const Icon = platformIcons[platform] || MessageCircle;
                            return (
                              <div
                                key={platform}
                                className="p-2 rounded-lg bg-muted/50 border border-border/50"
                                title={platform}
                              >
                                <Icon className="h-4 w-4 text-muted-foreground" />
                              </div>
                            );
                          })}
                          {campaign.platforms.length > 4 && (
                            <Badge variant="secondary">+{campaign.platforms.length - 4}</Badge>
                          )}
                        </div>

                        {/* Stats */}
                        {campaign.status === "published" && (
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <p className="font-semibold text-foreground">{formatNumber(campaign.reach)}</p>
                              <p className="text-xs text-muted-foreground">
                                {language === "th" ? "การเข้าถึง" : "Reach"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-foreground">{formatNumber(campaign.conversions)}</p>
                              <p className="text-xs text-muted-foreground">
                                {language === "th" ? "คอนเวอร์ชัน" : "Conversions"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              {language === "th" ? "ดูรายละเอียด" : "View Details"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              {language === "th" ? "แก้ไข" : "Edit"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <TrendingUp className="h-4 w-4" />
                              {language === "th" ? "ดู Analytics" : "View Analytics"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              {language === "th" ? "ลบ" : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          {language === "th" 
            ? "AI Marketing Campaign Generator • Demo Prototype" 
            : "AI Marketing Campaign Generator • Demo Prototype"}
        </div>
      </footer>
    </div>
  );
};

export default CampaignsList;
