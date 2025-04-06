
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Eye, ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CaseStatus = 'new' | 'investigating' | 'in-progress' | 'resolved' | 'closed';

interface CaseCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  status: CaseStatus;
  votes: number;
  comments: number;
  views: number;
  progress?: number;
  updates?: {
    date: string;
    content: string;
  }[];
}

const CaseCard: React.FC<CaseCardProps> = ({
  id,
  title,
  description,
  category,
  location,
  date,
  status,
  votes,
  comments,
  views,
  progress = 0,
  updates = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [voteCount, setVoteCount] = useState(votes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (direction: 'up' | 'down') => {
    if (userVote === direction) {
      // User is canceling their vote
      setVoteCount(direction === 'up' ? voteCount - 1 : voteCount + 1);
      setUserVote(null);
    } else if (userVote === null) {
      // User is voting for the first time
      setVoteCount(direction === 'up' ? voteCount + 1 : voteCount - 1);
      setUserVote(direction);
    } else {
      // User is changing their vote
      setVoteCount(direction === 'up' ? voteCount + 2 : voteCount - 2);
      setUserVote(direction);
    }
  };

  const getStatusLabel = (status: CaseStatus) => {
    switch (status) {
      case 'new': return 'New';
      case 'investigating': return 'Investigating';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const getStatusClass = (status: CaseStatus) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'investigating': return 'status-investigating';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  return (
    <div className={cn(
      "rounded-xl border bg-card shadow-sm transition-all duration-300 overflow-hidden hover-scale",
      expanded && "scale-100 border-primary/20 shadow-md"
    )}>
      <div className="flex">
        {/* Vote buttons column */}
        <div className="flex flex-col items-center px-3 py-4 bg-secondary/50">
          <button
            className={cn(
              "vote-button upvote",
              userVote === 'up' && "active"
            )}
            onClick={() => handleVote('up')}
            aria-label="Upvote"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          
          <span className={cn(
            "font-medium text-sm my-1",
            userVote === 'up' && "text-vote-up",
            userVote === 'down' && "text-vote-down"
          )}>
            {voteCount}
          </span>
          
          <button
            className={cn(
              "vote-button downvote",
              userVote === 'down' && "active"
            )}
            onClick={() => handleVote('down')}
            aria-label="Downvote"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Main content column */}
        <div className="flex-1 p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    {category}
                  </Badge>
                  <span className={cn(
                    "status-badge",
                    getStatusClass(status)
                  )}>
                    {getStatusLabel(status)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg leading-tight hover:text-primary/90 cursor-pointer transition-colors">
                  {title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 ml-2"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{date}</span>
              </div>
              {location && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{views} views</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                <span>{comments} comments</span>
              </div>
            </div>
            
            <p className={cn(
              "text-sm text-foreground/80 line-clamp-2 transition-all duration-300",
              expanded && "line-clamp-none"
            )}>
              {description}
            </p>
            
            {expanded && (
              <div className="pt-4 space-y-4 animate-fade-in-quick">
                {progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Investigation Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </div>
                )}
                
                {updates.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Recent Updates</h4>
                    <div className="space-y-3">
                      {updates.map((update, index) => (
                        <div key={index} className="text-sm space-y-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{update.date}</span>
                          </div>
                          <p className="text-foreground/90">{update.content}</p>
                          {index < updates.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    <MessageSquare className="h-3 w-3 mr-1.5" />
                    Add Comment
                  </Button>
                  <Button size="sm" variant="default" className="text-xs h-8">
                    View Full Case
                    <ArrowUpRight className="h-3 w-3 ml-1.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
