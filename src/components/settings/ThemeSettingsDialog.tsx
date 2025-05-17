
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
import { useTheme, type Theme } from "@/contexts/ThemeContext";
import { Moon, Sun, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";

interface ThemeSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeSettingsDialog({ open, onOpenChange }: ThemeSettingsDialogProps) {
  const {
    theme,
    toggleTheme,
    lightThemeBackground,
    darkThemeBackground,
    setLightThemeBackground,
    setDarkThemeBackground,
    clearLightThemeBackground,
    clearDarkThemeBackground,
  } = useTheme();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    targetTheme: Theme
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Please select an image under 5MB.");
        event.target.value = ""; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (targetTheme === 'light') {
          setLightThemeBackground(base64String);
        } else {
          setDarkThemeBackground(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
          <DialogDescription>
            Customize the application's appearance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="flex items-center gap-2">
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              Current Theme: {theme === 'light' ? 'Light' : 'Dark'}
            </Label>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              aria-label="Toggle theme"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Light Theme Background</h3>
            {lightThemeBackground && (
              <div className="my-2 p-2 border rounded-md relative">
                <Image src={lightThemeBackground} alt="Light theme background preview" width={100} height={60} className="rounded object-cover" />
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={clearLightThemeBackground} aria-label="Clear light theme background">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                id="light-bg-upload"
                type="file"
                accept="image/png, image/jpeg, image/gif, image/webp"
                onChange={(e) => handleFileChange(e, 'light')}
                className="text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
             <p className="text-xs text-muted-foreground">Upload an image for the light theme background (max 5MB).</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Dark Theme Background</h3>
            {darkThemeBackground && (
               <div className="my-2 p-2 border rounded-md relative">
                <Image src={darkThemeBackground} alt="Dark theme background preview" width={100} height={60} className="rounded object-cover" />
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={clearDarkThemeBackground} aria-label="Clear dark theme background">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
             <div className="flex items-center gap-2">
              <Input
                id="dark-bg-upload"
                type="file"
                accept="image/png, image/jpeg, image/gif, image/webp"
                onChange={(e) => handleFileChange(e, 'dark')}
                 className="text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            <p className="text-xs text-muted-foreground">Upload an image for the dark theme background (max 5MB).</p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
