import { Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-br from-primary to-blue-500 text-white font-bold text-xl">
              🏗️
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">SmartBTP</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Prix transparents Lyon</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("services")}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="link-services"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("avantages")}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="link-avantages"
            >
              Avantages
            </button>
            <button
              onClick={() => scrollToSection("temoignages")}
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="link-temoignages"
            >
              Témoignages
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a href="tel:0472000000" className="hidden sm:block" data-testid="link-phone">
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                <span className="font-semibold">04 72 00 00 00</span>
              </Button>
            </a>
            <a href="tel:0472000000" className="sm:hidden" data-testid="link-phone-mobile">
              <Button size="icon" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
            </a>
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-menu-toggle"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t space-y-2" data-testid="menu-mobile">
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
              data-testid="link-services-mobile"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("avantages")}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
              data-testid="link-avantages-mobile"
            >
              Avantages
            </button>
            <button
              onClick={() => scrollToSection("temoignages")}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
              data-testid="link-temoignages-mobile"
            >
              Témoignages
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
