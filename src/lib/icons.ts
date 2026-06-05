import { 
  MessageCircle, 
  Hash, 
  Palette, 
  HelpCircle, 
  MapPin, 
  User, 
  ShoppingCart,
  Calendar,
  Users,
  Utensils,
  Activity,
  Heart,
  Car,
  Home,
  Star,
  Briefcase,
  CloudSun,
  Building,
  Smartphone,
  Smile,
  Shirt,
  LucideIcon
} from 'lucide-react';

export const getCategoryIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case 'MessageCircle': return MessageCircle;
    case 'Hash': return Hash;
    case 'Palette': return Palette;
    case 'HelpCircle': return HelpCircle;
    case 'MapPin': return MapPin;
    case 'User': return User;
    case 'ShoppingCart': return ShoppingCart;
    case 'Calendar': return Calendar;
    case 'Users': return Users;
    case 'Utensils': return Utensils;
    case 'Activity': return Activity;
    case 'Heart': return Heart;
    case 'Car': return Car;
    case 'Home': return Home;
    case 'Star': return Star;
    case 'Briefcase': return Briefcase;
    case 'CloudSun': return CloudSun;
    case 'Building': return Building;
    case 'Smartphone': return Smartphone;
    case 'Smile': return Smile;
    case 'Shirt': return Shirt;
    default: return MessageCircle;
  }
};
