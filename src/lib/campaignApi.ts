import { supabase } from "@/integrations/supabase/client";
import { CampaignFormData, CampaignResult } from "./mockData";
import { CampaignPreview } from "@/contexts/CampaignContext";
import { Language } from "./i18n";

// Generate preview only (summary, big idea, key messages, visual direction)
export const generateCampaignPreview = async (
  formData: CampaignFormData,
  language: Language = "en"
): Promise<CampaignPreview> => {
  const actualBudget = formData.budget === 'custom' ? formData.customBudget : formData.budget;
  
  try {
    const response = await fetch('http://54.169.249.150:8002/api/v1/generate-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: "preview",
        language,
        name: formData.campaignBrief || 'แคมเปญใหม่',
        objective: formData.objective,
        target_audience: formData.targetAudience,
        platforms: formData.channels,
        budget: actualBudget,
        content_strategy: formData.contentStrategy || 'organic',
        posting_frequency: formData.postingFrequency || 'weekly'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data as CampaignPreview;
  } catch (error) {
    console.error("API error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate preview");
  }
};

// Generate full campaign with platform-specific content
export const generateFullCampaign = async (
  formData: CampaignFormData,
  preview: CampaignPreview,
  language: Language = "en"
): Promise<CampaignResult> => {
  const actualBudget = formData.budget === 'custom' ? formData.customBudget : formData.budget;
  
  try {
    const response = await fetch('http://54.169.249.150:8002/api/v1/generate-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: "full",
        language,
        name: formData.campaignBrief || 'แคมเปญใหม่',
        objective: formData.objective,
        target_audience: formData.targetAudience,
        platforms: formData.channels,
        budget: actualBudget,
        content_strategy: formData.contentStrategy || 'organic',
        posting_frequency: formData.postingFrequency || 'weekly',
        // Pass preview data to maintain consistency
        existingPreview: {
          campaign_summary: preview.campaign_summary,
          big_idea: preview.big_idea,
          key_messages: preview.key_messages,
          visual_direction: preview.visual_direction,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data as CampaignResult;
  } catch (error) {
    console.error("API error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate full campaign");
  }
};

// Mock preview generation for testing
export const mockGenerateCampaignPreview = (
  formData: CampaignFormData
): Promise<CampaignPreview> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        campaign_summary: `An innovative ${formData.objective.toLowerCase()} campaign targeting ${formData.targetAudience} in the ${formData.industry} industry. This campaign leverages ${formData.channels.join(", ")} to create maximum impact with the theme of "${formData.creativeTheme}". Budget allocation of ${formData.budget} will be distributed strategically across all touchpoints.`,
        big_idea: `"${formData.creativeTheme}" — Empowering ${formData.targetAudience} to discover new possibilities through authentic storytelling and immersive digital experiences that resonate with their lifestyle.`,
        key_messages: [
          `Unlock your potential with ${formData.industry}'s most innovative solutions`,
          `Designed specifically for ${formData.targetAudience} who demand excellence`,
          `Join thousands who have already transformed their experience`,
          `Limited time opportunity — Act now for exclusive benefits`,
        ],
        visual_direction: `Modern, vibrant visuals featuring authentic lifestyle photography combined with bold typography. Color palette: energetic gradients with pops of ${formData.industry === "Technology" ? "electric blue" : "warm coral"}. Emphasis on human connection and emotional storytelling. Clean layouts with ample white space for premium feel.`,
        audience_insights: `${formData.targetAudience} are digitally native, value authenticity, and respond to content that speaks to their aspirations. They spend significant time on ${formData.channels.join(" and ")}, preferring snackable content with strong visual appeal.`,
        channel_strategy: `A synchronized multi-channel approach where ${formData.channels[0]} drives awareness, supported by complementary content across ${formData.channels.slice(1).join(", ")}. Each platform plays a specific role in the customer journey.`,
      });
    }, 1500);
  });
};

// Mock full campaign generation for testing
export const mockGenerateFullCampaign = (
  formData: CampaignFormData,
  preview: CampaignPreview
): Promise<CampaignResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result: CampaignResult = {
        ...preview,
        posts: {},
      };

      if (formData.channels.includes("Facebook")) {
        result.posts.Facebook = {
          caption: `🚀 Ready to transform your ${formData.industry.toLowerCase()} experience?\n\n${formData.targetAudience}, we hear you. That's why we created something special just for you.\n\n✨ Discover the difference that matters\n💡 Innovation meets simplicity\n🎯 Results that speak for themselves\n\nTap the link to learn more! 👆\n\n#${formData.industry.replace(/\s+/g, "")} #Innovation #${formData.objective.replace(/\s+/g, "")}`,
          visual_prompt: `Professional lifestyle photo showing diverse ${formData.targetAudience.toLowerCase()} engaging with modern ${formData.industry.toLowerCase()} products. Warm lighting, authentic expressions, premium setting.`,
        };
      }

      if (formData.channels.includes("Instagram")) {
        result.posts.Instagram = {
          caption: `The future of ${formData.industry.toLowerCase()} is here ✨\n\nSwipe to see how we're changing the game for ${formData.targetAudience.toLowerCase()} →\n\n#${formData.industry.replace(/\s+/g, "")} #Lifestyle #Innovation`,
          carousel: [
            "Hero image: Bold typography with campaign tagline over gradient background",
            "Problem statement: Relatable pain point illustration",
            "Solution reveal: Product/service showcase with key benefits",
            "Social proof: Testimonial cards with user photos",
            "CTA: Swipe up prompt with limited offer details",
          ],
        };
      }

      if (formData.channels.includes("TikTok")) {
        result.posts.TikTok = {
          hook: `POV: You just discovered the secret that ${formData.targetAudience.toLowerCase()} don't want you to know... 👀`,
          script: `[0-3s] Hook with trending sound\n[3-8s] "You know that feeling when..."\n[8-15s] Problem agitation with relatable scenarios\n[15-25s] Solution reveal with visual transformation\n[25-30s] CTA: "Link in bio for exclusive access"`,
        };
      }

      if (formData.channels.includes("YouTube")) {
        result.posts.YouTube = {
          title: `How ${formData.targetAudience} Are Revolutionizing ${formData.industry} in 2024`,
          description: `In this video, we explore the groundbreaking ways ${formData.targetAudience.toLowerCase()} are transforming the ${formData.industry.toLowerCase()} landscape.\n\n🔔 Subscribe for more insights\n👍 Like if you found this valuable\n💬 Comment your thoughts below`,
        };
      }

      if (formData.channels.includes("Line OA")) {
        result.posts["Line OA"] = {
          message: `🎉 Exclusive for our LINE friends!\n\nHi there! We have exciting news for ${formData.targetAudience.toLowerCase()} like you.\n\n✅ Special early access\n✅ Member-only discounts\n✅ Priority support`,
          cta: "Tap to claim your offer →",
        };
      }

      resolve(result);
    }, 2000);
  });
};
