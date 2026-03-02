import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const secretIngredients = ["rice", "salmon", "onion"];

export const IngredientsList = ({ items }: { items: string[] }) => {
  return (
    <>
      <h1>Hello</h1>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IngredientsList items={secretIngredients} />
  </StrictMode>,
);
