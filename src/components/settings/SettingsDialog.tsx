
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
// Accordion is no longer needed if "Game Play Preferences" is the only main section
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { 
  Timer, Eye, CheckCircle, TrendingUp, Lightbulb, Zap, BarChart2 as BarChartIcon, Settings as CogIcon
} from "lucide-react"; 

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const appSettings = useAppSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Settings</DialogTitle>
          <DialogDescription>
            Customize your Sudoku King experience.
          </DialogDescription>
        </DialogHeader>
        
        {/* Game Play Preferences are now direct content */}
        <div className="space-y-4 py-4 px-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-timer" className="flex items-center gap-2"><Timer className="w-5 h-5" /> Show Timer</Label>
            <Switch id="enable-timer" checked={appSettings.enableTimer} onCheckedChange={appSettings.setEnableTimer} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-mistake-limit" className="flex items-center gap-2"><CogIcon className="w-5 h-5" /> Enable Mistake Limit</Label>
            <Switch id="enable-mistake-limit" checked={appSettings.enableMistakeLimit} onCheckedChange={appSettings.setEnableMistakeLimit} />
          </div>
          {appSettings.enableMistakeLimit && (
            <div>
              <Label htmlFor="mistake-limit">Mistake Limit Value</Label>
              <Input
                id="mistake-limit"
                type="number"
                value={appSettings.mistakeLimitValue}
                onChange={(e) => appSettings.setMistakeLimitValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
                min="1"
                className="mt-1"
              />
               <p className="text-xs text-muted-foreground mt-1">Set the maximum number of mistakes allowed.</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="highlight-peers" className="flex items-center gap-2"><Eye className="w-5 h-5" /> Highlight Peers</Label>
            <Switch id="highlight-peers" checked={appSettings.highlightPeers} onCheckedChange={appSettings.setHighlightPeers} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="highlight-same-numbers" className="flex items-center gap-2"><Eye className="w-5 h-5" /> Highlight Same Numbers</Label>
            <Switch id="highlight-same-numbers" checked={appSettings.highlightSameNumbers} onCheckedChange={appSettings.setHighlightSameNumbers} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-remove-notes" className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Auto Remove Notes</Label>
            <Switch id="auto-remove-notes" checked={appSettings.autoRemoveNotes} onCheckedChange={appSettings.setAutoRemoveNotes} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-complete-cells" className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Auto Complete Cells</Label>
            <Switch id="auto-complete-cells" checked={appSettings.autoCompleteCells} onCheckedChange={appSettings.setAutoCompleteCells} />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="show-completion-rate" className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Show Completion Rate</Label>
            <Switch id="show-completion-rate" checked={appSettings.showPuzzleCompletionRate} onCheckedChange={appSettings.setShowPuzzleCompletionRate} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-score" className="flex items-center gap-2"><BarChartIcon className="w-5 h-5" /> Show Score</Label>
            <Switch id="show-score" checked={appSettings.showScore} onCheckedChange={appSettings.setShowScore} />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="animated-score" className="flex items-center gap-2"><Zap className="w-5 h-5" /> Animated Score</Label>
            <Switch id="animated-score" checked={appSettings.useAnimatedScore} onCheckedChange={appSettings.setUseAnimatedScore} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="lightning-mode" className="flex items-center gap-2"><Zap className="w-5 h-5" /> Lightning Mode</Label>
            <Switch id="lightning-mode" checked={appSettings.lightningMode} onCheckedChange={appSettings.setLightningMode} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-remaining-numbers" className="flex items-center gap-2"><Eye className="w-5 h-5" /> Show Remaining Numbers</Label>
            <Switch id="show-remaining-numbers" checked={appSettings.showRemainingNumbers} onCheckedChange={appSettings.setShowRemainingNumbers} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-smart-hints" className="flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Enable Smart Hints</Label>
            <Switch id="enable-smart-hints" checked={appSettings.enableSmartHints} onCheckedChange={appSettings.setEnableSmartHints} />
          </div>
        </div>
        
        {/* Removed Notifications AccordionItem */}
        {/* Removed Visuals & Theme AccordionItem (as per previous request, if it was still there) */}
        {/* Removed Account, Sensory Feedback, Support & Info AccordionItems */}

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
