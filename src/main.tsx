import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MathProvider } from "./useMath";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MathProvider>
      <App />
    </MathProvider>
  </StrictMode>,
);
