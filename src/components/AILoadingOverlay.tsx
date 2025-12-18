import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sparkles,
  Brain,
  Palette,
  MessageSquare,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface AILoadingOverlayProps {
  isVisible: boolean;
  type: "preview" | "full";
}

interface LoadingStep {
  icon: React.ElementType;
  messageEn: string;
  messageTh: string;
  duration: number;
}

const previewSteps: LoadingStep[] = [
  { icon: Brain, messageEn: "Analyzing brief...", messageTh: "กำลังวิเคราะห์บรีฟ...", duration: 2500 },
  { icon: Sparkles, messageEn: "Generating creative directions...", messageTh: "กำลังสร้างทิศทางความคิดสร้างสรรค์...", duration: 3000 },
  { icon: MessageSquare, messageEn: "Crafting key messages...", messageTh: "กำลังสร้างข้อความหลัก...", duration: 2500 },
  { icon: Palette, messageEn: "Defining visual direction...", messageTh: "กำลังกำหนดทิศทางภาพ...", duration: 2000 },
];

const fullCampaignSteps: LoadingStep[] = [
  { icon: Brain, messageEn: "Analyzing campaign strategy...", messageTh: "กำลังวิเคราะห์กลยุทธ์แคมเปญ...", duration: 2000 },
  { icon: Sparkles, messageEn: "Generating creative directions...", messageTh: "กำลังสร้างทิศทางความคิดสร้างสรรค์...", duration: 3000 },
  { icon: MessageSquare, messageEn: "Building platform content...", messageTh: "กำลังสร้างเนื้อหาสำหรับแต่ละแพลตฟอร์ม...", duration: 4000 },
  { icon: Palette, messageEn: "Designing visual prompts...", messageTh: "กำลังออกแบบคำอธิบายภาพ...", duration: 3000 },
  { icon: Zap, messageEn: "Finalizing campaign output...", messageTh: "กำลังสรุปผลลัพธ์แคมเปญ...", duration: 2000 },
];

export const AILoadingOverlay = ({ isVisible, type }: AILoadingOverlayProps) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = type === "preview" ? previewSteps : fullCampaignSteps;

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      setCompletedSteps([]);
      return;
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const maxProgress = ((currentStep + 1) / steps.length) * 100;
        const increment = Math.random() * 3 + 1;
        return Math.min(prev + increment, Math.min(maxProgress - 5, 95));
      });
    }, 200);

    // Step cycling
    let stepTimeout: NodeJS.Timeout;
    const cycleSteps = () => {
      if (currentStep < steps.length - 1) {
        stepTimeout = setTimeout(() => {
          setCompletedSteps((prev) => [...prev, currentStep]);
          setCurrentStep((prev) => prev + 1);
          cycleSteps();
        }, steps[currentStep].duration);
      }
    };
    cycleSteps();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [isVisible, currentStep, steps]);

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStep]?.icon || Sparkles;
  const currentMessage = language === "th" 
    ? steps[currentStep]?.messageTh 
    : steps[currentStep]?.messageEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl mx-4">
        {/* Main Loading Card */}
        <Card className="shadow-2xl border-primary/20 overflow-hidden">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 animate-pulse">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {language === "th" ? "AI กำลังสร้างแคมเปญ" : "AI Generating Campaign"}
              </h2>
              <p className="text-muted-foreground">
                {language === "th" 
                  ? "กรุณารอสักครู่ ระบบกำลังประมวลผล..." 
                  : "Please wait while we process your request..."}
              </p>
            </div>

            {/* Current Step Display */}
            <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="p-3 rounded-xl bg-primary/20 animate-bounce">
                <CurrentIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-lg font-medium text-foreground animate-pulse">
                {currentMessage}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>
                  {language === "th" ? "ความคืบหน้า" : "Progress"}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = completedSteps.includes(index);
                const isCurrent = currentStep === index;
                const isPending = index > currentStep;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      isCompleted 
                        ? "bg-green-500/10 border border-green-500/30" 
                        : isCurrent 
                          ? "bg-primary/10 border border-primary/30" 
                          : "bg-muted/30 border border-border/50 opacity-50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isCompleted 
                        ? "bg-green-500/20" 
                        : isCurrent 
                          ? "bg-primary/20" 
                          : "bg-muted"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <StepIcon className={`h-4 w-4 ${isCurrent ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                      )}
                    </div>
                    <span className={`text-sm ${
                      isCompleted 
                        ? "text-green-600 line-through" 
                        : isCurrent 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground"
                    }`}>
                      {language === "th" ? step.messageTh : step.messageEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Preview Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 opacity-50">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="h-20 w-full rounded-lg bg-muted animate-pulse" />
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="h-20 w-full rounded-lg bg-muted animate-pulse" />
          </Card>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {language === "th" 
            ? "💡 เคล็ดลับ: ยิ่งบรีฟมีรายละเอียดมาก AI จะสร้างเนื้อหาได้ตรงใจมากขึ้น" 
            : "💡 Tip: The more detailed your brief, the better AI can tailor the content"}
        </p>
      </div>
    </div>
  );
};

// Loading skeleton component for inline loading states
export const CampaignLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Skeleton */}
      <Card className="shadow-xl overflow-hidden border-border/50">
        <div className="gradient-hero p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/20 animate-pulse" />
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <CardContent className="pt-6 pb-6">
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Big Idea Skeleton */}
      <Card className="shadow-xl border-l-4 border-l-accent border-border/50">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="p-5 bg-muted/30 rounded-xl">
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
            <div className="h-6 w-3/4 bg-muted rounded animate-pulse mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Key Messages Skeleton */}
      <Card className="shadow-xl border-border/50">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
            <div className="h-6 w-36 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="h-10 w-10 rounded-xl bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Direction Skeleton */}
      <Card className="shadow-xl border-border/50">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-24 w-full rounded-xl bg-muted animate-pulse mb-4" />
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square rounded-xl bg-muted animate-pulse" />
            <div className="aspect-square rounded-xl bg-muted animate-pulse" />
            <div className="aspect-square rounded-xl bg-muted animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
