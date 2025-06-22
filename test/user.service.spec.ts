import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash password and create a user', async () => {
      const dto = {
        username: 'beatriz',
        password: '123456',
        birthdate: '1990-01-01',
      };

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      mockRepository.create.mockReturnValue({
        ...dto,
        password: hashedPassword,
      });
      mockRepository.save.mockResolvedValue({ id: 'uuid', ...dto });

      const result = await service.createUser(dto);

      expect(result).toHaveProperty('id');
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a list of users with formatted dates', async () => {
      const users = [
        {
          id: '1',
          username: 'beatriz',
          birthdate: new Date('1995-04-01'),
          balance: 1000,
          password: 'hash',
          createdAt: new Date('2025-06-20T01:03:35.570Z'),
        },
      ];

      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: '1',
          username: 'beatriz',
          birthdate: '1995-04-01',
          balance: 1000,
          createdAt: '2025-06-20T01:03:35.570Z',
        },
      ]);
    });
  });
});
