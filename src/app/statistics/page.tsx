
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';

export default function StatisticsPage() {
  return (
    // Added container mx-auto and padding here for this specific page
    <div className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <BarChart2 className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Game Statistics</CardTitle>
          <CardDescription>
            Track your Sudoku prowess over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Statistics feature is coming soon!
          </p>
          <p className="mt-2 text-sm">
            Here you'll be able to see your win rates, average times,
            streaks, and more, broken down by difficulty.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
