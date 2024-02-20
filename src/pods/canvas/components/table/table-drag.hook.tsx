import React, { useState, useCallback } from 'react';
import { Size } from '@/core/model';
import { UpdatePositionFn, UpdatePositionItemInfo } from '@/core/providers';

export const useDraggable = (
  id: string,
  initialX: number,
  initialY: number,
  updatePosition: UpdatePositionFn,
  totalHeight: number,
  canvasSize: Size
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [finalInfoAfterDrag, setFinalInfoAfterDrag] =
    useState<UpdatePositionItemInfo | null>(null);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      setStartDragPosition({
        x: event.clientX - initialX,
        y: event.clientY - initialY,
      });
      setIsDragging(true);
    },
    [initialX, initialY]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (isDragging) {
        const newX = event.clientX - startDragPosition.x;
        const newY = event.clientY - startDragPosition.y;

        const currentItemInfo = {
          id,
          position: { x: newX, y: newY },
          totalHeight,
          canvasSize,
        };

        updatePosition(currentItemInfo, false);
        setFinalInfoAfterDrag(currentItemInfo);
      }
    },
    [id, isDragging, startDragPosition, updatePosition, totalHeight, canvasSize]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    if (finalInfoAfterDrag) {
      updatePosition(finalInfoAfterDrag, true);
    }
  }, [finalInfoAfterDrag]);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    } else {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging, onPointerMove, onPointerUp]);

  return { onPointerDown };
};
