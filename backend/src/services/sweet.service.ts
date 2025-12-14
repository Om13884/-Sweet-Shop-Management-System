import { Sweet } from '@prisma/client';
import prisma from '../utils/prisma';

export interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateSweetData {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface SearchFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class SweetService {
  async create(data: CreateSweetData): Promise<Sweet> {
    return prisma.sweet.create({
      data,
    });
  }

  async findAll(filters?: SearchFilters): Promise<Sweet[]> {
    const where: any = {};

    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters?.category) {
      where.category = {
        contains: filters.category,
        mode: 'insensitive',
      };
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return prisma.sweet.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Sweet | null> {
    return prisma.sweet.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateSweetData): Promise<Sweet> {
    return prisma.sweet.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.sweet.delete({
      where: { id },
    });
  }

  async purchase(id: string, quantity: number = 1): Promise<Sweet> {
    const sweet = await this.findById(id);

    if (!sweet) {
      throw new Error('Sweet not found');
    }

    if (sweet.quantity < quantity) {
      throw new Error('Insufficient quantity available');
    }

    return prisma.sweet.update({
      where: { id },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }

  async restock(id: string, quantity: number): Promise<Sweet> {
    const sweet = await this.findById(id);

    if (!sweet) {
      throw new Error('Sweet not found');
    }

    return prisma.sweet.update({
      where: { id },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }
}

