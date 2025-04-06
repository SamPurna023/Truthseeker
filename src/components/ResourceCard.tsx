
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Bookmark, BookOpen, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ResourceType = 'article' | 'guide' | 'video' | 'case-study' | 'infographic';

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  readTime?: number;
  imageUrl?: string;
  categories: string[];
  link: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  description,
  type,
  readTime,
  imageUrl,
  categories,
  link,
  isBookmarked = false,
  onBookmarkToggle,
}) => {
  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'guide': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'video': return <Video className="h-4 w-4 text-red-500" />;
      case 'case-study': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'infographic': return <FileText className="h-4 w-4 text-orange-500" />;
    }
  };
  
  const getReadTimeLabel = (minutes: number) => {
    if (minutes < 1) return 'Quick read';
    if (minutes === 1) return '1 minute read';
    return `${minutes} minute read`;
  };

  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-xl bg-card border shadow-sm hover-scale">
      {imageUrl && (
        <div className="relative w-full h-40 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button
            onClick={onBookmarkToggle}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-foreground hover:bg-white transition-colors"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark className={cn(
              "h-4 w-4 transition-colors",
              isBookmarked ? "fill-primary text-primary" : "fill-none text-foreground"
            )} />
          </button>
        </div>
      )}
      
      <div className="flex flex-col flex-grow p-4 space-y-3">
        <div className="flex items-center space-x-2">
          {categories.map((category, index) => (
            <Badge key={index} variant="secondary" className="text-xs font-normal">
              {category}
            </Badge>
          ))}
        </div>
        
        <Link to={link} className="space-y-1 hover:text-primary/90 transition-colors">
          <h3 className="font-semibold text-lg leading-tight">{title}</h3>
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
          {description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <div className="flex items-center">
              {getTypeIcon(type)}
              <span className="ml-1 capitalize">{type}</span>
            </div>
            {readTime && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{getReadTimeLabel(readTime)}</span>
              </div>
            )}
          </div>
          
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 -mr-2">
            <Link to={link} className="flex items-center gap-1">
              <span className="text-xs">Read</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
