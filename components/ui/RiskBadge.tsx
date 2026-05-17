import React from "react";
import { RiskLevel } from "@/types";
import { ShieldCheck, Info, AlertTriangle, AlertOctagon, XOctagon } from "lucide-react";

const RISK_CONFIG = {
  SAFE: {
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: ShieldCheck,
    label: "Safe",
  },
  LOW: {
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: Info,
    label: "Low Risk",
  },
  MEDIUM: {
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: AlertTriangle,
    label: "Medium Risk",
  },
  HIGH: {
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    icon: AlertOctagon,
    label: "High Risk",
  },
  CRITICAL: {
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XOctagon,
    label: "Critical Risk",
  },
};

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

export function RiskBadge({ level, className = "", showIcon = true }: RiskBadgeProps) {
  const config = RISK_CONFIG[level] || RISK_CONFIG.MEDIUM;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}
