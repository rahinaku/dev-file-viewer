import { describe, expect, it } from "vitest";
import { constrainNavigationPosition } from "../floatingNavigation";
import type { NavigationBounds } from "../floatingNavigation";

const portrait: NavigationBounds = {
  width: 390, height: 844, barWidth: 146, barHeight: 50,
  insetTop: 16, insetRight: 16, insetBottom: 50, insetLeft: 16,
};

describe("floating media navigation position", () => {
  it("starts at bottom right using the actual bar size and safe-area margins", () => {
    expect(constrainNavigationPosition(null, portrait)).toEqual({ x: 228, y: 744 });
  });

  it("preserves a user position when it is inside the bounds", () => {
    expect(constrainNavigationPosition({ x: 80, y: 200 }, portrait)).toEqual({ x: 80, y: 200 });
  });

  it("constrains dragging past all four edges", () => {
    expect(constrainNavigationPosition({ x: -100, y: -100 }, portrait)).toEqual({ x: 16, y: 16 });
    expect(constrainNavigationPosition({ x: 1000, y: 1000 }, portrait)).toEqual({ x: 228, y: 744 });
  });

  it("brings the bar back into view after rotation, including landscape safe areas", () => {
    const landscape = {
      ...portrait, width: 844, height: 390,
      insetLeft: 60, insetRight: 60, insetBottom: 37,
    };
    expect(constrainNavigationPosition({ x: 228, y: 744 }, landscape)).toEqual({ x: 228, y: 303 });
    expect(constrainNavigationPosition(null, landscape)).toEqual({ x: 638, y: 303 });
  });

  it("relaxes margins when a small viewport cannot fit the bar and both margins", () => {
    expect(constrainNavigationPosition({ x: 100, y: 100 }, {
      ...portrait, width: 160, height: 60,
    })).toEqual({ x: 0, y: 0 });
  });
});
