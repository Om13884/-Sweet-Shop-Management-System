import { SweetService } from '../sweet.service';

jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    sweet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from '../../utils/prisma';

const mockPrisma = prisma as any;

describe('SweetService', () => {
  let sweetService: SweetService;

  beforeEach(() => {
    sweetService = new SweetService();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new sweet', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      const createdSweet = {
        id: 'sweet-id',
        ...sweetData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.sweet.create as jest.Mock).mockResolvedValue(createdSweet);

      const result = await sweetService.create(sweetData);

      expect(result).toEqual(createdSweet);
      expect(mockPrisma.sweet.create).toHaveBeenCalledWith({ data: sweetData });
    });
  });

  describe('findAll', () => {
    it('should return all sweets', async () => {
      const sweets = [
        {
          id: 'sweet-1',
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 5.99,
          quantity: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.sweet.findMany as jest.Mock).mockResolvedValue(sweets);

      const result = await sweetService.findAll();

      expect(result).toEqual(sweets);
    });

    it('should filter sweets by name', async () => {
      const filters = { name: 'Chocolate' };
      (mockPrisma.sweet.findMany as jest.Mock).mockResolvedValue([]);

      await sweetService.findAll(filters);

      expect(mockPrisma.sweet.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: expect.objectContaining({
              contains: 'Chocolate',
            }),
          }),
        })
      );
    });
  });

  describe('purchase', () => {
    it('should decrease quantity on purchase', async () => {
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.sweet.findUnique as jest.Mock).mockResolvedValue(sweet);
      (mockPrisma.sweet.update as jest.Mock).mockResolvedValue({
        ...sweet,
        quantity: 9,
      });

      const result = await sweetService.purchase('sweet-id', 1);

      expect(result.quantity).toBe(9);
    });

    it('should throw error if insufficient quantity', async () => {
      const sweet = {
        id: 'sweet-id',
        quantity: 0,
      };

      (mockPrisma.sweet.findUnique as jest.Mock).mockResolvedValue(sweet);

      await expect(sweetService.purchase('sweet-id', 1)).rejects.toThrow(
        'Insufficient quantity available'
      );
    });
  });

  describe('restock', () => {
    it('should increase quantity on restock', async () => {
      const sweet = {
        id: 'sweet-id',
        quantity: 10,
      };

      (mockPrisma.sweet.findUnique as jest.Mock).mockResolvedValue(sweet);
      (mockPrisma.sweet.update as jest.Mock).mockResolvedValue({
        ...sweet,
        quantity: 20,
      });

      const result = await sweetService.restock('sweet-id', 10);

      expect(result.quantity).toBe(20);
    });
  });
});

