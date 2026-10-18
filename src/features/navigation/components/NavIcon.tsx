import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Calendar, 
  Sparkles, 
  ClipboardList, 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Zap, 
  Award, 
  Clock, 
  FileText, 
  Star, 
  Pin,
  Bookmark,
  MessageSquare,
  Scissors,
  CheckCircle2,
  Folder
} from 'lucide-react';

interface NavIconProps {
  name: string;
  className?: string;
}

export function NavIcon({ name, className }: NavIconProps) {
  switch (name) {
    case 'LayoutDashboard':
      return <LayoutDashboard className={className} />;
    case 'CalendarCheck':
      return <CalendarCheck className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'MessageSquare':
      return <MessageSquare className={className} />;
    case 'ClipboardList':
      return <ClipboardList className={className} />;
    case 'User':
      return <User className={className} />;
    case 'Settings':
      return <Settings className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'Pin':
      return <Pin className={className} />;
    case 'Bookmark':
      return <Bookmark className={className} />;
    case 'Scissors':
      return <Scissors className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    default:
      return <Folder className={className} />;
  }
}
