import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function FeatureCard({
  title,
  desc,
  icon,
  badge,
  metric,
}: {
  title: string;
  desc: string;
  icon?: React.ReactNode;
  badge?: string;
  metric?: { label: string; value: string | number; percent?: number };
}) {
  return (
    <Card className="hover:shadow-xl transition-shadow p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--brand-50)] flex items-center justify-center text-[color:var(--primary)]">
            {icon}
          </div>
        </div>

        <div className="flex-1">
          <CardHeader className="p-0">
            <div className="flex items-center gap-3">
              <CardTitle className="text-sm font-semibold leading-tight p-0 m-0 text-[color:var(--primary)]">
                {title}
              </CardTitle>
              {badge && (
                <span className="text-[10px] rounded-full px-2 py-1 bg-[color:var(--brand-100)] text-[color:var(--brand-600)] font-medium">
                  {badge}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 mt-2">
            <p className="text-sm text-[color:var(--muted-foreground)]">
              {desc}
            </p>

            {metric && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-[color:var(--muted-foreground)]">
                  <span>{metric.label}</span>
                  <span className="font-medium text-[color:var(--primary)]">
                    {metric.value}
                  </span>
                </div>

                {typeof metric.percent === "number" && (
                  <div className="mt-2 h-2 bg-[color:var(--brand-50)] rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-[color:var(--primary)]"
                      style={{ width: `${metric.percent}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
