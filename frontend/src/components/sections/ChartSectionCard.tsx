"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="text-sm text-muted-foreground">{description}</div>
      </CardHeader>
      <CardContent className="min-w-0">{children}</CardContent>
    </Card>
  );
}
