import { useEffect, useCallback } from 'react';

export interface KeyboardShortcutActions {
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  onDuplicate?: () => void;
  onEscape?: () => void;
  onSave?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
}

export const useKeyboardShortcuts = (actions: KeyboardShortcutActions, enabled = true) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Only allow Escape in input fields
      if (e.key === 'Escape' && actions.onEscape) {
        e.preventDefault();
        actions.onEscape();
      }
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    // Copy: Cmd/Ctrl + C
    if (modifier && e.key === 'c' && !e.shiftKey) {
      e.preventDefault();
      actions.onCopy?.();
      return;
    }

    // Paste: Cmd/Ctrl + V
    if (modifier && e.key === 'v' && !e.shiftKey) {
      e.preventDefault();
      actions.onPaste?.();
      return;
    }

    // Delete: Backspace or Delete
    if ((e.key === 'Backspace' || e.key === 'Delete') && !modifier) {
      e.preventDefault();
      actions.onDelete?.();
      return;
    }

    // Undo: Cmd/Ctrl + Z
    if (modifier && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      actions.onUndo?.();
      return;
    }

    // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
    if (modifier && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
      e.preventDefault();
      actions.onRedo?.();
      return;
    }

    // Select All: Cmd/Ctrl + A
    if (modifier && e.key === 'a') {
      e.preventDefault();
      actions.onSelectAll?.();
      return;
    }

    // Duplicate: Cmd/Ctrl + D
    if (modifier && e.key === 'd') {
      e.preventDefault();
      actions.onDuplicate?.();
      return;
    }

    // Save: Cmd/Ctrl + S
    if (modifier && e.key === 's') {
      e.preventDefault();
      actions.onSave?.();
      return;
    }

    // Bring to Front: Cmd/Ctrl + ]
    if (modifier && e.key === ']') {
      e.preventDefault();
      actions.onBringToFront?.();
      return;
    }

    // Send to Back: Cmd/Ctrl + [
    if (modifier && e.key === '[') {
      e.preventDefault();
      actions.onSendToBack?.();
      return;
    }

    // Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      actions.onEscape?.();
      return;
    }
  }, [actions, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Shortcut display helper
export const getShortcutDisplay = (shortcut: string): string => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  return shortcut
    .replace('Cmd', isMac ? '⌘' : 'Ctrl')
    .replace('Ctrl', isMac ? '⌘' : 'Ctrl')
    .replace('Shift', '⇧')
    .replace('Alt', isMac ? '⌥' : 'Alt')
    .replace('Delete', '⌫')
    .replace('Backspace', '⌫');
};

export const shortcuts = [
  { action: 'Copy', keys: 'Cmd+C' },
  { action: 'Paste', keys: 'Cmd+V' },
  { action: 'Delete', keys: 'Backspace' },
  { action: 'Undo', keys: 'Cmd+Z' },
  { action: 'Redo', keys: 'Cmd+Shift+Z' },
  { action: 'Select All', keys: 'Cmd+A' },
  { action: 'Duplicate', keys: 'Cmd+D' },
  { action: 'Save', keys: 'Cmd+S' },
  { action: 'Bring to Front', keys: 'Cmd+]' },
  { action: 'Send to Back', keys: 'Cmd+[' },
  { action: 'Deselect', keys: 'Escape' },
];
