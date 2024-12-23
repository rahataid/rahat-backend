import { BullModule } from '@nestjs/bull';
import { TestingModule, Test } from '@nestjs/testing';
import { BeneficiaryService } from './beneficiary.service';
import { PrismaService } from '@rumsan/prisma';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BeneficiaryEvents, BQUEUE, ProjectContants } from '@rahataid/sdk';
import { VerificationService } from './verification.service';
import { CreateBeneficiaryDto } from '@rahataid/extensions';
import { randomUUID } from 'crypto';
import { RpcException } from '@nestjs/microservices';
import { isAddress } from 'viem';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';


jest.mock('viem', () => ({
  isAddress: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('BeneficiaryService', () => {
  let service: BeneficiaryService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;
  let rsprisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: BQUEUE.RAHAT_BENEFICIARY,
        }),
      ],
      providers: [
        BeneficiaryService,
        {
          provide: PrismaService,
          useValue: {
            beneficiary: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              createMany: jest.fn()
            },
            beneficiaryPii: {
              create: jest.fn(),
              createMany: jest.fn(),
              findMany: jest.fn()
            },
            rsclient: {
              beneficiaryPii: {
                findUnique: jest.fn(),
                create: jest.fn(),
                findFirst: jest.fn()
              },
              beneficiary: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findFirst: jest.fn()
              }
            },
            groupedBeneficiaries: {
              updateMany: jest.fn(),
              createMany: jest.fn()
            },
            beneficiaryGroup: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn()
            }
          },
        },
        {
          provide: EventEmitter2,
          // useValue: new (EventEmitter2 as any)(),
          useValue: {
            emit: jest.fn()
          }
        },
        {
          provide: ProjectContants.ELClient,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: VerificationService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BeneficiaryService>(BeneficiaryService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    rsprisma = prisma.rsclient;
  });

  describe('create', () => {
    it('should successfully create new beneficiary', async () => {
      const mockRequest = {
        birthDate: new Date('2024-09-05T06:27:57.136Z'),
        age: 20,
        gender: 'FEMALE',
        location: 'lalitpur',
        latitude: 26.24,
        longitude: 86.24,
        notes: 'notes',
        walletAddress: 'wallet1',
        extras: {
          hasCitizenship: true,
          passportNumber: '1234567',
          email: 'test@mailinator.com',
        },
        bankedStatus: 'BANKED',
        internetStatus: 'HOME_INTERNET',
        phoneStatus: 'FEATURE_PHONE',
        piiData: {
          name: 'Test Test',
          phone: '9800000',
          extras: {
            bank: 'Bank',
            account: 'account',
          },
        },
        projectUUIDs: ['uuid' as `${string}-${string}-${string}-${string}-${string}`],
        id: 'mock-beneficiary-id',
      };
    
      const mockCreatedBeneficiary = {
        ...mockRequest,
        id: 'mock-beneficiary-id',
      };
      (isAddress as unknown as jest.Mock).mockReturnValue(true);
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(null);
      (rsprisma.beneficiary.create as jest.Mock).mockResolvedValue(mockCreatedBeneficiary);
      (rsprisma.beneficiaryPii.findUnique as jest.Mock).mockResolvedValue(null);
      (rsprisma.beneficiaryPii.create as jest.Mock).mockResolvedValue({
        beneficiaryId: 'mock-beneficiary-id',
        phone: mockRequest.piiData.phone,
        ...mockRequest.piiData,
      });
      const result = await service.create(mockRequest as CreateBeneficiaryDto, 'uuid' as `${string}-${string}-${string}-${string}-${string}`);
      expect(result).toEqual(mockCreatedBeneficiary);
      expect(rsprisma.beneficiary.create).toHaveBeenCalledWith({
        data: {
          ...mockRequest,
          piiData: undefined,
          projectUUIDs: undefined,
        },
      });
      (rsprisma.beneficiaryPii.create as jest.Mock).mockResolvedValue({
        beneficiaryId: 'mock-beneficiary-id',
        phone: mockRequest.piiData.phone,
        ...mockRequest.piiData,
      });
    
      expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(BeneficiaryEvents.BENEFICIARY_CREATED, {
        projectUuid: 'uuid' as `${string}-${string}-${string}-${string}-${string}`,
      });
    });

    it('should throw an error if wallet address is not unique', async () => {
      const dto = {
        walletAddress: 'wallet',
        piiData: {
          phone: '1234567890',
        },
        projectUUIDs: ['project-uuid-1'],
      };
      const existingBeneficiary = {
        id: 1,
        uuid: 'beneficiary-uuid',
        walletAddress: 'wallet',
      };
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(existingBeneficiary);
      await expect(service.create(dto as CreateBeneficiaryDto, 'project-uuid-1')).rejects.toThrow('Wallet should be unique');
    });

    it('should throw an error if wallet address is not valid ethereum address', async () => {
      const dto = {
        walletAddress : 'invalid-uuid'
      };
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(null);
      (isAddress as unknown as jest.Mock).mockReturnValue(false);
      await expect(service.create(dto as CreateBeneficiaryDto)).rejects.toThrow(
        new RpcException('Wallet should be valid Ethereum address')
      );    
    });
  
    it('should throw an error if phone number is not unique', async () => {
      const dto = {
        walletAddress: 'wallet', 
        piiData: {
          phone: '1234567890',
        },
        projectUUIDs: ['project-uuid-1'],
      };
      const existingBeneficiaryPii = {
        id: 1,
        beneficiaryId: 1,
        phone: '1234567890',
      };
      rsprisma.beneficiaryPii.findUnique.mockResolvedValue(existingBeneficiaryPii);
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(null);
      (isAddress as unknown as jest.Mock).mockReturnValue(true);
      await expect(service.create(dto as CreateBeneficiaryDto, 'project-uuid-1')).rejects.toThrow('Phone number should be unique')
    });
    
    it('should throw an error if phone number is required', async () => {
      const dto = {
        walletAddress: 'wallet', 
        piiData: {},
        projectUUIDs: ['project-uuid-1'],
      };
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(null);
      (isAddress as unknown as jest.Mock).mockReturnValue(true);
      await expect(service.create(dto as CreateBeneficiaryDto, 'project-uuid-1')).rejects.toThrow('Phone number is required')
    });
  });

  describe('list', () => {
    it('should list all the beneficiaries when projectId is provided', async () => {
      const query = {
        sort: 'createdAt',
        orderBy: 'asc',
        page: 1,
        perPage: 10,
        gender: 'MALE',
        startDate: '2024-09-03T16:15:32.098Z',
        endDate: '2024-09-04T16:15:32.098Z'
      };
    });
  });

  describe('findOneByWallet', () => {
    it('should return a beneficiary if piiData found using walletAddress', async () => {
      const mockResponse = {
        id: 1,
        uuid: "uuid" as `${string}-${string}-${string}-${string}-${string}`,
        birthDate: new Date(),
        age: 20,
        gender: 'FEMALE',
        location: 'lalitpur',
        latitude: 26.24,
        longitude: 86.24,
        notes: 'notes',
        walletAddress: '0x00' as `${string}-${string}-${string}-${string}-${string}`,
        extras: {
          hasCitizenship: true,
          passportNumber: '1234567',
          email: 'test@mailinator.com',
        },
        bankedStatus: 'BANKED',
        internetStatus: 'HOME_INTERNET',
        phoneStatus: 'FEATURE_PHONE',
        piiData: {
          beneficiaryId: 1,
          name: "Ram Shrestha",
          phone: "9898989898",
          email: null,
          extras: {
            bank: "Bank",
            account: "account"
          }
        }
      };
      (rsprisma.beneficiary.findFirst as jest.Mock).mockResolvedValue(mockResponse);
      (rsprisma.beneficiaryPii.findUnique as jest.Mock).mockResolvedValue(mockResponse.piiData);
      const result = await service.findOneByWallet(mockResponse.walletAddress);
      expect(result).toEqual(mockResponse);
      expect(rsprisma.beneficiary.findFirst).toHaveBeenCalledWith({
        where: { 
          walletAddress: mockResponse.walletAddress
        },
        include: {
          BeneficiaryProject: {
            include: {
              Project: true,
            }
          }
        }
      });
      expect(rsprisma.beneficiaryPii.findUnique).toHaveBeenCalledWith({
        where: { beneficiaryId: mockResponse.id },
      });
    });

    it('should return a beneficiary if piiData isnot found using walletAddress', async () => {
      const mockResponse = {
        id: 1,
        uuid: "uuid" as `${string}-${string}-${string}-${string}-${string}`,
        birthDate: new Date(),
        age: 20,
        gender: 'FEMALE',
        location: 'lalitpur',
        latitude: 26.24,
        longitude: 86.24,
        notes: 'notes',
        walletAddress: '0x00' as `${string}-${string}-${string}-${string}-${string}`,
        extras: {
          hasCitizenship: true,
          passportNumber: '1234567',
          email: 'test@mailinator.com',
        },
        bankedStatus: 'BANKED',
        internetStatus: 'HOME_INTERNET',
        phoneStatus: 'FEATURE_PHONE',
      };
      (rsprisma.beneficiary.findFirst as jest.Mock).mockResolvedValue(mockResponse);
      (rsprisma.beneficiaryPii.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.findOneByWallet(mockResponse.walletAddress);
      expect(result).toEqual(mockResponse);
      expect(rsprisma.beneficiary.findFirst).toHaveBeenCalledWith({
        where: { 
          walletAddress: mockResponse.walletAddress
        },
        include: {
          BeneficiaryProject: {
            include: {
              Project: true,
            }
          }
        }
      });
      expect(rsprisma.beneficiaryPii.findUnique).toHaveBeenCalledWith({
        where: { beneficiaryId: mockResponse.id },
      });
    });

    it('should return null if walletAddress is invalid', async () => {
      const invalidWalletAddress = 'invalid';
      (rsprisma.beneficiary.findFirst as jest.Mock).mockResolvedValue(null);
      const result = await service.findOneByWallet(invalidWalletAddress);
      expect(rsprisma.beneficiary.findFirst).toHaveBeenCalledWith({
        where: {
          walletAddress: invalidWalletAddress
        },
        include: {
          BeneficiaryProject: {
            include: {
              Project: true,
            }
          }
        }
      });
      expect(result).toBeNull();
    });
  });

  describe('findOneByPhone', () => {
    const mockResponse = {
      id: 1,
      uuid: "uuid" as `${string}-${string}-${string}-${string}-${string}`,
      birthDate: new Date(),
      age: 20,
      gender: 'FEMALE',
      location: 'lalitpur',
      latitude: 26.24,
      longitude: 86.24,
      notes: 'notes',
      walletAddress: '0x00' as `${string}-${string}-${string}-${string}-${string}`,
      extras: {
        hasCitizenship: true,
        passportNumber: '1234567',
        email: 'test@mailinator.com',
      },
      bankedStatus: 'BANKED',
      internetStatus: 'HOME_INTERNET',
      phoneStatus: 'FEATURE_PHONE',
      piiData: {
        beneficiaryId: 1,
        name: "Ram Shrestha",
        phone: "9898989898",
        email: null,
        extras: {
          bank: "Bank",
          account: "account"
        }
      }
    };
    it('should return a beneficiary if piiData found using phone number', async () => {
      (rsprisma.beneficiaryPii.findFirst as jest.Mock).mockResolvedValue(mockResponse.piiData);
      (rsprisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      const result = await service.findOneByPhone(mockResponse.piiData.phone);
      expect(result).toEqual(mockResponse);
      expect(rsprisma.beneficiaryPii.findFirst).toHaveBeenCalledWith({
        where: {
          phone: mockResponse.piiData.phone
        }
      });
      expect(rsprisma.beneficiary.findUnique).toHaveBeenCalledWith({
        where: { 
          id: mockResponse.piiData.beneficiaryId
        },
        include: {
          BeneficiaryProject: {
            include: {
              Project: true,
            }
          }
        }
      });
    });

    it('should return null if piiData isnot found', async () => {
      (rsprisma.beneficiaryPii.findFirst as jest.Mock).mockResolvedValue(null);
      const result = await service.findOneByPhone('invalid-phone');
      expect(rsprisma.beneficiaryPii.findFirst).toHaveBeenCalledWith({
        where: {
          phone: 'invalid-phone'
        }
      })
      expect(result).toBeNull();
    });

    it('should return if beneficiary is not found', async () => {
      (rsprisma.beneficiaryPii.findFirst as jest.Mock).mockResolvedValue(mockResponse.piiData);
      (rsprisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.findOneByPhone(mockResponse.piiData.phone);
      expect(rsprisma.beneficiaryPii.findFirst).toHaveBeenCalledWith({
        where: {
          phone: mockResponse.piiData.phone
        }
      });
      expect(rsprisma.beneficiary.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1
        },
        include: {
          BeneficiaryProject: {
            include: {
              Project: true
            }
          }
        }
      })
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const mockResponse = {
      id: 1,
      uuid: "uuid" as `${string}-${string}-${string}-${string}-${string}`,
      birthDate: new Date(),
      age: 20,
      gender: 'MALE',
      location: 'lalitpur',
      latitude: 26.24,
      longitude: 86.24,
      notes: '9999',
      walletAddress: '0x00' as `${string}-${string}-${string}-${string}-${string}`,
      extras: {
        hasCitizenship: true,
        passportNumber: '1234567',
        email: 'test@mailinator.com',
      },
      bankedStatus: 'BANKED',
      internetStatus: 'HOME_INTERNET',
      phoneStatus: 'FEATURE_PHONE',
      piiData: {
        beneficiaryId: 1,
        name: "Ram Shrestha",
        phone: "9999999999",
        email: null,
        extras: {
          bank: "Laxmi Bank",
          account: "9872200001"
        }
      }
    };
    it('should update the beneficiary details if dto doesnot contains piiData', async () => {
      const mockDto = {
        notes: '9999'
      };
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      (prisma.beneficiary.update as jest.Mock).mockResolvedValue({...mockResponse, ...mockDto});
      const result = await service.update(mockResponse.uuid, mockDto);
      expect(result).toEqual(mockResponse);
      expect(prisma.beneficiary.findUnique).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        }
      });
      expect(prisma.beneficiary.update).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        },
        data: mockDto
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(BeneficiaryEvents.BENEFICIARY_UPDATED);
    });

    it('should update the beneficiary details if dto contains piiData', async () => {
      const mockDto = {
        gender: 'MALE',
        piiData: {
          phone: '9999999999'
        }
      };
      const mockUpdatePII = jest.spyOn(service, 'updatePIIByBenefUUID').mockResolvedValue(mockDto.piiData);
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      (prisma.beneficiary.update as jest.Mock).mockResolvedValue({...mockResponse, ...mockDto});
      await service.update(mockResponse.uuid, mockDto as CreateBeneficiaryDto); 
      jest.spyOn(service, 'updatePIIByBenefUUID').mockResolvedValue(mockDto.piiData);
      expect(prisma.beneficiary.findUnique).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        }
      });
      expect(prisma.beneficiary.update).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        },
        data: {
          gender: mockDto.gender
        }
      });
      expect(mockUpdatePII).toHaveBeenCalledWith(mockResponse.uuid, mockDto.piiData);
      expect(eventEmitter.emit).toHaveBeenCalledWith(BeneficiaryEvents.BENEFICIARY_UPDATED);
    });

    it('should throw error if beneficiary is not found', async () => {
      const invalidUUID = 'invalid-uuid' as `${string}-${string}-${string}-${string}-${string}`;
      const mockDto = {
        location: 'XYZ'
      };
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.update(invalidUUID, mockDto)).rejects.toThrow("Data not Found");
    });
  });

  describe('remove', () => {
    const mockResponse = {
      id: 1,
      uuid: "123" as `${string}-${string}-${string}-${string}-${string}`,
      birthDate: new Date(),
      age: 20,
      gender: 'MALE',
      location: 'lalitpur',
      latitude: 26.24,
      longitude: 86.24,
      notes: '9999',
      walletAddress: '0x00' as `${string}-${string}-${string}-${string}-${string}`,
      extras: {
        hasCitizenship: true,
        passportNumber: '1234567',
        email: 'test@mailinator.com',
      },
      bankedStatus: 'BANKED',
      internetStatus: 'HOME_INTERNET',
      phoneStatus: 'FEATURE_PHONE',
      deletedAt: '2024-09-05T06:27:57.136Z',
      piiData: {
        beneficiaryId: 1,
        name: "Ram Shrestha",
        phone: "9999999999",
        email: null,
        extras: {
          bank: "Laxmi Bank",
          account: "9872200001"
        }
      },
      projectUUIDs: ['uuid' as `${string}-${string}-${string}-${string}-${string}`],
    };
    it('should soft delete beneficiary', async () => {
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      (prisma.beneficiary.update as jest.Mock).mockResolvedValue(mockResponse);
      (prisma.groupedBeneficiaries.updateMany as jest.Mock).mockResolvedValue(mockResponse);
      const result = await service.remove(mockResponse);
      expect(prisma.beneficiary.findUnique).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        }
      });
      expect(prisma.beneficiary.update).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        },
        data: {
          deletedAt: expect.any(Date)
        }
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(BeneficiaryEvents.BENEFICIARY_REMOVED, {
        projectUuid: mockResponse.uuid
      });
      expect(prisma.groupedBeneficiaries.updateMany).toHaveBeenCalledWith({
        where: {
          beneficiaryId: mockResponse.uuid
        },
        data: {
          deletedAt: expect.any(Date)
        }
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if beneficiary is not found', async () => {
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.remove(mockResponse)).rejects.toThrow('Data not Found');
      expect(prisma.beneficiary.findUnique).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        }
      });
    });
  });

  describe('delete', () => {
    const mockResponse = {
      id: 1,
      uuid: "123" as `${string}-${string}-${string}-${string}-${string}`,
      birthDate: new Date(),
      age: 20,
      gender: 'MALE',
      location: 'lalitpur',
      latitude: 26.24,
      longitude: 86.24,
      notes: '9999',
      walletAddress: '0x00' as `${string}-${string}-${string}-${string}-${string}`,
      extras: {
        hasCitizenship: true,
        passportNumber: '1234567',
        email: 'test@mailinator.com',
      },
      bankedStatus: 'BANKED',
      internetStatus: 'HOME_INTERNET',
      phoneStatus: 'FEATURE_PHONE',
      deletedAt: '2024-09-05T06:27:57.136Z',
      piiData: {
        beneficiaryId: 1,
        name: "Ram Shrestha",
        phone: "9999999999",
        email: null,
        extras: {
          bank: "Laxmi Bank",
          account: "9872200001"
        }
      },
      projectUUIDs: ['uuid' as `${string}-${string}-${string}-${string}-${string}`],
    };
    it('should delete the beneficiary as per uuid', async () => {
      const deletePIIMock = jest.spyOn(service, 'deletePIIByBenefUUID').mockResolvedValue(mockResponse.uuid);
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      (prisma.beneficiary.delete as jest.Mock).mockResolvedValue(mockResponse);
      const result = await service.delete(mockResponse.uuid);
      expect(prisma.beneficiary.findUnique).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        }
      });
      expect(prisma.beneficiary.delete).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        }
      });
      expect(deletePIIMock).toHaveBeenCalledTimes(1);
      expect(deletePIIMock).toHaveBeenCalledWith(mockResponse.uuid);
      expect(eventEmitter.emit).toHaveBeenCalledWith(BeneficiaryEvents.BENEFICIARY_UPDATED)
      expect(result).toBeDefined();
    });

    it('should throw an error if beneficiary is not found', async () => {
      (prisma.beneficiary.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.delete(mockResponse.uuid)).rejects.toThrow('Data not Found');
      expect(prisma.beneficiary.findUnique).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        }
      });
    });
  });

  describe('createBulk', () => {
    it('should throw an error if any beneficiary lacks a phone number', async () => {
      const dtos = [
        { piiData: { phone: null }, walletAddress: 'wallet1' },
        { piiData: { phone: '123456789' }, walletAddress: 'wallet2' },
      ];
      await expect(service.createBulk(dtos)).rejects.toThrow(
        new RpcException('Phone number is required'),
      );
    });
  
    it('should throw an error if phone numbers are not unique', async () => {
      const dtos = [
        { piiData: { phone: '123456789' }, walletAddress: 'wallet_1' },
        { piiData: { phone: '123456789' }, walletAddress: 'wallet_2' },
      ];
  
      jest.spyOn(service, 'checkPhoneNumber').mockResolvedValue(['123456789']);
  
      await expect(service.createBulk(dtos)).rejects.toThrow(
        new RpcException('123456789 Phone number should be unique'),
      );
    });
  
    it('should throw an error if wallet addresses are not unique', async () => {
      const dtos = [
        { piiData: { phone: '123456789' }, walletAddress: 'wallet_1' },
        { piiData: { phone: '987654321' }, walletAddress: 'wallet_1' },
      ];
    
      jest.spyOn(service, 'checkPhoneNumber').mockResolvedValue([]);
      jest.spyOn(service, 'checkWalletAddress').mockResolvedValue([
        {
          id: 1, 
          uuid: 'uuid_1', 
          walletAddress: 'wallet_1',
          gender: 'MALE',
          birthDate: undefined,
          age: 0,
          location: '',
          latitude: 0,
          longitude: 0,
          extras: '',
          notes: '',
          bankedStatus: 'UNKNOWN',
          internetStatus: 'UNKNOWN',
          phoneStatus: 'UNKNOWN',
          createdAt: undefined,
          updatedAt: undefined,
          deletedAt: undefined,
          isVerified: false
        }
      ]);
      await expect(service.createBulk(dtos)).rejects.toThrow(
        new RpcException('Wallet should be unique'),
      );
    });

    it('should successfully create beneficiaries and emit event', async () => {
      const dtos = [
        { piiData: { phone: '123456789' }, walletAddress: 'wallet_1', uuid: 'uuid1' as `${string}-${string}-${string}-${string}-${string}` },
        { piiData: { phone: '987654321' }, walletAddress: 'wallet_2', uuid: 'uuid2' as `${string}-${string}-${string}-${string}-${string}` },
      ];
      jest.spyOn(service, 'checkPhoneNumber').mockResolvedValue([]);
      jest.spyOn(service, 'checkWalletAddress').mockResolvedValue([]);
      uuidv4.mockReturnValueOnce('uuid1').mockReturnValueOnce('uuid2' as `${string}-${string}-${string}-${string}-${string}`);
      prisma.beneficiary.findMany = jest.fn().mockResolvedValue([
        {
          uuid: 'uuid1',
          id: 1,
          pii: {
            phone: '123456789',
          },
        },
        {
          uuid: 'uuid2',
          id: 2,
          pii: {
            phone: '987654321',
          },
        },
      ]);
      prisma.beneficiary.createMany = jest.fn().mockResolvedValue({ count: 2 });
      prisma.beneficiaryPii.createMany = jest.fn().mockResolvedValue({ count: 2 });
      const result = await service.createBulk(dtos, 'projectUuid');
      expect(prisma.beneficiary.createMany).toHaveBeenCalledWith({
        data: [
          { uuid: 'uuid1', walletAddress: 'wallet_1' },
          { uuid: 'uuid2', walletAddress: 'wallet_2' },
        ],
      });
      expect(prisma.beneficiaryPii.createMany).toHaveBeenCalledWith({
        data: [
          { beneficiaryId: 1, phone: '123456789' },
          { beneficiaryId: 2, phone: '987654321' },
        ],
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('beneficiary.created', { projectUuid: 'projectUuid' });
      expect(result).toEqual({
        success: true,
        count: 2,
        beneficiariesData: [
          {
            uuid: 'uuid1',
            id: 1,
            pii: {
              phone: '123456789',
            },
          },
          {
            uuid: 'uuid2',
            id: 2,
            pii: {
              phone: '987654321',
            },
          },
        ],
      });
    });

    it('should handle error during beneficiary creation', async () => {
      const dtos = [
        { piiData: { phone: '123456789' }, walletAddress: 'wallet_1', uuid: 'uuid1' as `${string}-${string}-${string}-${string}-${string}` },
        { piiData: { phone: '987654321' }, walletAddress: 'wallet_2', uuid: 'uuid2' as `${string}-${string}-${string}-${string}-${string}` },
      ];
      jest.spyOn(service, 'checkPhoneNumber').mockResolvedValue([]);
      jest.spyOn(service, 'checkWalletAddress').mockResolvedValue([]);
      (prisma.beneficiary.createMany as jest.Mock).mockRejectedValue(new Error('Database error'));
      await expect(service.createBulk(dtos)).rejects.toThrow(
        new RpcException(new BadRequestException('Error in creating beneficiaries')),
      );
    });
  });

  describe('addGroup', () => {
    const mockResponse = {
      name: "Group Name",
      beneficiaries: [
        {
          uuid: "uuid" as `${string}-${string}-${string}-${string}-${string}`
        }
      ]
    };
  
    it('should add beneficiary to a group', async () => {
      const groupMockResponse = {
        uuid: 'mock-group-uuid'
      };
  
      (prisma.beneficiaryGroup.create as jest.Mock).mockResolvedValue(groupMockResponse);
      (prisma.groupedBeneficiaries.createMany as jest.Mock).mockResolvedValue(mockResponse);
  
      const result = await service.addGroup(mockResponse);
      console.log(result, 'result add group');
  
      expect(prisma.beneficiaryGroup.create).toHaveBeenCalledWith({
        data: {
          name: mockResponse.name
        }
      });
  
      const expectedCreateManyPayload = mockResponse.beneficiaries.map((d) => ({
        beneficiaryGroupId: groupMockResponse.uuid,
        beneficiaryId: d.uuid
      }));
  
      expect(prisma.groupedBeneficiaries.createMany).toHaveBeenCalledWith({
        data: expectedCreateManyPayload
      });
      expect(result).toEqual(mockResponse);
    });
  });

  // describe('getAllGroups', () => {
  //   it('should return lists of beneficiaries', async () => {
  //     const mockResponse = [
  //       {
  //         id: 1,
  //         uuid: "4a5d5ab1-1ecf-4b0d-92b0-e4befc628cfa",
  //         name: "Group Name",
  //         createdAt: "2024-09-05T15:42:22.276Z",
  //         updatedAt: "2024-09-05T15:42:22.276Z",
  //         deletedAt: null,
  //         _count: {
  //           groupedBeneficiaries: 1
  //         },
  //         beneficiaryGroupProject: [],
  //         groupedBeneficiaries: [
  //           {
  //             id: 1,
  //             uuid: "c5ec9c73-5e89-4514-a6df-27948785d9e2",
  //             beneficiaryGroupId: "4a5d5ab1-1ecf-4b0d-92b0-e4befc628cfa",
  //             beneficiaryId: "7feb9385-f7c4-4548-a332-ffc25ce29604",
  //             createdAt: "2024-09-05T15:42:22.315Z",
  //             updatedAt: "2024-09-05T15:42:22.315Z",
  //             deletedAt: null,
  //             Beneficiary: {
  //               id: 1,
  //               uuid: "7feb9385-f7c4-4548-a332-ffc25ce29604",
  //               gender: "FEMALE",
  //               walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  //               birthDate: "1997-03-08T00:00:00.000Z",
  //               age: 20,
  //               location: "lalitpur",
  //               latitude: 26.24,
  //               longitude: 86.24,
  //               extras: {
  //                 email: "test@mailinator.com",
  //                 hasCitizenship: true,
  //                 passportNumber: "1234567"
  //               },
  //               notes: "9785623749",
  //               bankedStatus: "BANKED",
  //               internetStatus: "HOME_INTERNET",
  //               phoneStatus: "FEATURE_PHONE",
  //               createdAt: "2024-09-03T16:15:32.098Z",
  //               updatedAt: "2024-09-03T16:15:32.098Z",
  //               deletedAt: null,
  //               isVerified: false,
  //               pii: {
  //                 beneficiaryId: 1,
  //                 name: "Ram Shrestha",
  //                 phone: "98670023857",
  //                 email: null,
  //                 extras: {
  //                   bank: "Laxmi Bank",
  //                   account: "9872200001"
  //                 }
  //               }
  //             }
  //           }
  //         ]
  //       }
  //     ];
  //   });
  // });

  describe('getOneGroup', () => {
    const mockResponse = {
      id: 1,
      uuid: "benef-uuid" as `${string}-${string}-${string}-${string}-${string}`,
      name: "Group Name",
      createdAt: "2024-09-05T15:42:22.276Z",
      updatedAt: "2024-09-05T15:42:22.276Z",
      deletedAt: null,
      groupedBeneficiaries: [
        {
          id: 1,
          uuid: "c5ec9c73-5e89-4514-a6df-27948785d9e2",
          beneficiaryGroupId: "benef-uuid" as `${string}-${string}-${string}-${string}-${string}`,
          beneficiaryId: "benef-id" as `${string}-${string}-${string}-${string}-${string}`,
          createdAt: "2024-09-05T15:42:22.315Z",
          updatedAt: "2024-09-05T15:42:22.315Z",
          deletedAt: null,
          Beneficiary: {
            id: 1,
            uuid: "7feb9385-f7c4-4548-a332-ffc25ce29604",
            gender: "FEMALE",
            walletAddress: "wallet",
            birthDate: "1997-03-08T00:00:00.000Z",
            age: 20,
            location: "lalitpur",
            latitude: 26.24,
            longitude: 86.24,
            extras: {
              email: "test@mailinator.com",
              hasCitizenship: true,
              passportNumber: "1234567"
            },
            notes: "9785623749",
            bankedStatus: "BANKED",
            internetStatus: "HOME_INTERNET",
            phoneStatus: "FEATURE_PHONE",
            createdAt: "2024-09-03T16:15:32.098Z",
            updatedAt: "2024-09-03T16:15:32.098Z",
            deletedAt: null,
            isVerified: false,
            pii: {
              beneficiaryId: 1,
              name: "Ram Shrestha",
              phone: "98670023857",
              email: null,
              extras: {
                bank: "Laxmi Bank",
                account: "9872200001"
              }
            }
          }
        }
      ]
    };
    it('should return the details of specific group using uuid', async () => {
      (prisma.beneficiaryGroup.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      const result = await service.getOneGroup(mockResponse.uuid);
      expect(prisma.beneficiaryGroup.findUnique).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        },
        include: {
          groupedBeneficiaries: {
            include: {
              Beneficiary: {
                include: {
                  pii: true
                }
              }
            },
            where: {
              deletedAt: null
            }
          }
        }
      });
    });
  });

  describe('removeOneGroup', () => {
    const mockResponse = {
      id: 2,
      uuid: "abc",
      name: "Test Group",
      createdAt: "2024-09-08T08:48:51.390Z",
      updatedAt: "2024-09-08T08:49:11.653Z",
      deletedAt: null
    }
    it('should remove a group as per uuid', async () => {
      (prisma.beneficiaryGroup.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      (prisma.beneficiaryGroup.update as jest.Mock).mockResolvedValue(mockResponse);
      await service.removeOneGroup(mockResponse.uuid);
      expect(prisma.beneficiaryGroup.findUnique).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid,
          deletedAt: mockResponse.deletedAt
        }
      });
      expect(prisma.beneficiaryGroup.update).toHaveBeenCalledWith({
        where: {
          uuid: mockResponse.uuid
        },
        data: {
          deletedAt: expect.any(Date)
        }
      });
    });

    it('should throw an error if group is not found', async () => {
      (prisma.beneficiaryGroup.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.removeOneGroup(mockResponse.uuid)).rejects.toThrow(
        new RpcException('Beneficiary group not found or already deleted.')
      );
    });
  });
});
