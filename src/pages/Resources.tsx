
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, BookOpen, FileText, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResourceCard from '@/components/ResourceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Sample resources data
const RESOURCES_DATA = [
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
  },
  {
    id: 'resource-4',
    title: 'Corruption in Public Infrastructure: Recognizing the Signs',
    description: 'How to identify red flags in public infrastructure projects that may indicate corruption or misuse of funds.',
    type: 'guide' as const,
    readTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    categories: ['Public Sector', 'Infrastructure'],
    link: '/resources/public-infrastructure-corruption',
    isBookmarked: false
  },
  {
    id: 'resource-5',
    title: 'Digital Security for Whistleblowers',
    description: 'Essential digital security practices to protect your identity and communications when reporting wrongdoing.',
    type: 'article' as const,
    readTime: 9,
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    categories: ['Security', 'Digital', 'Protection'],
    link: '/resources/digital-security',
    isBookmarked: false
  },
  {
    id: 'resource-6',
    title: 'The Psychology of Corruption',
    description: 'Understanding the psychological factors that contribute to corrupt behavior in organizations and governments.',
    type: 'video' as const,
    readTime: 18,
    imageUrl: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86',
    categories: ['Psychology', 'Research'],
    link: '/resources/psychology-corruption',
    isBookmarked: false
  },
  {
    id: 'resource-7',
    title: "Corruption's Impact on Economic Development",
    description: 'How corruption undermines economic growth, increases inequality, and hinders sustainable development.',
    type: 'case-study' as const,
    readTime: 14,
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
    categories: ['Economics', 'Development', 'Impact'],
    link: '/resources/corruption-economic-impact',
    isBookmarked: false
  },
  {
    id: 'resource-8',
    title: 'Whistleblower Interview: Taking a Stand Against Healthcare Fraud',
    description: 'An anonymous interview with a whistleblower who exposed systematic Medicare fraud at a major hospital chain.',
    type: 'video' as const,
    readTime: 22,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
    categories: ['Healthcare', 'Interviews', 'Fraud'],
    link: '/resources/healthcare-whistleblower-interview',
    isBookmarked: false
  },
  {
    id: 'resource-9',
    title: 'Anti-Corruption Laws Around the World',
    description: 'A comparative analysis of anti-corruption legislation across different countries and jurisdictions.',
    type: 'article' as const,
    readTime: 16,
    imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad',
    categories: ['Legal', 'International', 'Legislation'],
    link: '/resources/global-anticorruption-laws',
    isBookmarked: false
  },
  {
    id: 'resource-10',
    title: 'Corporate Whistleblowing Policies: Best Practices',
    description: 'How organizations can create effective whistleblowing policies that encourage reporting and protect employees.',
    type: 'guide' as const,
    readTime: 11,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    categories: ['Corporate', 'Policy', 'Best Practices'],
    link: '/resources/corporate-whistleblowing-policies',
    isBookmarked: false
  }
];

type CategoryFilter = 'All' | 'Legal' | 'Security' | 'Impact' | 'Evidence' | 'Public Sector' | 'Digital' | 'Psychology' | 'Economics' | 'Healthcare' | 'Corporate';
type TypeFilter = 'all' | 'article' | 'guide' | 'video' | 'case-study' | 'infographic';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TypeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({
    'resource-2': true
  });
  
  const resourcesPerPage = 6;

  // Handle bookmark toggle
  const handleBookmarkToggle = (id: string) => {
    setBookmarked(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter resources based on search, tab, and category
  const filteredResources = RESOURCES_DATA.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeTab === 'all' || resource.type === activeTab;
    
    const matchesCategory = categoryFilter === 'All' || 
      resource.categories.some(cat => cat === categoryFilter);
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Pagination logic
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
    setCategoryFilter('All');
    setCurrentPage(1);
  };

  // Extract all unique categories from resources
  const allCategories = ['All', ...Array.from(new Set(
    RESOURCES_DATA.flatMap(resource => resource.categories)
  ))].sort() as CategoryFilter[];

  const typeIcons = {
    article: <FileText className="h-4 w-4" />,
    guide: <BookOpen className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    'case-study': <FileText className="h-4 w-4" />,
    infographic: <FileText className="h-4 w-4" />
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <section className="py-10">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Educational Resources
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Learn about corruption, its impacts, and how whistleblowers can make a difference
                </p>
              </div>
              
              <div className="relative mb-8">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-7 w-7 p-0 rounded-full"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => {
                  setActiveTab(v as TypeFilter);
                  setCurrentPage(1);
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-background/50">
                      <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        All Types
                      </TabsTrigger>
                      <TabsTrigger value="article" className="gap-1.5">
                        {typeIcons.article} Articles
                      </TabsTrigger>
                      <TabsTrigger value="guide" className="gap-1.5">
                        {typeIcons.guide} Guides
                      </TabsTrigger>
                      <TabsTrigger value="video" className="gap-1.5">
                        {typeIcons.video} Videos
                      </TabsTrigger>
                      <TabsTrigger value="case-study" className="gap-1.5">
                        {typeIcons["case-study"]} Case Studies
                      </TabsTrigger>
                    </TabsList>
                    
                    {(searchQuery || activeTab !== 'all' || categoryFilter !== 'All') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-8 text-xs gap-1.5"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Reset Filters
                      </Button>
                    )}
                  </div>
                </Tabs>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
                    <span className="text-sm font-medium whitespace-nowrap">Category:</span>
                    {allCategories.map((category) => (
                      <Badge
                        key={category}
                        variant={categoryFilter === category ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer whitespace-nowrap",
                          categoryFilter === category ? "bg-primary" : "hover:bg-secondary"
                        )}
                        onClick={() => {
                          setCategoryFilter(category);
                          setCurrentPage(1);
                        }}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Active filters display */}
                  {(searchQuery || activeTab !== 'all' || categoryFilter !== 'All') && (
                    <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>Active filters:</span>
                      
                      {searchQuery && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          Search: {searchQuery}
                        </Badge>
                      )}
                      
                      {activeTab !== 'all' && (
                        <Badge variant="secondary" className="gap-1 text-xs capitalize">
                          Type: {activeTab}
                        </Badge>
                      )}
                      
                      {categoryFilter !== 'All' && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          Category: {categoryFilter}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                  Showing {filteredResources.length} resources
                </div>
                
                <Separator />
                
                {/* Resources grid */}
                {currentResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentResources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        {...resource}
                        isBookmarked={!!bookmarked[resource.id]}
                        onBookmarkToggle={() => handleBookmarkToggle(resource.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-lg font-medium mb-2">No resources found</p>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                    >
                      Reset all filters
                    </Button>
                  </div>
                )}
                
                {/* Pagination */}
                {filteredResources.length > resourcesPerPage && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNumber = i + 1;
                          // Show current page, first page, last page, and pages immediately before and after current
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={pageNumber}
                                variant={currentPage === pageNumber ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  "h-8 w-8 mx-1",
                                  currentPage === pageNumber && "pointer-events-none"
                                )}
                                onClick={() => paginate(pageNumber)}
                              >
                                {pageNumber}
                              </Button>
                            );
                          }
                          
                          // Show ellipsis for page gaps
                          if (
                            (pageNumber === 2 && currentPage > 3) ||
                            (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                          ) {
                            return <span key={pageNumber} className="mx-1">…</span>;
                          }
                          
                          return null;
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;

// Define local X component for icon
const X = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
