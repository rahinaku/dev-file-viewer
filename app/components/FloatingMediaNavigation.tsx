import { useLayoutEffect, useRef } from "react";
import type { Dispatch, SetStateAction, PointerEvent, KeyboardEvent } from "react";
import { constrainNavigationPosition } from "../lib/floatingNavigation";
import type { NavigationBounds, NavigationPosition } from "../lib/floatingNavigation";

interface FloatingMediaNavigationProps {
  position: NavigationPosition | null;
  onPositionChange: Dispatch<SetStateAction<NavigationPosition | null>>;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function FloatingMediaNavigation({
  position, onPositionChange, hasPrev, hasNext, onPrev, onNext,
}: FloatingMediaNavigationProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: NavigationPosition;
  } | null>(null);

  const getBounds = (): NavigationBounds | null => {
    const area = areaRef.current;
    const bar = barRef.current;
    if (!area || !bar || !area.clientWidth || !bar.offsetWidth) return null;
    const style = getComputedStyle(area);
    return {
      width: area.clientWidth, height: area.clientHeight,
      barWidth: bar.offsetWidth, barHeight: bar.offsetHeight,
      insetTop: parseFloat(style.paddingTop),
      insetRight: parseFloat(style.paddingRight),
      insetBottom: parseFloat(style.paddingBottom),
      insetLeft: parseFloat(style.paddingLeft),
    };
  };

  useLayoutEffect(() => {
    const constrain = () => {
      const bounds = getBounds();
      if (!bounds) return;
      onPositionChange(previous => {
        const next = constrainNavigationPosition(previous, bounds);
        return previous?.x === next.x && previous?.y === next.y ? previous : next;
      });
    };
    constrain();
    const observer = new ResizeObserver(constrain);
    if (areaRef.current) observer.observe(areaRef.current);
    if (barRef.current) observer.observe(barRef.current);
    window.addEventListener("resize", constrain);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", constrain);
      dragRef.current = null;
    };
  }, [onPositionChange]);

  const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    const bounds = getBounds();
    if (!bounds) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX, startY: event.clientY,
      origin: constrainNavigationPosition(position, bounds),
    };
  };

  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const bounds = getBounds();
    if (!drag || drag.pointerId !== event.pointerId || !bounds) return;
    onPositionChange(constrainNavigationPosition({
      x: drag.origin.x + event.clientX - drag.startX,
      y: drag.origin.y + event.clientY - drag.startY,
    }, bounds));
  };

  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const moveWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    const directions: Record<string, NavigationPosition> = {
      ArrowLeft: { x: -10, y: 0 }, ArrowRight: { x: 10, y: 0 },
      ArrowUp: { x: 0, y: -10 }, ArrowDown: { x: 0, y: 10 },
    };
    const delta = directions[event.key];
    if (!delta) return;
    // Prevent the modal's document-level arrow handler from navigating files.
    event.preventDefault();
    event.stopPropagation();
    const bounds = getBounds();
    if (!bounds) return;
    onPositionChange(previous => {
      const origin = constrainNavigationPosition(previous, bounds);
      return constrainNavigationPosition({ x: origin.x + delta.x, y: origin.y + delta.y }, bounds);
    });
  };

  const buttonClass = "flex h-12 w-12 shrink-0 items-center justify-center text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div ref={areaRef} className="mobile-media-navigation fixed inset-0 z-20 pointer-events-none">
      <div
        ref={barRef}
        role="group"
        aria-label="ファイルの前後移動"
        className="floating-media-navigation absolute flex overflow-hidden rounded-xl border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-sm pointer-events-auto select-none"
        style={position ? { left: position.x, top: position.y, right: "auto", bottom: "auto" } : undefined}
      >
        <button
          type="button"
          className={`${buttonClass} cursor-grab active:cursor-grabbing touch-none`}
          aria-label="操作バーを移動"
          title="ドラッグまたは矢印キーで移動"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={() => { dragRef.current = null; }}
          onKeyDown={moveWithKeyboard}
        >
          <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            {[6, 12, 18].map(y => <g key={y}><circle cx="9" cy={y} r="1.5" /><circle cx="15" cy={y} r="1.5" /></g>)}
          </svg>
        </button>
        <button type="button" className={`${buttonClass} border-l border-white/20`} aria-label="前のファイル" disabled={!hasPrev} onClick={onPrev}>
          <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button type="button" className={`${buttonClass} border-l border-white/20`} aria-label="次のファイル" disabled={!hasNext} onClick={onNext}>
          <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
