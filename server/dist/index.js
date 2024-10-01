"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const helperRoutes_1 = __importDefault(require("./routes/helperRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/auth", authRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use("/api/helper", helperRoutes_1.default);
//posts
app.use("/api/posts", postRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
