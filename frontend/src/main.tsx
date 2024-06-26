import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import axios from "axios";
import { Toaster } from "react-hot-toast";
// axios.defaults.baseURL = "https://backend.aayushlad058.workers.dev";
// axios.defaults.baseURL = "http://127.0.0.1:8787";
// axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.baseURL = "https://medium-clone-one-ruddy.vercel.app";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
	<>
		<Toaster
			position="top-center"
			toastOptions={{
				style: {
					border: "1px solid black",
					padding: "8px 15px",
					color: "#333",
					fontWeight: "600",
				},
				iconTheme: {
					primary: "black",
					secondary: "white",
				},
			}}
		/>
		<App />
	</>,
);
