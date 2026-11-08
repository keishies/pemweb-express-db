import type { Request, Response } from "express";
import prisma from "../config/prisma";

const parseId = (value: unknown): number | null => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const validate = (body: any): string | null => {
  const { name, price } = body ?? {};
  if (typeof name !== "string" || name.trim() === "") return "Name wajib diisi";
  if (typeof price !== "number" || !Number.isInteger(price) || price < 0) {
    return "Price harus berupa bilangan bulat tidak negatif";
  }
  return null;
};

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  res.status(200).json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });

  res.status(200).json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  const { name, price } = req.body;
  const product = await prisma.product.create({ data: { name: name.trim(), price } });
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });

  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Produk tidak ditemukan" });

  const { name, price } = req.body;
  const product = await prisma.product.update({
    where: { id },
    data: { name: name.trim(), price },
  });
  res.status(200).json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "ID tidak valid" });

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Produk tidak ditemukan" });

  await prisma.product.delete({ where: { id } });
  res.status(200).json({ message: "Produk berhasil dihapus", data: existing });
};