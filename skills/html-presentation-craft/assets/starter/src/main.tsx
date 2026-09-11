import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Player } from "./runtime/Player";
import { deck } from "./deck";
import "./runtime/stage.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Player deck={deck} />
  </StrictMode>,
);
