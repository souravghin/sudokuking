
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// DialogTrigger and HelpCircle are removed as it's now opened programmatically

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TutorialDialog({ open, onOpenChange }: TutorialDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* DialogTrigger is removed. This dialog is controlled by parent state. */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play Sudoku King</DialogTitle>
          <DialogDescription>
            A quick guide to get you started.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <p><strong>Goal:</strong> Fill the 9x9 grid so that each column, each row, and each of the nine 3x3 subgrids contain all of the digits from 1 to 9.</p>
          <p><strong>Controls:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click a cell to select it.</li>
            <li>Use your keyboard or the on-screen number pad to enter numbers.</li>
            <li><strong>Pen Mode:</strong> Enter final answers.</li>
            <li><strong>Pencil Mode (P):</strong> Toggle to enter small candidate numbers (pencil marks) in empty cells.</li>
            <li><strong>Clear (Backspace/Delete):</strong> Erase the selected cell's content.</li>
            <li><strong>Hint (H):</strong> Reveals a correct number. Limited uses based on difficulty & settings.</li>
            <li><strong>Auto-Check (V):</strong> Toggles real-time validation. Incorrect entries will be highlighted if on.</li>
            <li><strong>Undo (Ctrl+Z) / Redo (Ctrl+Y):</strong> Step back or forward through your moves (if enabled).</li>
          </ul>
          <p>Check the User Profile menu and Settings (cog icon) for more ways to customize your game!</p>
          <p>Enjoy your moment of Zen!</p>
        </div>
        <DialogFooter>
            {/* The explicit close button can be kept, or rely on the X icon and outside click */}
            <Button type="button" onClick={() => onOpenChange(false)}> 
              Got it!
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
