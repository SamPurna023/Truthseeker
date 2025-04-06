
import React from 'react';
import { ArrowRight, Shield, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Custom animation components to replace framer-motion
const AnimatedDiv = ({ 
  children, 
  className,
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => {
  return (
    <div 
      className={`animate-fade-in ${className || ''}`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 max-w-3xl mx-auto">
          <AnimatedDiv className="space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none bg-secondary text-foreground mb-4">
              <span>Securely report corruption & misconduct</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Speak truth to power, 
              <span className="text-primary"> safely & anonymously</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-[700px] mx-auto text-balance">
              TruthSeeker Haven provides a secure platform for whistleblowers to report 
              corruption and track the progress of investigations while maintaining anonymity.
            </p>
          </AnimatedDiv>
          
          <AnimatedDiv 
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
            delay={200}
          >
            <Button asChild size="lg" className="gap-2 text-base">
              <Link to="/report">
                Report Corruption <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 text-base">
              <Link to="/resources">
                Learn More
              </Link>
            </Button>
          </AnimatedDiv>
          
          <AnimatedDiv 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-6"
            delay={400}
          >
            {[
              {
                icon: Shield,
                title: "Secure & Anonymous",
                description: "Advanced encryption and no tracking. Your identity stays protected."
              },
              {
                icon: Eye,
                title: "Full Transparency",
                description: "Track investigations and outcomes while maintaining anonymity."
              },
              {
                icon: FileText,
                title: "Impact Reporting",
                description: "See how reports lead to real-world accountability and change."
              }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
