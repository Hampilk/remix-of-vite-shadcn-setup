import { shortcuts, getShortcutDisplay } from '@/hooks/useKeyboardShortcuts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

export const ShortcutsHelp = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 text-slate-400 hover:text-slate-200">
          <Keyboard className="h-3.5 w-3.5" />
          <span className="text-xs">Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-amber-400" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to work faster with the designer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {shortcuts.map(({ action, keys }) => (
            <div 
              key={action}
              className="flex items-center justify-between px-3 py-2 bg-neutral-800/50 rounded-lg"
            >
              <span className="text-sm text-slate-300">{action}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-neutral-700 rounded text-slate-300">
                {getShortcutDisplay(keys)}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
