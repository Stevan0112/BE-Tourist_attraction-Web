import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import wisataRoutes from "./routes/wisata.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import kriteriaRoutes from "./routes/kriteria.routes.js";
import sawRoutes from "./routes/saw.routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/wisata", wisataRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/kriteria", kriteriaRoutes);
app.use("/api/saw", sawRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint tidak ditemukan"
    });
});