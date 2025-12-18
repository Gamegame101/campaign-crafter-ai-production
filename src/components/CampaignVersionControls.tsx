import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCampaign } from "@/contexts/CampaignContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import {
  History,
  Copy,
  Undo2,
  ChevronDown,
  Check,
  Clock,
  Save,
} from "lucide-react";

interface CampaignVersionControlsProps {
  onSaveVersion?: () => void;
  compact?: boolean;
}

export const CampaignVersionControls = ({ 
  onSaveVersion,
  compact = false 
}: CampaignVersionControlsProps) => {
  const { language } = useLanguage();
  const {
    versions,
    currentVersionId,
    saveVersion,
    switchToVersion,
    duplicateCampaign,
    undoLastChange,
    canUndo,
  } = useCampaign();

  const handleSaveVersion = () => {
    saveVersion();
    toast({
      title: language === "th" ? "บันทึกเวอร์ชันแล้ว" : "Version Saved",
      description: language === "th" 
        ? `บันทึกเป็นเวอร์ชันที่ ${versions.length + 1}` 
        : `Saved as Version ${versions.length + 1}`,
    });
    onSaveVersion?.();
  };

  const handleDuplicate = () => {
    duplicateCampaign();
    toast({
      title: language === "th" ? "ทำสำเนาแล้ว" : "Campaign Duplicated",
      description: language === "th" 
        ? "สร้างสำเนาแคมเปญใหม่เรียบร้อยแล้ว" 
        : "Created a copy of the current campaign",
    });
  };

  const handleUndo = () => {
    const success = undoLastChange();
    if (success) {
      toast({
        title: language === "th" ? "ยกเลิกการเปลี่ยนแปลง" : "Change Undone",
        description: language === "th" 
          ? "กู้คืนสถานะก่อนหน้าแล้ว" 
          : "Restored previous state",
      });
    } else {
      toast({
        title: language === "th" ? "ไม่มีการเปลี่ยนแปลงให้ยกเลิก" : "Nothing to Undo",
        description: language === "th" 
          ? "ไม่พบประวัติการเปลี่ยนแปลง" 
          : "No changes in history",
        variant: "destructive",
      });
    }
  };

  const handleSwitchVersion = (versionId: string) => {
    switchToVersion(versionId);
    const version = versions.find(v => v.id === versionId);
    toast({
      title: language === "th" ? "เปลี่ยนเวอร์ชันแล้ว" : "Version Changed",
      description: version?.label || "",
    });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === "th" ? "th-TH" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Version Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">
                {versions.length > 0 
                  ? (versions.find(v => v.id === currentVersionId)?.label || (language === "th" ? "เวอร์ชัน" : "Version"))
                  : (language === "th" ? "ไม่มีเวอร์ชัน" : "No versions")}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-popover border border-border shadow-lg z-50">
            <DropdownMenuLabel className="flex items-center gap-2">
              <History className="h-4 w-4" />
              {language === "th" ? "ประวัติเวอร์ชัน" : "Version History"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {versions.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {language === "th" ? "ยังไม่มีเวอร์ชันที่บันทึก" : "No saved versions yet"}
              </div>
            ) : (
              versions.slice().reverse().map((version) => (
                <DropdownMenuItem
                  key={version.id}
                  onClick={() => handleSwitchVersion(version.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {currentVersionId === version.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                    <span className={currentVersionId === version.id ? "font-medium" : ""}>
                      {version.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(version.timestamp)}
                  </span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSaveVersion} className="cursor-pointer">
              <Save className="h-4 w-4 mr-2" />
              {language === "th" ? "บันทึกเวอร์ชันใหม่" : "Save New Version"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Actions */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          disabled={!canUndo}
          className="gap-2"
        >
          <Undo2 className="h-4 w-4" />
          <span className="hidden sm:inline">{language === "th" ? "ยกเลิก" : "Undo"}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDuplicate}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">{language === "th" ? "ทำสำเนา" : "Duplicate"}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Version Badge */}
      {versions.length > 0 && (
        <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
          <History className="h-3.5 w-3.5" />
          {versions.length} {language === "th" ? "เวอร์ชัน" : "versions"}
        </Badge>
      )}

      {/* Version Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            {versions.length > 0 
              ? (versions.find(v => v.id === currentVersionId)?.label || (language === "th" ? "เลือกเวอร์ชัน" : "Select Version"))
              : (language === "th" ? "ไม่มีเวอร์ชัน" : "No versions")}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72 bg-popover border border-border shadow-lg z-50">
          <DropdownMenuLabel className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {language === "th" ? "ประวัติเวอร์ชัน" : "Version History"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {versions.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              <History className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>{language === "th" ? "ยังไม่มีเวอร์ชันที่บันทึก" : "No saved versions yet"}</p>
              <p className="text-xs mt-1">
                {language === "th" 
                  ? "คลิก 'บันทึกเวอร์ชัน' เพื่อสร้างเวอร์ชันแรก" 
                  : "Click 'Save Version' to create your first version"}
              </p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {versions.slice().reverse().map((version) => (
                <DropdownMenuItem
                  key={version.id}
                  onClick={() => handleSwitchVersion(version.id)}
                  className="flex items-center justify-between cursor-pointer py-3"
                >
                  <div className="flex items-center gap-2">
                    {currentVersionId === version.id ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <div className="w-4" />
                    )}
                    <div>
                      <span className={`block ${currentVersionId === version.id ? "font-medium text-primary" : ""}`}>
                        {version.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {version.fullCampaign ? (language === "th" ? "แคมเปญเต็ม" : "Full Campaign") : 
                         version.preview ? (language === "th" ? "พรีวิว" : "Preview") : 
                         (language === "th" ? "แบบร่าง" : "Draft")}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(version.timestamp)}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSaveVersion} className="cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            {language === "th" ? "บันทึกเวอร์ชันใหม่" : "Save New Version"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save Version */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSaveVersion}
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        {language === "th" ? "บันทึกเวอร์ชัน" : "Save Version"}
      </Button>

      {/* Undo */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleUndo}
        disabled={!canUndo}
        className="gap-2"
      >
        <Undo2 className="h-4 w-4" />
        {language === "th" ? "ยกเลิก" : "Undo"}
        {canUndo && (
          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
            1
          </Badge>
        )}
      </Button>

      {/* Duplicate */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDuplicate}
        className="gap-2"
      >
        <Copy className="h-4 w-4" />
        {language === "th" ? "ทำสำเนา" : "Duplicate"}
      </Button>
    </div>
  );
};
