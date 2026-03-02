import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "./App";
import { MathProvider } from "./useMath";

const renderApp = () =>
  render(
    <MathProvider>
      <App />
    </MathProvider>,
  );

describe("App", () => {
  it("renders the title and empty state", () => {
    renderApp();
    expect(screen.getByRole("heading", { name: /math history app/i })).toBeTruthy();
    expect(screen.getByText(/no calculations yet/i)).toBeTruthy();
  });

  it("has an number input and Add 10 button", () => {
    renderApp();
    expect(screen.getByRole("spinbutton")).toBeTruthy();
    expect(screen.getByRole("button", { name: /add 10/i })).toBeTruthy();
  });

  it("adds 10 to the input value and shows result in history when Add 10 is clicked", () => {
    renderApp();

    const input = screen.getByRole("spinbutton");
    const button = screen.getByRole("button", { name: /add 10/i });

    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(button);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0].textContent).toContain("Result #1:");
    expect(listItems[0].textContent).toContain("15");
  });

  it("appends multiple results to the history", () => {
    renderApp();

    const input = screen.getByRole("spinbutton");
    const button = screen.getByRole("button", { name: /add 10/i });

    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.click(button);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0].textContent).toContain("Result #1:");
    expect(listItems[0].textContent).toContain("10");
    expect(listItems[1].textContent).toContain("Result #2:");
    expect(listItems[1].textContent).toContain("11");
  });
});
