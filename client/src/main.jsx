import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConversationProvider } from "./context";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConversationProvider>
      <App />
    </ConversationProvider>
  </StrictMode>
);
