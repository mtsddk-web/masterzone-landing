import {
  Users,
  CalendarCheck,
  MessageCircle,
  Target,
  GraduationCap,
  Mic,
  Trophy,
  Handshake,
  Library,
  Check,
  CheckCircle,
  RefreshCw,
  Clock,
  Wallet,
  Building2,
  Star,
  Sparkles,
  Mail,
  AlertTriangle,
  Gift,
  Info,
  X,
  LucideProps,
} from "lucide-react";
import { ComponentType } from "react";

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Users,
  CalendarCheck,
  MessageCircle,
  Target,
  GraduationCap,
  Mic,
  Trophy,
  Handshake,
  Library,
  Check,
  CheckCircle,
  RefreshCw,
  Clock,
  Wallet,
  Building2,
  Star,
  Sparkles,
  Mail,
  AlertTriangle,
  Gift,
  Info,
  X,
};

interface IconProps extends LucideProps {
  name: string;
}

export default function Icon({ name, ...props }: IconProps) {
  const Component = iconMap[name];
  if (!Component) return null;
  return <Component {...props} />;
}
