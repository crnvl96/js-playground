import { useState } from "react";
import { useMath } from "./useMath";
import styles from "./App.module.css";

export const App = () => {
  const { history, pushToHistory } = useMath();
  const [input, setInput] = useState<number>(0);

  const handleAdd = () => {
    pushToHistory(input + 10);
  };

  return (
    <div className={styles.container}>
      <h1>Math History App</h1>

      <section className={styles.inputSection}>
        <input type="number" value={input} onChange={(e) => setInput(Number(e.target.value))} />
        <button onClick={handleAdd}>Add 10</button>
      </section>

      <section className={styles.historySection}>
        <h2>Operation History</h2>
        {history.length === 0 ? (
          <p>No calculations yet.</p>
        ) : (
          <ul className={styles.historyList}>
            {history.map((item, index) => (
              <li key={index} className={styles.historyItem}>
                Result #{index + 1}: <strong>{item}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
