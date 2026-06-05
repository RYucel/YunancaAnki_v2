import { 
  MessageCircle, 
  Hash, 
  Palette, 
  HelpCircle, 
  MapPin, 
  User, 
  ShoppingCart,
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
    default: return MessageCircle;
  }
};
