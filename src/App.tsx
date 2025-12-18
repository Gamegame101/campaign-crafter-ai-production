import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CampaignProvider } from "@/contexts/CampaignContext";
import LandingPage from "./pages/LandingPage";
import CampaignsList from "./pages/CampaignsList";
import CampaignNew from "./pages/campaign/CampaignNew";
import CampaignPreview from "./pages/campaign/CampaignPreview";
import CampaignFinal from "./pages/campaign/CampaignFinal";
import CampaignPublish from "./pages/campaign/CampaignPublish";
import OrganizationManagement from "./pages/OrganizationManagement";
import ProductManagement from "./pages/ProductManagement";
import ServiceManagement from "./pages/ServiceManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CampaignProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/campaigns" element={<CampaignsList />} />
              <Route path="/campaign/new" element={<CampaignNew />} />
              <Route path="/campaign/preview" element={<CampaignPreview />} />
              <Route path="/campaign/final" element={<CampaignFinal />} />
              <Route path="/campaign/publish" element={<CampaignPublish />} />
              <Route path="/organizations" element={<OrganizationManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/services" element={<ServiceManagement />} />
              {/* Legacy route redirect */}
              <Route path="/generator" element={<CampaignNew />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CampaignProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
