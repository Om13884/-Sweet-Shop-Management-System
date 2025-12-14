import { AuthService } from '../auth.service';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcrypt');

import prisma from '../../utils/prisma';

const mockPrisma = prisma as any;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (mockPrisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-id',
        email,
        password: hashedPassword,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register({ email, password });

      expect(result.user.email).toBe(email);
      expect(result.token).toBeDefined();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-id',
        email,
      });

      await expect(authService.register({ email, password })).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-id',
        email,
        password: hashedPassword,
        role: Role.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({ email, password });

      expect(result.user.email).toBe(email);
      expect(result.token).toBeDefined();
    });

    it('should throw error if user not found', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'test@example.com', password: 'password' })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error if password is incorrect', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.USER,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid email or password');
    });
  });
});

