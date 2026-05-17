"use client";

import React, { useState } from "react";
import { Clause } from "@/types";
import { RiskBadge } from "./RiskBadge";
import { ChevronDown, ChevronUp, MessageSquare, AlertCircle, Lightbulb } from "lucide-react";

interface ClauseCardProps {
  clause: Clause;
}

export function ClauseCard({ clause }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden transition-all hover:bg-slate-800/60">
      {/* Header */}
      <div 
        className="p-5 cursor-pointer flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg font-semibold text-white">{clause.title}</h3>
            <RiskBadge level={clause.riskLevel} />
            {clause.riskCategories.map((cat) => (
              <span key={cat} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">
                {cat}
              </span>
            ))}
          </div>
          <p className="text-slate-400 text-sm line-clamp-2">
            {clause.plainLanguageExplanation}
          </p>
        </div>
        <button className="text-slate-400 hover:text-white p-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-5 pt-0 border-t border-slate-700/50 mt-2 bg-slate-800/20">
          <div className="space-y-6 mt-4">
            {/* Plain Language Explanation */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                What it means
              </h4>
              <p className="text-slate-200 leading-relaxed text-sm">
                {clause.plainLanguageExplanation}
              </p>
            </div>

            {/* Why It's Risky */}
            {(clause.riskLevel === 'HIGH' || clause.riskLevel === 'CRITICAL' || clause.riskLevel === 'MEDIUM') && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  Why it's risky
                </h4>
                <p className="text-slate-200 leading-relaxed text-sm">
                  {clause.whyItsRisky}
                </p>
              </div>
            )}

            {/* Recommendation */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-green-400" />
                Recommendation
              </h4>
              <p className="text-slate-200 leading-relaxed text-sm">
                {clause.recommendation}
              </p>
            </div>

            {/* Original Text */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Original Text
              </h4>
              <p className="text-slate-400 text-xs font-mono leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                {clause.originalText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
