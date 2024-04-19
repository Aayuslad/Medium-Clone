"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const storyRouter_1 = __importDefault(require("./router/storyRouter"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://medium-clone-jz8b.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.json({ message: " server startted " });
});
app.use("/api/v1/user", userRouter_1.default);
app.use("/api/v1/story", storyRouter_1.default);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("server started"));
