import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MathProvider, useMath } from "./useMath";

describe("useMath", () => {
  it("throws when used outside MathProvider", () => {
    expect(() => renderHook(() => useMath())).toThrow(
      "useMath must be used within a MathProvider",
    );
  });

  it("returns initial empty history and pushToHistory when used inside MathProvider", () => {
    const { result } = renderHook(() => useMath(), {
      wrapper: ({ children }) => <MathProvider>{children}</MathProvider>,
    });

    expect(result.current.history).toEqual([]);
    expect(typeof result.current.pushToHistory).toBe("function");
  });

  it("updates history when pushToHistory is called", () => {
    const { result } = renderHook(() => useMath(), {
      wrapper: ({ children }) => <MathProvider>{children}</MathProvider>,
    });

    act(() => {
      result.current.pushToHistory(42);
    });
    expect(result.current.history).toEqual([42]);

    act(() => {
      result.current.pushToHistory(100);
    });
    expect(result.current.history).toEqual([42, 100]);
  });
});
