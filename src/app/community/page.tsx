
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function CommunityPage() {
  return (
    // Added container mx-auto and padding here for this specific page
    <div className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Users className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Sudoku King Community</CardTitle>
          <CardDescription>
            Connect with fellow Sudoku enthusiasts.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Community features are under development!
          </p>
          <p className="mt-2 text-sm">
            Soon you'll be able to share puzzles, discuss strategies,
            and participate in challenges.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
