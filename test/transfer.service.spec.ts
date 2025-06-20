// test/transfer.service.spec.ts
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TransferService } from '../src/transfer/transfer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import type { EntityManager } from 'typeorm';
import { DataSource } from 'typeorm';
import type { TransferDto } from '../src/transfer/dto/transfer.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TransferService', () => {
  let service: TransferService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TransferService>(TransferService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transfer', () => {
    const dto: TransferDto = {
      fromId: 'uuid-1',
      toId: 'uuid-2',
      amount: 100,
    };

    it('should throw if fromId equals toId', async () => {
      await expect(
        service.transfer({ ...dto, toId: dto.fromId }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if sender or receiver not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValueOnce(null); // sender not found
      await expect(service.transfer(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw if sender has insufficient balance', async () => {
      const sender = { id: 'uuid-1', balance: '50' };
      const receiver = { id: 'uuid-2', balance: '200' };

      mockUserRepository.findOneBy
        .mockResolvedValueOnce(sender) // sender
        .mockResolvedValueOnce(receiver); // receiver

      await expect(service.transfer(dto)).rejects.toThrow(BadRequestException);
    });

    it('should execute transfer successfully inside transaction', async () => {
      const sender = { id: 'uuid-1', balance: '200' };
      const receiver = { id: 'uuid-2', balance: '300' };

      mockUserRepository.findOneBy
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver);

      mockDataSource.transaction.mockImplementation(
        async (cb: (manager: EntityManager) => Promise<void>) => {
          await cb({ save: jest.fn() } as unknown as EntityManager);
        },
      );

      await expect(service.transfer(dto)).resolves.toBeUndefined();
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  });
});
