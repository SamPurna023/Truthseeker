import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowDown, ArrowUp, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseCard from '@/components/CaseCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase, Case } from '@/lib/supabase';
import { toast } from 'sonner';

type SortOption = 'newest' | 'oldest' | 'most-votes' | 'most-views';
type StatusFilter = 'new' | 'investigating' | 'in-progress' | 'resolved' | 'closed' | 'all';
type CategoryFilter = 'all' | 'Environmental' | 'Financial Fraud' | 'Healthcare' | 'Corruption' | 'Safety' | 'Bribery';

const Cases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 5;

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort the cases
  const filteredCases = cases.filter(caseItem => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || caseItem.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    // Sort based on selected option
    switch (sortOption) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'most-votes':
        return b.votes - a.votes;
      case 'most-views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortOption('newest');
    setStatusFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <section className="py-10">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Corruption Reports
                  </h1>
                  <p className="text-muted-foreground">
                    Browse and track ongoing investigations and outcomes
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  
                  <select
                    className="flex h-9 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="most-votes">Most Votes</option>
                    <option value="most-views">Most Views</option>
                  </select>
                </div>
              </div>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by keyword, location, or category..."
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
              
              {/* Filters */}
              {showFilters && (
                <div className="mb-6 animate-fade-in-quick">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-8 text-xs gap-1.5"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Reset
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="flex flex-wrap gap-2">
                          {['all', 'new', 'investigating', 'in-progress', 'resolved', 'closed'].map((status) => (
                            <Badge
                              key={status}
                              variant={statusFilter === status ? "default" : "outline"}
                              className={cn(
                                "cursor-pointer capitalize",
                                statusFilter === status ? "bg-primary" : "hover:bg-secondary"
                              )}
                              onClick={() => setStatusFilter(status as StatusFilter)}
                            >
                              {status === 'all' ? 'All Statuses' : status.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Category</Label>
                        <div className="flex flex-wrap gap-2">
                          {['all', 'Environmental', 'Financial Fraud', 'Healthcare', 'Corruption', 'Safety', 'Bribery'].map((category) => (
                            <Badge
                              key={category}
                              variant={categoryFilter === category ? "default" : "outline"}
                              className={cn(
                                "cursor-pointer",
                                categoryFilter === category ? "bg-primary" : "hover:bg-secondary"
                              )}
                              onClick={() => setCategoryFilter(category as CategoryFilter)}
                            >
                              {category === 'all' ? 'All Categories' : category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Active filters display */}
              {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      Search: {searchQuery}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-1 text-xs capitalize">
                      Status: {statusFilter.replace('-', ' ')}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusFilter('all')}
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  {categoryFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      Category: {categoryFilter}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCategoryFilter('all')}
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-7 text-xs underline text-muted-foreground hover:text-foreground hover:bg-transparent"
                  >
                    Clear all
                  </Button>
                </div>
              )}
              
              {/* Results count and sort display */}
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-6">
                <p>Showing {filteredCases.length} results</p>
                <p className="flex items-center">
                  Sorted by: 
                  <span className="font-medium text-foreground ml-1 flex items-center">
                    {sortOption === 'newest' ? 'Newest' : 
                     sortOption === 'oldest' ? 'Oldest' : 
                     sortOption === 'most-votes' ? 'Most Votes' : 'Most Views'}
                    {sortOption === 'newest' || sortOption === 'most-votes' || sortOption === 'most-views' ? 
                      <ArrowDown className="h-3 w-3 ml-1" /> : 
                      <ArrowUp className="h-3 w-3 ml-1" />
                    }
                  </span>
                </p>
              </div>
              
              {/* Cases list */}
              {currentCases.length > 0 ? (
                <div className="space-y-6">
                  {currentCases.map((caseItem) => (
                    <CaseCard 
                      key={caseItem.id}
                      {...caseItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-lg font-medium mb-2">No cases found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    Reset all filters
                  </Button>
                </div>
              )}
              
              {/* Pagination */}
              {filteredCases.length > casesPerPage && (
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
              
              {/* Check status form */}
              <div className="mt-12 p-6 border rounded-lg bg-secondary/50">
                <h2 className="text-xl font-semibold mb-3">Check Your Report Status</h2>
                <p className="text-muted-foreground mb-4">
                  Enter your tracking code to check the status of a report you've submitted
                </p>
                
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter tracking code (e.g., WB-12345-XY)"
                    className="flex-1"
                  />
                  <Button>Check Status</Button>
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

export default Cases;

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
