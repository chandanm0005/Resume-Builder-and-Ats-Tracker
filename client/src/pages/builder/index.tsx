import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Upload, FileText, AlertCircle, CheckCircle2, Plus, Trash2, Download } from "lucide-react";
import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function BuilderPage() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic experiences state
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Corp",
      description: "• Developed a web application using React and Node.js\n• Improved database queries\n• Worked with team to deliver features",
      showSuggestions: false
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Platform",
      technologies: "React, Node.js, MongoDB",
      description: "• Built a full-stack e-commerce platform with stripe integration",
    }
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      school: "University of Technology",
      degree: "B.S. Computer Science",
      year: "2018 - 2022"
    }
  ]);

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Analyzing Resume",
        description: "Extracting skills and experience from your PDF...",
      });
      
      setTimeout(() => {
        toast({
          title: "Import Complete",
          description: "Successfully populated your experience and skills.",
        });
        setExperiences([
          {
            id: Date.now(),
            title: "Senior Developer",
            company: "Innovate Inc",
            description: "• Led migration to microservices\n• Managed a team of 5 engineers",
            showSuggestions: false
          },
          ...experiences
        ]);
      }, 1500);
    }
  };

  // --- Experience Handlers ---
  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now(), title: "", company: "", description: "", showSuggestions: false }]);
  };
  const removeExperience = (id: number) => setExperiences(experiences.filter(exp => exp.id !== id));
  const updateExperience = (id: number, field: string, value: string) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };
  const toggleSuggestions = (id: number) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, showSuggestions: !exp.showSuggestions } : { ...exp, showSuggestions: false }));
  };
  const applySuggestion = (id: number, oldText: string, newText: string) => {
    setExperiences(experiences.map(exp => {
      if (exp.id === id) return { ...exp, description: exp.description.replace(oldText, newText), showSuggestions: false };
      return exp;
    }));
  };

  // --- Project Handlers ---
  const addProject = () => setProjects([...projects, { id: Date.now(), title: "", technologies: "", description: "" }]);
  const removeProject = (id: number) => setProjects(projects.filter(p => p.id !== id));
  const updateProject = (id: number, field: string, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // --- Education Handlers ---
  const addEducation = () => setEducation([...education, { id: Date.now(), school: "", degree: "", year: "" }]);
  const removeEducation = (id: number) => setEducation(education.filter(e => e.id !== id));
  const updateEducation = (id: number, field: string, value: string) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleExport = () => {
    toast({
      title: "Exporting Resume",
      description: "Generating your ATS-optimized PDF...",
    });
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-mono tracking-tight">Resume Builder</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={step >= 1 ? "text-primary font-medium" : ""}>1. Job Description</span>
              <span className="w-8 h-px bg-border"></span>
              <span className={step >= 2 ? "text-primary font-medium" : ""}>2. Content</span>
              <span className="w-8 h-px bg-border"></span>
              <span className={step >= 3 ? "text-primary font-medium" : ""}>3. Export</span>
            </div>
          </div>

          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-panel border-white/10 col-span-2 md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TargetIcon className="w-5 h-5 text-primary" />
                    Target Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the job description here. Our AI will extract key requirements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jd">Job Description</Label>
                    <Textarea 
                      id="jd" 
                      placeholder="Paste the full job description here..." 
                      className="min-h-[300px] font-mono text-sm bg-background/50 border-white/10"
                    />
                  </div>
                  <Button className="w-full gap-2" onClick={simulateAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Analyzing Requirements...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Extract Keywords & Skills
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="glass-panel border-white/10 opacity-50 grayscale pointer-events-none transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Extracted Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
                      <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {step >= 2 && (
             <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
               <div className="lg:col-span-2 space-y-6">
                 <Tabs defaultValue="experience" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-background/50 border border-white/5">
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                      <TabsTrigger value="education">Education</TabsTrigger>
                    </TabsList>
                    
                    {/* Info Tab */}
                    <TabsContent value="info" className="mt-6 space-y-6">
                      <Card className="glass-panel border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg">Personal Information</CardTitle>
                          <CardDescription>Basic contact details for the header of your resume.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input defaultValue="John Doe" className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input defaultValue="john@example.com" type="email" className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input defaultValue="(555) 123-4567" className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                              <Label>Location</Label>
                              <Input defaultValue="San Francisco, CA" className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                              <Label>LinkedIn</Label>
                              <Input defaultValue="linkedin.com/in/johndoe" className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                              <Label>GitHub / Portfolio</Label>
                              <Input defaultValue="github.com/johndoe" className="bg-background/50" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Experience Tab */}
                    <TabsContent value="experience" className="mt-6 space-y-6">
                      <Card className="glass-panel border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">Work Experience</CardTitle>
                            <CardDescription>Add your roles and let AI optimize the bullet points.</CardDescription>
                          </div>
                          <div>
                            <input 
                              type="file" 
                              accept=".pdf,.docx" 
                              className="hidden" 
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                            />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="w-4 h-4" /> Import from PDF
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          
                          {experiences.map((exp) => (
                            <div key={exp.id} className="space-y-4 p-4 rounded-xl bg-background/50 border border-white/5 relative group transition-all">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeExperience(exp.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Job Title</Label>
                                  <Input 
                                    value={exp.title} 
                                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                    placeholder="e.g. Software Engineer"
                                    className="bg-background/50" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Company</Label>
                                  <Input 
                                    value={exp.company} 
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    placeholder="e.g. Tech Corp"
                                    className="bg-background/50" 
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Description & Achievements</Label>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`h-7 text-xs gap-1 transition-colors ${exp.showSuggestions ? 'bg-primary/20 text-primary' : 'text-primary'}`}
                                    onClick={() => toggleSuggestions(exp.id)}
                                  >
                                    <Sparkles className="w-3 h-3" /> Optimize with AI
                                  </Button>
                                </div>
                                <Textarea 
                                  className="min-h-[120px] font-mono text-sm leading-relaxed"
                                  value={exp.description}
                                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                  placeholder="• Describe your responsibilities and achievements..."
                                />
                              </div>
                              
                              {exp.showSuggestions && (
                                <div className="p-4 mt-2 rounded-xl border border-primary/30 bg-primary/5 shadow-inner animate-in fade-in zoom-in-95">
                                  <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm">
                                    <Sparkles className="w-4 h-4" /> Suggested Improvements
                                  </div>
                                  <div className="space-y-3">
                                    <div 
                                      className="text-xs p-3 rounded-lg bg-background/80 border border-primary/20 cursor-pointer hover:border-primary/50 transition-colors"
                                      onClick={() => applySuggestion(exp.id, "Developed a web application", "Architected a scalable full-stack application using React and Node.js, serving 10k+ monthly users")}
                                    >
                                      <p className="text-muted-foreground mb-1">Click to apply this rewrite:</p>
                                      <span className="text-red-400 line-through mr-2">Developed a web app</span>
                                      <br/>
                                      <span className="text-green-400">Architected a scalable full-stack application using React and Node.js, serving 10k+ monthly users</span>
                                    </div>
                                    <div 
                                      className="text-xs p-3 rounded-lg bg-background/80 border border-primary/20 cursor-pointer hover:border-primary/50 transition-colors"
                                      onClick={() => applySuggestion(exp.id, "Improved database queries", "Optimized complex PostgreSQL queries, reducing API latency by 40%")}
                                    >
                                      <span className="text-red-400 line-through mr-2">Improved database queries</span>
                                      <br/>
                                      <span className="text-green-400">Optimized complex PostgreSQL queries, reducing API latency by 40%</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          <Button 
                            variant="outline" 
                            className="w-full border-dashed gap-2"
                            onClick={addExperience}
                          >
                            <Plus className="w-4 h-4" /> Add Experience
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Projects Tab */}
                    <TabsContent value="projects" className="mt-6 space-y-6">
                       <Card className="glass-panel border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg">Projects</CardTitle>
                          <CardDescription>Showcase your portfolio pieces relevant to the job.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {projects.map((proj) => (
                            <div key={proj.id} className="space-y-4 p-4 rounded-xl bg-background/50 border border-white/5 relative group transition-all">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeProject(proj.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Project Title</Label>
                                  <Input 
                                    value={proj.title} 
                                    onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                                    className="bg-background/50" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Technologies Used</Label>
                                  <Input 
                                    value={proj.technologies} 
                                    onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                                    className="bg-background/50" 
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea 
                                  className="min-h-[80px] font-mono text-sm leading-relaxed"
                                  value={proj.description}
                                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" className="w-full border-dashed gap-2" onClick={addProject}>
                            <Plus className="w-4 h-4" /> Add Project
                          </Button>
                        </CardContent>
                       </Card>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education" className="mt-6 space-y-6">
                      <Card className="glass-panel border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg">Education</CardTitle>
                          <CardDescription>List your degrees and certifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {education.map((edu) => (
                            <div key={edu.id} className="space-y-4 p-4 rounded-xl bg-background/50 border border-white/5 relative group transition-all">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeEducation(edu.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>School / University</Label>
                                  <Input 
                                    value={edu.school} 
                                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                    className="bg-background/50" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Degree / Certificate</Label>
                                  <Input 
                                    value={edu.degree} 
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    className="bg-background/50" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Year / Timeline</Label>
                                  <Input 
                                    value={edu.year} 
                                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                    className="bg-background/50" 
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" className="w-full border-dashed gap-2" onClick={addEducation}>
                            <Plus className="w-4 h-4" /> Add Education
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                 </Tabs>
               </div>

               <div className="space-y-6">
                 {/* JD Context Sidebar */}
                 <Card className="glass-panel border-white/10 sticky top-24">
                   <CardHeader className="pb-4">
                     <CardTitle className="text-sm font-medium flex items-center justify-between">
                       JD Match Status
                       <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Score: 68%</span>
                     </CardTitle>
                     <Progress value={68} className="h-1.5 mt-2 bg-secondary" />
                   </CardHeader>
                   <CardContent className="space-y-6">
                     <div>
                       <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Required Skills</h4>
                       <div className="flex flex-wrap gap-2">
                         <Badge variant="default" className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                           React.js <CheckCircle2 className="w-3 h-3 ml-1" />
                         </Badge>
                         <Badge variant="default" className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                           Node.js <CheckCircle2 className="w-3 h-3 ml-1" />
                         </Badge>
                         <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">
                           PostgreSQL <AlertCircle className="w-3 h-3 ml-1" />
                         </Badge>
                         <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">
                           Docker <AlertCircle className="w-3 h-3 ml-1" />
                         </Badge>
                         <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">
                           AWS <AlertCircle className="w-3 h-3 ml-1" />
                         </Badge>
                       </div>
                     </div>

                     <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <BotIcon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            <strong className="text-foreground block mb-1">AI Suggestion:</strong>
                            You are missing <span className="text-primary">Docker</span> and <span className="text-primary">AWS</span>. Consider adding a project where you containerized and deployed an application.
                          </div>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-white/10">
                        <Button className="w-full gap-2" onClick={handleExport}>
                          <Download className="w-4 h-4" />
                          Export PDF
                        </Button>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
}

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
}

function Badge({ children, className, variant = "default" }: any) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>
}
