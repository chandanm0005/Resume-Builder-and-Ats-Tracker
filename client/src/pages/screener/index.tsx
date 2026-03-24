import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, BarChart, ChevronRight, AlertTriangle, CheckCircle2, Zap, Check, ExternalLink } from "lucide-react";
import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function ScreenerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast({
        title: "Resume Uploaded",
        description: `${file.name} has been successfully loaded.`,
      });
    }
  };

  const handleAnalyze = () => {
    if (!fileName) {
      toast({
        title: "Missing Resume",
        description: "Please upload your resume before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(true);
      toast({
        title: "Analysis Complete",
        description: "Your ATS score has been calculated.",
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-mono tracking-tight">ATS Screener</h1>
              <p className="text-muted-foreground mt-2">Evaluate your resume against a specific job description.</p>
            </div>
          </div>

          {!results ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Resume */}
              <Card className="glass-panel border-white/10 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Your Resume
                  </CardTitle>
                  <CardDescription>Upload your current resume in PDF or DOCX format</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <div 
                    className={`border-2 border-dashed ${fileName ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:bg-white/5 hover:border-primary/50'} rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group h-full`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className={`w-16 h-16 rounded-full ${fileName ? 'bg-primary/20' : 'bg-primary/10'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {fileName ? <Check className="w-8 h-8 text-primary" /> : <Upload className="w-8 h-8 text-primary" />}
                    </div>
                    <h3 className="font-medium text-lg mb-1">{fileName ? "File Uploaded" : "Upload Resume"}</h3>
                    <p className="text-sm text-muted-foreground mb-4 break-all">{fileName || "PDF or DOCX (Max 5MB)"}</p>
                    <Button variant={fileName ? "default" : "secondary"} size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                      {fileName ? "Change File" : "Browse Files"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Paste JD */}
              <Card className="glass-panel border-white/10 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-accent" />
                    Job Description
                  </CardTitle>
                  <CardDescription>Paste the target job description here</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <Textarea 
                    placeholder="Paste the job description here..." 
                    className="h-full min-h-[250px] font-mono text-sm bg-background/50 border-white/10 resize-none"
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gap-2 h-12 text-md font-medium" 
                    onClick={handleAnalyze}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Running ATS Simulation...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Calculate ATS Score
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Top Score Section */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="glass-panel border-white/10 lg:col-span-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">Overall Match Score</h3>
                    <div className="text-7xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-4">
                      {Math.floor(Math.random() * (92 - 60 + 1) + 60)}<span className="text-4xl text-white/40">%</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium border border-yellow-500/20">
                      <AlertTriangle className="w-4 h-4" />
                      Needs Optimization
                    </div>
                  </div>
                </Card>

                <Card className="glass-panel border-white/10 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Score Breakdown</CardTitle>
                    <CardDescription>How your resume performs across key ATS metrics.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <MetricRow label="Keyword Match" score={80} weight="40%" color="bg-green-500" />
                    <MetricRow label="Skills Relevance" score={65} weight="25%" color="bg-yellow-500" />
                    <MetricRow label="Experience Alignment" score={70} weight="15%" color="bg-yellow-500" />
                    <MetricRow label="Formatting & Parsability" score={95} weight="10%" color="bg-green-500" />
                    <MetricRow label="Project Relevance" score={45} weight="10%" color="bg-red-500" />
                  </CardContent>
                </Card>
              </div>

              {/* Actionable Insights */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="glass-panel border-white/10 bg-gradient-to-br from-background to-red-950/10">
                  <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Missing Keywords & Learning Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Microservices']
                        .sort(() => 0.5 - Math.random()) // Randomize for mock data
                        .slice(0, 3)                     // Pick random 3
                        .map(skill => (
                        <div key={skill} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
                          {skill}
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-white/5 space-y-4">
                      <h4 className="font-medium text-sm">Suggested Actions & Resources:</h4>
                      
                      <div className="space-y-3">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-primary">Docker & Containerization</span>
                            <a href="https://docs.docker.com/get-started/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors">
                              Official Docs <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-xs text-muted-foreground">Consider building a small web app and containerizing it with Docker to add to your projects section.</p>
                          <div className="flex gap-2 mt-2">
                            <a href="https://www.w3schools.com/docker/index.php" target="_blank" rel="noopener noreferrer" className="text-xs bg-black/40 px-2 py-1 rounded hover:bg-white/10 transition-colors">W3Schools Docker Tutorial</a>
                          </div>
                        </div>

                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-primary">AWS Cloud Services</span>
                            <a href="https://aws.amazon.com/training/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors">
                              AWS Training <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-xs text-muted-foreground">Learn basics of EC2, S3, and RDS. Deploying a simple app on AWS can significantly boost your score.</p>
                          <div className="flex gap-2 mt-2">
                            <a href="https://www.w3schools.com/aws/index.php" target="_blank" rel="noopener noreferrer" className="text-xs bg-black/40 px-2 py-1 rounded hover:bg-white/10 transition-colors">W3Schools AWS Tutorial</a>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-primary">Kubernetes (K8s)</span>
                            <a href="https://kubernetes.io/docs/tutorials/kubernetes-basics/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors">
                              K8s Tutorials <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-xs text-muted-foreground">Once you understand Docker, learning to orchestrate those containers with K8s is a highly sought-after skill.</p>
                          <div className="flex gap-2 mt-2">
                            <a href="https://www.w3schools.com/docker/docker_kubernetes.php" target="_blank" rel="noopener noreferrer" className="text-xs bg-black/40 px-2 py-1 rounded hover:bg-white/10 transition-colors">W3Schools K8s Intro</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-white/10 bg-gradient-to-br from-background to-green-950/10">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Matched Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['Python', 'Git', 'Agile', 'React', 'Node.js', 'SQL', 'TypeScript']
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4)
                        .map(skill => (
                        <div key={skill} className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Back to start */}
              <div className="flex justify-center pt-8">
                <Button variant="outline" onClick={() => { setResults(false); setFileName(null); }}>
                  Analyze Another Resume
                </Button>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MetricRow({ label, score, weight, color }: { label: string, score: number, weight: string, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label} <span className="text-muted-foreground text-xs font-normal ml-2">Weight: {weight}</span></span>
        <span className="font-mono">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
