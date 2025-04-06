
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, TrendingUp, Users, ArrowRight, MessageSquare, 
  ChevronRight, Calendar, Award, Shield, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeroSection from '@/components/HeroSection';
import CaseCard from '@/components/CaseCard';
import ResourceCard from '@/components/ResourceCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const Index = () => {
  const [featuredTab, setFeaturedTab] = useState('recent');

  // Sample data for demonstration
  const recentCases = [
    {
      id: 'case-1',
      title: 'Environmental Violations at Northern Mining Corporation',
      description: 'Report detailing toxic waste dumping in protected watershed areas, affecting local communities and wildlife.',
      category: 'Environmental',
      location: 'Montana, USA',
      date: 'Oct 15, 2023',
      status: 'investigating' as const,
      votes: 128,
      comments: 32,
      views: 1542,
      progress: 40,
      updates: [
        {
          date: 'Nov 10, 2023',
          content: 'Environmental Protection Agency has launched a formal investigation based on the evidence provided.'
        },
        {
          date: 'Oct 25, 2023',
          content: 'Initial assessment completed. Evidence suggests possible violations of the Clean Water Act.'
        }
      ]
    },
    {
      id: 'case-2',
      title: 'Public Fund Misappropriation in City Development Project',
      description: 'Evidence of kickbacks and inflated contracts in the Downtown Revitalization Project, potentially costing taxpayers millions.',
      category: 'Financial Fraud',
      location: 'Chicago, IL',
      date: 'Sep 29, 2023',
      status: 'new' as const,
      votes: 87,
      comments: 19,
      views: 763,
      progress: 15,
      updates: [
        {
          date: 'Oct 5, 2023',
          content: 'Review team has started preliminary assessment of the submitted documents and financial records.'
        }
      ]
    },
    {
      id: 'case-3',
      title: 'Healthcare Insurance Fraud Scheme',
      description: 'Systematic billing for services never rendered to patients at multiple clinics under the same management company.',
      category: 'Healthcare',
      location: 'Florida, USA',
      date: 'Oct 3, 2023',
      status: 'in-progress' as const,
      votes: 215,
      comments: 47,
      views: 2103,
      progress: 65,
      updates: [
        {
          date: 'Oct 28, 2023',
          content: 'Investigation team has partnered with insurance company auditors to analyze billing patterns.'
        },
        {
          date: 'Oct 12, 2023',
          content: 'Additional evidence from former employees has been acquired to support the initial report.'
        }
      ]
    }
  ];

  const popularCases = [
    {
      id: 'case-4',
      title: 'Government Contract Bidding Irregularities',
      description: 'Evidence suggesting predetermined winners in supposedly competitive government contract bidding processes.',
      category: 'Corruption',
      location: 'Washington, DC',
      date: 'Aug 15, 2023',
      status: 'resolved' as const,
      votes: 512,
      comments: 98,
      views: 7856,
      progress: 100,
      updates: [
        {
          date: 'Oct 20, 2023',
          content: 'Case resolved with two officials removed from office and bidding process reforms implemented.'
        },
        {
          date: 'Sep 15, 2023',
          content: 'Investigation confirmed allegations. Internal audit expanded to all departments.'
        }
      ]
    },
    {
      id: 'case-5',
      title: 'Workplace Safety Violations Leading to Injuries',
      description: 'Manufacturing facility ignoring safety protocols and falsifying safety inspection records after serious worker injuries.',
      category: 'Safety',
      location: 'Detroit, MI',
      date: 'Sep 5, 2023',
      status: 'in-progress' as const,
      votes: 347,
      comments: 64,
      views: 3912,
      progress: 75,
      updates: [
        {
          date: 'Oct 18, 2023',
          content: 'OSHA has conducted surprise inspections and confirmed multiple violations. Penalties pending.'
        }
      ]
    },
    {
      id: 'case-3',
      title: 'Healthcare Insurance Fraud Scheme',
      description: 'Systematic billing for services never rendered to patients at multiple clinics under the same management company.',
      category: 'Healthcare',
      location: 'Florida, USA',
      date: 'Oct 3, 2023',
      status: 'in-progress' as const,
      votes: 215,
      comments: 47,
      views: 2103,
      progress: 65,
      updates: [
        {
          date: 'Oct 28, 2023',
          content: 'Investigation team has partnered with insurance company auditors to analyze billing patterns.'
        },
        {
          date: 'Oct 12, 2023',
          content: 'Additional evidence from former employees has been acquired to support the initial report.'
        }
      ]
    }
  ];

  const featuredResources = [
    {
      id: 'resource-1',
      title: 'Understanding Whistleblower Protections',
      description: 'A comprehensive guide to the legal protections available to whistleblowers across different jurisdictions.',
      type: 'guide' as const,
      readTime: 12,
      imageUrl: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c',
      categories: ['Legal', 'Protection'],
      link: '/resources/whistleblower-protections',
      isBookmarked: false
    },
    {
      id: 'resource-2',
      title: 'How to Document Corruption: Evidence Collection Best Practices',
      description: 'Learn how to safely gather and preserve evidence of corruption while protecting yourself.',
      type: 'article' as const,
      readTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
      categories: ['Security', 'Evidence'],
      link: '/resources/evidence-collection',
      isBookmarked: true
    },
    {
      id: 'resource-3',
      title: 'The Impact of Whistleblowing: Success Stories',
      description: 'Real-world examples of how whistleblowers have changed industries and saved lives through their courage.',
      type: 'case-study' as const,
      readTime: 15,
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      categories: ['Impact', 'Case Studies'],
      link: '/resources/whistleblower-impact',
      isBookmarked: false
    }
  ];

  const stats = [
    { label: 'Reports Submitted', value: '2,847+', icon: FileText, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Success Rate', value: '73%', icon: TrendingUp, color: 'bg-green-500/10 text-green-500' },
    { label: 'Whistleblowers Supported', value: '1,500+', icon: Users, color: 'bg-amber-500/10 text-amber-500' },
    { label: 'Active Investigations', value: '189', icon: Eye, color: 'bg-purple-500/10 text-purple-500' },
  ];

  const impact = [
    {
      title: 'Financial Fraud Exposed',
      description: 'A whistleblower report led to the uncovering of a $42M investment scheme, returning funds to victims.',
      date: 'October 2023',
      icon: Award
    },
    {
      title: 'Environmental Protection',
      description: 'Illegal toxic dumping was halted after a report provided crucial evidence of violations.',
      date: 'August 2023',
      icon: Shield
    },
    {
      title: 'Public Safety Improved',
      description: 'Safety protocols were overhauled at 3 facilities after reports of corners being cut.',
      date: 'September 2023',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <HeroSection />
        
        {/* Featured Cases Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  Featured Cases
                </h2>
                <p className="text-muted-foreground">
                  Browse recent and popular corruption reports and their ongoing investigations
                </p>
              </div>
              
              <Button asChild variant="outline" className="mt-4 md:mt-0">
                <Link to="/cases" className="gap-2">
                  View All Cases <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <Tabs 
              defaultValue="recent" 
              value={featuredTab}
              onValueChange={setFeaturedTab}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <TabsList className="bg-background/50">
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="recent" className="space-y-6 mt-0">
                {recentCases.map((caseItem) => (
                  <CaseCard 
                    key={caseItem.id}
                    {...caseItem}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="popular" className="space-y-6 mt-0">
                {popularCases.map((caseItem) => (
                  <CaseCard 
                    key={caseItem.id}
                    {...caseItem}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                Our Impact
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                TruthSeeker has helped whistleblowers around the world make a difference
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 rounded-xl glass-card">
                  <div className={cn(
                    "w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4",
                    stat.color
                  )}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="font-bold text-2xl md:text-3xl mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {impact.map((item, index) => (
                <div key={index} className="border rounded-xl p-6 shadow-sm hover-scale">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        <span>{item.date}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Educational Resources Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  Educational Resources
                </h2>
                <p className="text-muted-foreground">
                  Learn about corruption, its impacts, and how whistleblowers can make a difference
                </p>
              </div>
              
              <Button asChild variant="outline" className="mt-4 md:mt-0">
                <Link to="/resources" className="gap-2">
                  View All Resources <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <ResourceCard 
                  key={resource.id}
                  {...resource}
                  onBookmarkToggle={() => console.log(`Toggle bookmark for ${resource.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
              
              <div className="relative p-8 md:p-12 lg:p-16 text-center md:text-left">
                <div className="max-w-2xl mx-auto md:mx-0">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                    Ready to report corruption?
                  </h2>
                  <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                    Your voice matters. Securely and anonymously report corruption and help create a more transparent world.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button asChild size="lg" variant="secondary" className="gap-2 text-base">
                      <Link to="/report">
                        Report Corruption <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="gap-2 text-base bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                      <Link to="/cases">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Browse Cases
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
