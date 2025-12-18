import { Building2, Package, Settings, Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <header className="w-full py-5 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          
          {isLandingPage ? (
            <Button 
              onClick={() => navigate('/campaign/new')}
              className="gap-2"
            >
              Get Started
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Menu className="h-4 w-4" />
                  <span className="hidden sm:inline">จัดการข้อมูล</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/organizations')} className="gap-2">
                  <Building2 className="h-4 w-4" />
                  องค์กร
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/products')} className="gap-2">
                  <Package className="h-4 w-4" />
                  สินค้า
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/services')} className="gap-2">
                  <Settings className="h-4 w-4" />
                  บริการ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
