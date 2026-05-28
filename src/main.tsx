import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initAntiDevtools } from "./lib/antiDevtools";

// Init anti-devtools protection
initAntiDevtools();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
