import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Zap, Shield, Users, Mail, ArrowRight, Check, Search, BookOpen, GitBranch, Palette } from "lucide-react";
import logoImage from "@/assets/opudoc-logo-new.png";
import { useToast } from "@/hooks/use-toast";
import { AnimatedBackground } from "./AnimatedBackground";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
export const PreSignupHero = () => {
  const [email, setEmail] = useState("");
  const [wantsNewsletter, setWantsNewsletter] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      // Sign up user with Supabase Auth (email confirmation required)
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8), // Temporary password
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            early_access: true,
            wants_newsletter: wantsNewsletter
          }
        }
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          toast({
            title: "Email already registered",
            description: "This email is already signed up for early access.",
            variant: "destructive"
          });
        } else {
          throw authError;
        }
        return;
      }

      // Save early access signup to database
      const { error: dbError } = await supabase
        .from('early_access_signups')
        .insert({
          email,
          wants_newsletter: wantsNewsletter,
          user_id: data.user?.id || null
        });

      if (dbError && !dbError.message.includes("duplicate key")) {
        console.error("Database error:", dbError);
      }

      setIsSubmitted(true);
      toast({
        title: "Confirmation email sent!",
        description: "Please check your email and confirm your signup."
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cards = containerRef.current.querySelectorAll('.spotlight-card');
    const magneticCards = containerRef.current.querySelectorAll('.magnetic-card');

    // Check if mouse is over any card
    let isOverAnyCard = false;
    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      const cardLeft = cardRect.left - containerRect.left;
      const cardTop = cardRect.top - containerRect.top;
      const cardRight = cardLeft + cardRect.width;
      const cardBottom = cardTop + cardRect.height;
      if (x >= cardLeft && x <= cardRight && y >= cardTop && y <= cardBottom) {
        isOverAnyCard = true;
      }
    });

    // Apply magnetic effect to magnetic cards
    magneticCards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      const cardLeft = cardRect.left - containerRect.left;
      const cardTop = cardRect.top - containerRect.top;
      
      // Calculate center of card
      const cardCenterX = cardLeft + cardRect.width / 2;
      const cardCenterY = cardTop + cardRect.height / 2;
      
      // Calculate distance from mouse to card center
      const distance = Math.sqrt(Math.pow(x - cardCenterX, 2) + Math.pow(y - cardCenterY, 2));
      const maxMagneticDistance = 200;
      
      if (distance <= maxMagneticDistance) {
        // Calculate magnetic pull - stronger when closer
        const magneticStrength = Math.max(0, 1 - (distance / maxMagneticDistance));
        const maxPull = 12; // Maximum pixels to move
        
        // Calculate direction vector from card center to mouse
        const deltaX = x - cardCenterX;
        const deltaY = y - cardCenterY;
        
        // Apply magnetic transform
        const pullX = (deltaX / distance) * magneticStrength * maxPull;
        const pullY = (deltaY / distance) * magneticStrength * maxPull;
        
        (card as HTMLElement).style.transform = `translate(${pullX}px, ${pullY}px)`;
      } else {
        (card as HTMLElement).style.transform = 'translate(0px, 0px)';
      }
    });

    // Only apply spotlight effects if mouse is over a card
    if (isOverAnyCard) {
      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        const cardLeft = cardRect.left - containerRect.left;
        const cardTop = cardRect.top - containerRect.top;

        // Calculate center of card
        const cardCenterX = cardLeft + cardRect.width / 2;
        const cardCenterY = cardTop + cardRect.height / 2;

        // Calculate distance from mouse to card center
        const distance = Math.sqrt(Math.pow(x - cardCenterX, 2) + Math.pow(y - cardCenterY, 2));
        const maxDistance = 300; // Increased for smoother transition

        if (distance <= maxDistance) {
          // Calculate mouse position relative to the card for the spotlight center
          const cardMouseX = (x - cardLeft) / cardRect.width * 100;
          const cardMouseY = (y - cardTop) / cardRect.height * 100;

          // Smooth easing function for opacity (cubic ease-out)
          const normalizedDistance = distance / maxDistance;
          const opacity = Math.max(0, 1 - Math.pow(normalizedDistance, 1.5));
          (card as HTMLElement).style.setProperty('--card-mouse-x', `${Math.max(-20, Math.min(120, cardMouseX))}%`);
          (card as HTMLElement).style.setProperty('--card-mouse-y', `${Math.max(-20, Math.min(120, cardMouseY))}%`);
          (card as HTMLElement).style.setProperty('--card-spotlight-opacity', opacity.toString());
        } else {
          (card as HTMLElement).style.setProperty('--card-spotlight-opacity', '0');
        }
      });
    } else {
      // Mouse is between cards, remove all spotlight effects
      cards.forEach(card => {
        (card as HTMLElement).style.setProperty('--card-spotlight-opacity', '0');
      });
    }
  };
  const handleContainerMouseLeave = () => {
    if (!containerRef.current) return;

    // Remove spotlight from all cards when mouse leaves container
    const cards = containerRef.current.querySelectorAll('.spotlight-card');
    const magneticCards = containerRef.current.querySelectorAll('.magnetic-card');
    
    cards.forEach(card => {
      (card as HTMLElement).style.setProperty('--card-spotlight-opacity', '0');
    });
    
    // Reset magnetic cards position
    magneticCards.forEach(card => {
      (card as HTMLElement).style.transform = 'translate(0px, 0px)';
    });
  };
  const features = [{
    icon: <BookOpen className="w-6 h-6" />,
    title: "Rich Content Editor",
    description: "Write beautiful docs with blocks, embeds, and interactive components"
  }, {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Version Control",
    description: "Track changes, manage revisions, and collaborate with git-like workflows"
  }, {
    icon: <Palette className="w-6 h-6" />,
    title: "Beautiful Themes",
    description: "Customize your docs with stunning themes and brand-matching designs"
  }, {
    icon: <Users className="w-6 h-6" />,
    title: "Team Spaces",
    description: "Organize knowledge with spaces, permissions, and team-based access"
  }];
  return <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground pageId="home" density="medium" style="subtle" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <img src={logoImage} alt="OpuDoc Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-foreground">OpuDoc</h1>
            </Link>
            <Badge variant="outline" className="glass-level-2 border-primary/30 text-primary">
              Coming Soon
            </Badge>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main ref={containerRef} className="spotlight-container relative z-10 container mx-auto px-6 py-16" onMouseMove={handleContainerMouseMove} onMouseLeave={handleContainerMouseLeave}>
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 spring-enter">
            <Badge className="mb-6 glass-level-2 border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
              <Zap className="w-4 h-4 mr-2" />
              The Future of Documentation
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Documentation
              <br />
              <span className="text-primary">reimagined</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              OpuDoc transforms how teams create, organize, and collaborate on documentation. 
              Experience powerful knowledge management with beautiful, intuitive workflows.
            </p>

            {/* Email Signup Form */}
            <Card className="glass-level-2 spotlight-card magnetic-card border-border/30 max-w-md mx-auto p-6 mb-12 spring-enter-delayed transition-transform duration-300 ease-out">
              {!isSubmitted ? <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col space-y-4">
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="glass-level-1 border-border/50 text-foreground placeholder:text-muted-foreground" 
                      required 
                      disabled={isLoading}
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="newsletter" 
                        checked={wantsNewsletter}
                        onCheckedChange={(checked) => setWantsNewsletter(checked as boolean)}
                        className="border-border/50"
                      />
                      <label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
                        I want to receive updates and news via email
                      </label>
                    </div>
                    
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                      <Mail className="w-5 h-5 mr-2" />
                      {isLoading ? "Sending..." : "Get Early Access"}
                      {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    By clicking "Get Early Access" you accept our{" "}
                    <Link to="/datasecurity" className="text-primary hover:underline">
                      Data Security guidelines
                    </Link>
                  </p>
                </form> : <div className="text-center space-y-3 spring-enter">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Confirmation required!</h3>
                  <p className="text-muted-foreground">
                    We've sent you a confirmation email. Click the link in the email to complete your signup.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Didn't receive an email? Check your spam folder.
                  </p>
                </div>}
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => <Card key={index} className="glass-level-2 spotlight-card p-6 spring-enter-delayed border-border/30" style={{
            animationDelay: `${0.3 + index * 0.1}s`
          }}>
                <div className="flex flex-col space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>)}
          </div>

          {/* Stats Section */}
          

          {/* Final CTA */}
          
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2025 Thael Studio. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <a href="/datasecurity" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Data Security</a>
              <a href="https://nebeo.studio" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Imprint</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};