import Home from "./Pages/Home";
import { ToastContainer } from "react-toastify";
import { ConversationProvider } from "./context.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <ConversationProvider>
      <Home />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ConversationProvider>
  );
}

export default App;
