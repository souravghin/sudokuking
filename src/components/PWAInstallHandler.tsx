
"use client";
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast'; // For user feedback

export default function PWAInstallHandler() {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => { // Register SW after page load
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
            toast({ 
              title: "App Ready for Offline Use", 
              description: "Sudoku King can now be played offline after first load." 
            });
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
            toast({ 
              title: "Offline Mode Error", 
              description: "Could not enable all offline features.", 
              variant: "destructive" 
            });
          });
      });
    }
  }, [toast]); 

  return null; // This component doesn't render anything
}
