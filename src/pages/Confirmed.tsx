import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, ArrowRight, AlertCircle } from "lucide-react";
import logoImage from "@/assets/opudoc-logo-new.png";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Link } from "react-router-dom";

export default function Confirmed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the current session to check if user is confirmed
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setStatus('error');
          return;
        }

        if (session?.user) {
          setUserEmail(session.user.email || '');
          
          // Update the early access signup record
          const { error: updateError } = await supabase
            .from('early_access_signups')
            .update({ 
              confirmed_at: new Date().toISOString(),
              user_id: session.user.id 
            })
            .eq('email', session.user.email);

          if (updateError) {
            console.error('Update error:', updateError);
          }

          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
      }
    };

    handleEmailConfirmation();
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground pageId="confirmed" density="low" style="subtle" />
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
      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <Card className="glass-level-2 border-border/30 p-8 text-center spring-enter">
            {status === 'loading' && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Confirming your email...</h2>
                <p className="text-muted-foreground">
                  We're processing your email confirmation.
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Email confirmed!</h2>
                  <p className="text-muted-foreground">
                    Welcome to OpuDoc Early Access, {userEmail}!
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    You're now officially registered for early access. We'll send you an email as soon as OpuDoc is available.
                  </p>
                  <Button onClick={handleBackToHome} className="w-full" size="lg">
                    Back to Homepage
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Confirmation failed</h2>
                  <p className="text-muted-foreground">
                    There was a problem confirming your email address.
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    The confirmation link may have expired or is invalid. Please try signing up again.
                  </p>
                  <Button onClick={handleBackToHome} variant="outline" className="w-full" size="lg">
                    Back to Homepage
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}