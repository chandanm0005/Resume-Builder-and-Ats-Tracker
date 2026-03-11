import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, CheckSquare } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-white/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono font-bold text-xl tracking-tight ai-gradient-text">
            ResumeAI
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/builder">
            <Button
              variant={location === "/builder" ? "secondary" : "ghost"}
              className="gap-2 text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              Resume Builder
            </Button>
          </Link>
          <Link href="/screener">
            <Button
              variant={location === "/screener" ? "secondary" : "ghost"}
              className="gap-2 text-sm font-medium"
            >
              <CheckSquare className="w-4 h-4" />
              ATS Screener
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
