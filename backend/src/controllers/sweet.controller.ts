import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { SweetService } from '../services/sweet.service';
import { validationResult } from 'express-validator';

const sweetService = new SweetService();

export const createSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, category, price, quantity } = req.body;
    const sweet = await sweetService.create({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
    });

    res.status(201).json(sweet);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filters: any = {};
    if (name) filters.name = name as string;
    if (category) filters.category = category as string;
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);

    const sweets = await sweetService.findAll(filters);
    res.status(200).json(sweets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);

    const sweet = await sweetService.update(id, updateData);
    res.status(200).json(sweet);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await sweetService.delete(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const purchaseSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const purchaseQuantity = quantity ? parseInt(quantity) : 1;

    const sweet = await sweetService.purchase(id, purchaseQuantity);
    res.status(200).json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Insufficient quantity available') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const restockSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      res.status(400).json({ error: 'Quantity must be a positive number' });
      return;
    }

    const sweet = await sweetService.restock(id, parseInt(quantity));
    res.status(200).json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

