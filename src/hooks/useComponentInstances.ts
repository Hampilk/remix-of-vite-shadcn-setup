import { useState, useCallback } from 'react';
import { ComponentInstance, InstanceProps, Position } from '@/types/componentInstance';
import { getComponentById } from '@/data/componentCatalog';

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useComponentInstances = () => {
  const [instances, setInstances] = useState<ComponentInstance[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<ComponentInstance | null>(null);

  const createInstance = useCallback((componentId: string, position?: Position): ComponentInstance | null => {
    const component = getComponentById(componentId);
    if (!component) return null;

    const newInstance: ComponentInstance = {
      id: generateId(),
      componentId,
      name: `${component.name} ${instances.filter(i => i.componentId === componentId).length + 1}`,
      position: position || { x: 100 + instances.length * 20, y: 100 + instances.length * 20 },
      zIndex: instances.length + 1,
      props: {
        text: component.name,
        variant: component.variants?.[0],
        ...component.defaultProps,
      } as InstanceProps,
      effects: [],
      states: {
        default: {},
      },
      locked: false,
      visible: true,
      selectable: true,
    };

    setInstances(prev => [...prev, newInstance]);
    setSelectedIds([newInstance.id]);
    return newInstance;
  }, [instances]);

  const deleteInstance = useCallback((id: string) => {
    setInstances(prev => prev.filter(inst => inst.id !== id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  }, []);

  const deleteSelected = useCallback(() => {
    setInstances(prev => prev.filter(inst => !selectedIds.includes(inst.id)));
    setSelectedIds([]);
  }, [selectedIds]);

  const updateInstance = useCallback((id: string, updates: Partial<ComponentInstance>) => {
    setInstances(prev =>
      prev.map(inst =>
        inst.id === id ? { ...inst, ...updates } : inst
      )
    );
  }, []);

  const updateInstanceProps = useCallback((id: string, props: Partial<InstanceProps>) => {
    setInstances(prev =>
      prev.map(inst =>
        inst.id === id ? { ...inst, props: { ...inst.props, ...props } } : inst
      )
    );
  }, []);

  const updateInstancePosition = useCallback((id: string, position: Position) => {
    setInstances(prev =>
      prev.map(inst =>
        inst.id === id ? { ...inst, position } : inst
      )
    );
  }, []);

  const selectInstance = useCallback((id: string, multi = false) => {
    if (multi) {
      setSelectedIds(prev =>
        prev.includes(id)
          ? prev.filter(selectedId => selectedId !== id)
          : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(instances.map(inst => inst.id));
  }, [instances]);

  const bringToFront = useCallback((id: string) => {
    const maxZ = Math.max(...instances.map(inst => inst.zIndex), 0);
    updateInstance(id, { zIndex: maxZ + 1 });
  }, [instances, updateInstance]);

  const sendToBack = useCallback((id: string) => {
    const minZ = Math.min(...instances.map(inst => inst.zIndex), 0);
    updateInstance(id, { zIndex: minZ - 1 });
  }, [instances, updateInstance]);

  const duplicateInstance = useCallback((id: string) => {
    const instance = instances.find(inst => inst.id === id);
    if (!instance) return;

    const newInstance: ComponentInstance = {
      ...instance,
      id: generateId(),
      name: `${instance.name} copy`,
      position: {
        x: instance.position.x + 20,
        y: instance.position.y + 20,
      },
      zIndex: Math.max(...instances.map(i => i.zIndex), 0) + 1,
    };

    setInstances(prev => [...prev, newInstance]);
    setSelectedIds([newInstance.id]);
  }, [instances]);

  const copyInstance = useCallback((id: string) => {
    const instance = instances.find(inst => inst.id === id);
    if (instance) {
      setClipboard(instance);
    }
  }, [instances]);

  const pasteInstance = useCallback((position?: Position) => {
    if (!clipboard) return;

    const newInstance: ComponentInstance = {
      ...clipboard,
      id: generateId(),
      name: `${clipboard.name} copy`,
      position: position || {
        x: clipboard.position.x + 20,
        y: clipboard.position.y + 20,
      },
      zIndex: Math.max(...instances.map(i => i.zIndex), 0) + 1,
    };

    setInstances(prev => [...prev, newInstance]);
    setSelectedIds([newInstance.id]);
  }, [clipboard, instances]);

  const toggleLock = useCallback((id: string) => {
    setInstances(prev =>
      prev.map(inst =>
        inst.id === id ? { ...inst, locked: !inst.locked } : inst
      )
    );
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setInstances(prev =>
      prev.map(inst =>
        inst.id === id ? { ...inst, visible: !inst.visible } : inst
      )
    );
  }, []);

  const getSelectedInstances = useCallback(() => {
    return instances.filter(inst => selectedIds.includes(inst.id));
  }, [instances, selectedIds]);

  const reorderInstances = useCallback((fromIndex: number, toIndex: number) => {
    setInstances(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result.map((inst, idx) => ({ ...inst, zIndex: idx + 1 }));
    });
  }, []);

  return {
    instances,
    selectedIds,
    clipboard,
    createInstance,
    deleteInstance,
    deleteSelected,
    updateInstance,
    updateInstanceProps,
    updateInstancePosition,
    selectInstance,
    clearSelection,
    selectAll,
    bringToFront,
    sendToBack,
    duplicateInstance,
    copyInstance,
    pasteInstance,
    toggleLock,
    toggleVisibility,
    getSelectedInstances,
    reorderInstances,
  };
};
