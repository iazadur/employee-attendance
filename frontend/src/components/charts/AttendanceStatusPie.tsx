"use client";

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--muted-foreground))",
];

export function AttendanceStatusPie(props: {
  summary: Record<string, number> | undefined;
}) {
  const entries = Object.entries(props.summary ?? {})
    .filter(([, v]) => typeof v === "number" && v > 0)
    .map(([name, value]) => ({ name, value }));

  if (!entries.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No data
      </div>
    );
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={entries}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {entries.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

