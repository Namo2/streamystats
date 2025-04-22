"use client";

import {MoreHorizontal, TrendingUp} from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GenreStat } from "@/lib/db";
import { cn, formatDuration } from "@/lib/utils";
import { extend } from "lodash";
import * as React from "react";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

const chartConfig = {
  total_duration: {
    label: "Total_duration",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: GenreStat[];
}

export const GenreStatsGraph: React.FC<Props> = ({
  data,
  className,
  ...props
}) => {
  const [formattedData, setFormattedData] = React.useState(data
      .map((x, i) => ({
        ...x,
        isActive: i < 5
      }))
  );

  const dropdownElements = React.useMemo(() => formattedData.map((x, idx) => (
      <DropdownMenuCheckboxItem key={idx} checked={x.isActive} onSelect={(event) => {
          debugger
          const newData = [...formattedData];
          const updatedElement = newData.at(idx);
          if (updatedElement) {
              updatedElement.isActive = !updatedElement.isActive;
              setFormattedData([...newData]);
          }
          event?.preventDefault();
      }}>{x.genre}</DropdownMenuCheckboxItem>
  )), [formattedData]);

  const displayData = React.useMemo(() => formattedData.filter(x => x.isActive), [formattedData]);

  return (
    <Card {...props} className={cn("", className)}>
      <CardHeader className="items-center pb-4">
          <CardTitle>Most Watched Genres</CardTitle>
        {/* <CardDescription>Showing most watched genres</CardDescription> */}
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[250px]">
          <RadarChart data={displayData}>
            <ChartTooltip
              formatter={(val) => (
                <div>
                  <p>{formatDuration(Number(val))}</p>
                </div>
              )}
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <PolarAngleAxis dataKey="genre" />
            <PolarGrid />
            <Radar
              dataKey="total_duration"
              fill="var(--color-total_duration)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>

        <div className="float-right top-0 position-relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Active Genres</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {dropdownElements}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </Card>
  );
};
