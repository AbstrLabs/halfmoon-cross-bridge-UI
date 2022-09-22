import "./index.css";

//font
import "./font/Supply-Regular.otf"
import "./font/Supply-Light.otf"
import "./font/Supply-UltraLight.otf"
import "./font/Supply-Medium.otf"
import "./font/Supply-Bold.otf"

// config
import App from "./App";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />)
