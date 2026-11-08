import express from "express";
import productsRouter from "./routes/products.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/products", productsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});