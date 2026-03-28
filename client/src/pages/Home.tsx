import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Target, Zap, Bot, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 ai-gradient-bg">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-4">
          <SparkleIcon className="w-4 h-4" />
          <span>Next-Gen ATS Optimization Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Beat the <span className="ai-gradient-text">Bots</span>.<br/> Land the <span className="ai-gradient-text">Interview</span>.
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Our AI-powered platform analyzes your resume against job descriptions, identifying missing skills and generating high-impact, ATS-optimized bullet points.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/builder">
            <Button size="lg" className="gap-2 h-14 px-8 text-lg w-full sm:w-auto shadow-[0_0_40px_rgba(139,92,246,0.3)]">
              Build Optimized Resume
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/screener">
            <Button size="lg" variant="secondary" className="gap-2 h-14 px-8 text-lg w-full sm:w-auto border border-white/5">
              Screen Existing Resume
              <Target className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto px-4 w-full">
        <FeatureCard 
          icon={<Bot className="w-8 h-8 text-primary" />}
          title="Smart Skill Matching"
          description="NLP algorithms extract key skills from job descriptions and compare them against your profile."
        />
        <FeatureCard 
          icon={<Zap className="w-8 h-8 text-accent" />}
          title="AI Bullet Generator"
          description="Transform weak experience points into powerful, action-driven statements that get noticed."
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
          title="ATS Score Prediction"
          description="Get an accurate prediction of how your resume will perform in major Applicant Tracking Systems."
        />
      </div>
    </div>
  );
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-all duration-300 floating-card">
      <div className="p-3 bg-background/50 rounded-xl border border-white/5">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
