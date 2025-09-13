"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

export const description = "An interactive area chart";

const dummyEnrollmentData = [
  { date: "2025-05-01", enrollments: 12 },
  { date: "2025-05-02", enrollments: 12 },
  { date: "2025-05-03", enrollments: 13 },
  { date: "2025-05-04", enrollments: 14 },
  { date: "2025-05-05", enrollments: 65 },
  { date: "2025-05-06", enrollments: 26 },
  { date: "2025-05-07", enrollments: 55 },
  { date: "2025-05-08", enrollments: 56 },
  { date: "2025-05-09", enrollments: 35 },
  { date: "2025-05-10", enrollments: 53 },
  { date: "2025-05-11", enrollments: 46 },
  { date: "2025-05-12", enrollments: 53 },
  { date: "2025-05-13", enrollments: 15 },
  { date: "2025-05-14", enrollments: 51 },
  { date: "2025-05-15", enrollments: 57 },
  { date: "2025-05-16", enrollments: 47 },
  { date: "2025-05-17", enrollments: 37 },
  { date: "2025-05-18", enrollments: 64 },
  { date: "2025-05-19", enrollments: 52 },
  { date: "2025-05-20", enrollments: 15 },
  { date: "2025-05-21", enrollments: 31 },
  { date: "2025-05-22", enrollments: 51 },
  { date: "2025-05-23", enrollments: 21 },
  { date: "2025-05-24", enrollments: 60 },
  { date: "2025-05-25", enrollments: 50 },
  { date: "2025-05-26", enrollments: 32 },
  { date: "2025-05-27", enrollments: 40 },
  { date: "2025-05-28", enrollments: 30 },
  { date: "2025-05-29", enrollments: 19 },
  { date: "2025-05-30", enrollments: 11 },
];

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: {
    date: string;
    enrollments: number;
  }[];
}
export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollmentsNumber = useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollment for the last 30 days: {totalEnrollmentsNumber}
          </span>

          <span className="@[540px]/card:hidden">
            Last 30 days: {totalEnrollmentsNumber}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <BarChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />

            <Bar dataKey={"enrollments"} fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
