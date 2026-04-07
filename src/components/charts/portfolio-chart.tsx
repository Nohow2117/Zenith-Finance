"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PortfolioChartProps {
  className?: string;
}

const CHART_DATA = [
  { month: "Jul", value: 210000 },
  { month: "Aug", value: 225000 },
  { month: "Sep", value: 218000 },
  { month: "Oct", value: 242000 },
  { month: "Nov", value: 258000 },
  { month: "Dec", value: 252000 },
  { month: "Jan", value: 268000 },
  { month: "Feb", value: 275000 },
  { month: "Mar", value: 282000 },
  { month: "Apr", value: 294000 },
];

export function PortfolioChart({ className = "" }: PortfolioChartProps) {
  return (
    <div className={`w-full h-[300px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D395" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00D395" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8A919E", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8A919E", fontSize: 12 }}
            tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1F2E",
              border: "1px solid #252A37",
              borderRadius: "12px",
              color: "#FFFFFF",
              fontSize: "13px",
            }}
            formatter={(value) => [`€${Number(value).toLocaleString()}`, "Portfolio Value"]}
            labelStyle={{ color: "#8A919E" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00D395"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
