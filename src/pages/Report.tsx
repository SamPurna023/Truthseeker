
import React from 'react';
import { 
  Shield, AlertTriangle, LockKeyhole, CheckCircle, 
  ServerCrash, UserRoundCheck 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportForm from '@/components/ReportForm';
import { Separator } from '@/components/ui/separator';
import AIFraudAnalyzer from './AIFraudAnalyzer';

const Report = () => {
  const securityFeatures = [
    {
      icon: LockKeyhole,
      title: 'End-to-End Encryption',
      description: 'All reports are encrypted and only accessible to authorized reviewers.'
    },
    {
      icon: ServerCrash,
      title: 'No Activity Logs',
      description: "We don't log IP addresses, metadata, or identifying information."
    },
    {
      icon: Shield,
      title: 'Secure Anonymous Portal',
      description: 'Use our secure portal to check for updates without revealing your identity.'
    },
    {
      icon: UserRoundCheck,
      title: 'Protected Access',
      description: 'Two-factor authentication and strict access controls for all team members.'
    },
    {
      icon: CheckCircle,
      title: 'Regular Security Audits',
      description: 'Independent security experts regularly test our systems.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <section className="py-10 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
              <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm mb-4">
                <Shield className="h-4 w-4 mr-1.5 text-primary" />
                <span>Secure & Confidential</span>
              </div>

              <AIFraudAnalyzer />
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Report Corruption Securely
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Use this secure form to report corruption or misconduct. You can submit anonymously or 
                provide contact information for secure follow-up.
              </p>
            </div>
            
            <ReportForm />
            
            <div className="max-w-3xl mx-auto mt-16">
              <div className="flex items-center space-x-2 text-amber-500 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="font-semibold text-lg">Important Safety Information</h2>
              </div>
              
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 text-sm text-foreground/90">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>If you believe you're in <strong>immediate danger</strong>, contact appropriate local authorities first.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Consider using a secure device that isn't monitored by your employer or others.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>For maximum anonymity, consider using the <strong>Tor Browser</strong> when submitting your report.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Never include information that could uniquely identify you unless you intend to be identified.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Security Information Section */}
        <section className="py-12 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
                How We Protect Your Security
              </h2>
              
              <div className="space-y-6">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-8" />
              
              <div className="text-sm text-muted-foreground text-center">
                <p>
                  TruthSeeker Haven is committed to maintaining the highest standards of security and confidentiality. 
                  We work with security experts to continuously improve our protection measures and safeguard whistleblowers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Report;
