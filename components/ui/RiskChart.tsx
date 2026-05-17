"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RiskChartProps {
  distribution: {
    privacy: number;
    financial: number;
    employment: number;
    ip: number;
    compliance: number;
    ambiguity: number;
  };
}

const COLORS = {
  Privacy: "#8b5cf6", // purple
  Financial: "#10b981", // emerald
  Employment: "#3b82f6", // blue
  IP: "#f59e0b", // amber
  Compliance: "#ef4444", // red
  Ambiguity: "#6366f1", // indigo
};

export function RiskChart({ distribution }: RiskChartProps) {
  const data = [
    { name: "Privacy", value: distribution.privacy },
    { name: "Financial", value: distribution.financial },
    { name: "Employment", value: distribution.employment },
    { name: "IP", value: distribution.ip },
    { name: "Compliance", value: distribution.compliance },
    { name: "Ambiguity", value: distribution.ambiguity },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            width={80}
          />
          <Tooltip 
            cursor={{ fill: '#334155', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
