import { useCallback, useEffect } from 'react';

export interface HistoryEntry<T> {
  id: string;
  timestamp: number;
  label: string;
  state: T;
}

export interface HistoryState<T> {
  past: HistoryEntry<T>[];
  present: T;
  future: HistoryEntry<T>[];
}

const MAX_HISTORY_SIZE = 50;

export const createHistoryEntry = <T>(state: T, label: string): HistoryEntry<T> => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  timestamp: Date.now(),
  label,
  state,
});

export const useKeyboardShortcuts = (
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
};

export const pushToHistory = <T>(
  history: HistoryState<T>,
  newState: T,
  label: string
): HistoryState<T> => {
  const entry = createHistoryEntry(history.present, label);
  const newPast = [...history.past, entry].slice(-MAX_HISTORY_SIZE);
  
  return {
    past: newPast,
    present: newState,
    future: [],
  };
};

export const undoHistory = <T>(history: HistoryState<T>): HistoryState<T> | null => {
  if (history.past.length === 0) return null;
  
  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, -1);
  const futureEntry = createHistoryEntry(history.present, 'Redo point');
  
  return {
    past: newPast,
    present: previous.state,
    future: [futureEntry, ...history.future],
  };
};

export const redoHistory = <T>(history: HistoryState<T>): HistoryState<T> | null => {
  if (history.future.length === 0) return null;
  
  const next = history.future[0];
  const newFuture = history.future.slice(1);
  const pastEntry = createHistoryEntry(history.present, 'Undo point');
  
  return {
    past: [...history.past, pastEntry],
    present: next.state,
    future: newFuture,
  };
};

export const jumpToHistory = <T>(
  history: HistoryState<T>,
  entryId: string
): HistoryState<T> | null => {
  const pastIndex = history.past.findIndex(e => e.id === entryId);
  
  if (pastIndex !== -1) {
    const targetEntry = history.past[pastIndex];
    const newPast = history.past.slice(0, pastIndex);
    const skippedEntries = history.past.slice(pastIndex + 1);
    const currentEntry = createHistoryEntry(history.present, 'Current state');
    
    return {
      past: newPast,
      present: targetEntry.state,
      future: [...skippedEntries, currentEntry, ...history.future],
    };
  }
  
  return null;
};
