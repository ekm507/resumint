import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./styles/editor-ui.css";

import "./themes/theme-modern.css";
import "./themes/theme-classic.css";
import "./themes/theme-minimal.css";
import "./themes/theme-terminal.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
