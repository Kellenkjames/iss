export interface FloatingPosition {
  top: number;
  left: number;
}

export function calculateFloatingPosition(
  trigger: DOMRect,
  floating: DOMRect,
  viewportWidth = globalThis.innerWidth,
  viewportHeight = globalThis.innerHeight,
  gap = 4
): FloatingPosition {
  const belowTop = trigger.bottom + gap;
  const aboveTop = trigger.top - floating.height - gap;
  const shouldFlip =
    belowTop + floating.height > viewportHeight &&
    trigger.top > viewportHeight - trigger.bottom;
  const top = shouldFlip ? Math.max(0, aboveTop) : belowTop;
  const maxLeft = Math.max(0, viewportWidth - floating.width);

  return {
    top,
    left: Math.min(Math.max(0, trigger.left), maxLeft),
  };
}
