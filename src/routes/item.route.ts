import { Router, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { items } from "../db/schema";

export const itemRouter = Router();

// GET all items
itemRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const allItems = await db.select().from(items);
    res.json({ success: true, data: allItems });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET item by ID
itemRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(items).where(eq(items.id, id));

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, data: result[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE new item
itemRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const [inserted] = await db.insert(items).values({ title, description });
    res.status(201).json({
      success: true,
      data: {
        id: inserted.insertId,
        title,
        description,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE item
itemRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(items).where(eq(items.id, id));
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
