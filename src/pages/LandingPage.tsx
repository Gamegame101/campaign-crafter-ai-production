import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Header } from "@/components/Header";
import { 
  Rocket, 
  Sparkles, 
  Megaphone, 
  MessageCircle, 
  Brain, 
  TrendingUp,
  ArrowRight,
  Github,
  Globe,
  Mail
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Content",
    description: "Generate tailored campaign ideas instantly.",
    gradient: "from-primary/10 to-primary/5",
  },
  {
    icon: Megaphone,
    title: "Multi-Platform Ready",
    description: "Optimized content for Facebook, IG, TikTok, YouTube, and more.",
    gradient: "from-accent/10 to-accent/5",
  },
  {
    icon: Sparkles,
    title: "Creative Direction",
    description: "Visual tone and messaging crafted automatically.",
    gradient: "from-primary/10 to-purple-500/5",
  },
  {
    icon: TrendingUp,
    title: "Strategic Insights",
    description: "Data-driven messaging and KPIs.",
    gradient: "from-emerald-500/10 to-emerald-500/5",
  },
];

const platforms = [
  { name: "Meta Ads", icon: "M" },
  { name: "Google Ads", icon: "G" },
  { name: "TikTok", icon: "T" },
  { name: "Line OA", icon: "L" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] gradient-hero-bg opacity-60" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Content */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">AI-Powered Marketing</span>
                </div>

                {/* Headline */}
                <h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight animate-slide-up"
                >
                  Create Impactful Marketing{" "}
                  <span className="text-gradient">Campaigns with AI</span>
                </h1>

                {/* Description */}
                <p 
                  className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-slide-up"
                  style={{ animationDelay: "100ms" }}
                >
                  Instantly generate strategy, messaging, and ready-to-publish content optimized for every platform.
                </p>

                {/* CTA Buttons */}
                <div 
                  className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-slide-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <Button
                    size="lg"
                    onClick={() => navigate("/campaign/new")}
                    className="w-full sm:w-auto h-14 px-8 text-base font-semibold gradient-hero hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>

                </div>
              </div>

              {/* Right - Illustration */}
              <div className="relative hidden lg:block">
                {/* Main illustration area */}
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Central glow */}
                  <div className="absolute inset-0 gradient-hero rounded-3xl opacity-10 blur-2xl" />
                  
                  {/* Central card */}
                  <div className="absolute inset-8 bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
                    <div className="absolute inset-0 gradient-hero opacity-5" />
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-destructive/60" />
                        <div className="w-3 h-3 rounded-full bg-accent/60" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse-slow" />
                        <div className="h-4 w-full bg-muted rounded animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
                        <div className="h-4 w-2/3 bg-muted rounded animate-pulse-slow" style={{ animationDelay: "1s" }} />
                        <div className="mt-6 h-24 w-full bg-primary/10 rounded-lg border border-primary/20" />
                        <div className="h-4 w-1/2 bg-accent/20 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Floating icons */}
                  <div className="absolute -top-4 -left-4 p-4 bg-card rounded-2xl shadow-lg border border-border/50 animate-float">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute top-8 -right-6 p-4 bg-card rounded-2xl shadow-lg border border-border/50 animate-float-delayed">
                    <Sparkles className="h-8 w-8 text-accent" />
                  </div>
                  <div className="absolute -bottom-4 left-12 p-4 bg-card rounded-2xl shadow-lg border border-border/50 animate-float" style={{ animationDelay: "-2s" }}>
                    <Megaphone className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute bottom-16 -right-8 p-4 bg-card rounded-2xl shadow-lg border border-border/50 animate-float-delayed">
                    <MessageCircle className="h-8 w-8 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Everything you need to launch faster
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our AI handles the heavy lifting so you can focus on what matters most — growing your brand.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className="group relative overflow-hidden border-border/50 bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6 pb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative">
                      <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Credibility Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/50 bg-muted/30">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
              Trusted by Digital Marketers & Creative Teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {platforms.map((platform) => (
                <div 
                  key={platform.name}
                  className="flex items-center gap-3 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-lg">
                    {platform.icon}
                  </div>
                  <span className="font-medium hidden sm:block">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl gradient-dark p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary-foreground mb-4">
                  Ready to transform your marketing?
                </h2>
                <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
                  Join marketers who are already creating campaigns 10x faster with AI-powered tools.
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate("/campaign/new")}
                  className="h-14 px-10 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-accent hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Start Creating Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={false} />
              <span className="text-sm text-muted-foreground">
                AI Marketing Campaign Generator • Demo Prototype
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
