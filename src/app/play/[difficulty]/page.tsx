
import { SudokuGame } from '@/components/sudoku/SudokuGame';
import type { Difficulty as DifficultyKey } from '@/config/constants';
import { DIFFICULTIES } from '@/config/constants';
import { redirect } from 'next/navigation';

interface PlayPageProps {
  params: {
    difficulty: string;
  };
}

export default function PlayPage({ params }: PlayPageProps) {
  const difficultyKey = params.difficulty.toUpperCase() as DifficultyKey;

  if (!DIFFICULTIES[difficultyKey]) {
    // Invalid difficulty, redirect to home or show an error
    // For now, redirect to home
    redirect('/');
  }

  return (
    // Use flex-1 to take available vertical space, pt-2 and pb-2 for minimal padding
    <div className="flex flex-1 flex-col items-center w-full pt-2 pb-2">
      <SudokuGame difficulty={difficultyKey} />
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(DIFFICULTIES).map((key) => ({
    difficulty: key.toLowerCase(),
  }));
}
