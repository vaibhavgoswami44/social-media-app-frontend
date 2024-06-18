import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import CombinedState from "./Context/CombinedState/index";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CombinedState>
      <App />
    </CombinedState>
  </BrowserRouter>
);
