import request from 'supertest';
import app from '../../index';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

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

const generateToken = (role: Role = Role.USER) => {
  return jwt.sign(
    { userId: 'user-id', role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '7d' }
  );
};

describe('Sweet Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets with valid token', async () => {
      const token = generateToken();
      (mockPrisma.sweet.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/sweets', () => {
    it('should create sweet as admin', async () => {
      const token = generateToken(Role.ADMIN);
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      (mockPrisma.sweet.create as jest.Mock).mockResolvedValue({
        id: 'sweet-id',
        ...sweetData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send(sweetData);

      expect(response.status).toBe(201);
    });

    it('should return 403 for non-admin user', async () => {
      const token = generateToken(Role.USER);

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 5.99,
        });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase sweet successfully', async () => {
      const token = generateToken();
      const sweet = {
        id: 'sweet-id',
        name: 'Chocolate Bar',
        quantity: 10,
      };

      (mockPrisma.sweet.findUnique as jest.Mock).mockResolvedValue(sweet);
      (mockPrisma.sweet.update as jest.Mock).mockResolvedValue({
        ...sweet,
        quantity: 9,
      });

      const response = await request(app)
        .post('/api/sweets/sweet-id/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(200);
    });

    it('should return 400 if insufficient quantity', async () => {
      const token = generateToken();
      const sweet = {
        id: 'sweet-id',
        quantity: 0,
      };

      (mockPrisma.sweet.findUnique as jest.Mock).mockResolvedValue(sweet);

      const response = await request(app)
        .post('/api/sweets/sweet-id/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
    });
  });
});

