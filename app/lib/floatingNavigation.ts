export interface NavigationPosition {
  x: number;
  y: number;
}

export interface NavigationBounds {
  width: number;
  height: number;
  barWidth: number;
  barHeight: number;
  insetTop: number;
  insetRight: number;
  insetBottom: number;
  insetLeft: number;
}

// Keep the complete bar inside the available area, including safe-area margins.
export function constrainNavigationPosition(
  position: NavigationPosition | null,
  bounds: NavigationBounds,
): NavigationPosition {
  const maxX = Math.max(0, bounds.width - bounds.barWidth - bounds.insetRight);
  const maxY = Math.max(0, bounds.height - bounds.barHeight - bounds.insetBottom);
  const minX = Math.min(bounds.insetLeft, maxX);
  const minY = Math.min(bounds.insetTop, maxY);
  return {
    x: Math.max(minX, Math.min(maxX, position?.x ?? maxX)),
    y: Math.max(minY, Math.min(maxY, position?.y ?? maxY)),
  };
}
