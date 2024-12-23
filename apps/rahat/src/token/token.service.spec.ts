import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { PrismaService } from '@rumsan/prisma';
import { CreateTokenDto } from '@rahataid/extensions';

describe('TokenService', () => {
  let service: TokenService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: PrismaService,
          useValue: {
            token: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            }
          }
        }
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post token', () => {
    it('should provide token after necessary fields has been filled out', async () => {
      const mockRequest = {
        name: "ABCDE",
        symbol: "XYZ",
        description: "This is description of ABCDE.",
        decimals: 1,
        initialSupply: 1,
        fromBlock: 1,
        contractAddress: "0x0000",
        transactionHash: "0x0000",
        type: "CREATED"
      };
      (prisma.token.create as jest.Mock).mockResolvedValue(mockRequest);
      const result = await service.create(mockRequest as CreateTokenDto);
      console.log(result, 'result');
      expect(prisma.token.create).toHaveBeenCalledWith({
        data: mockRequest
      });
      expect(result).toBe(mockRequest);
    });
  });

  describe('findMany', () => {
    it('should return a list of tokens in descending order of creation time', async () => {
      const mockResponse = [
        {
          id: 1,
          uuid: "uuid",
          name: "ABCDE",
          symbol: "XYZ",
          description: "This is description of ABCDE.",
          decimals: 1,
          initialSupply: 1,
          fromBlock: 1,
          contractAddress: "0x0000",
          transactionHash: "0x0000",
          type: "CREATED",
          createdAt: "2024-08-30T15:57:23.451Z",
          updatedAt: "2024-08-30T15:57:23.451Z",
          createdBy: null,
          updatedBy: null
        },
        {
          id: 2,
          uuid: "uuid",
          name: "ABCDE",
          symbol: "XYZ",
          description: "This is description of ABCDE.",
          decimals: 1,
          initialSupply: 1,
          fromBlock: 1,
          contractAddress: "0x0000",
          transactionHash: "0x0000",
          type: "CREATED",
          createdAt: "2024-08-30T15:57:23.451Z",
          updatedAt: "2024-08-30T15:57:23.451Z",
          createdBy: null,
          updatedBy: null
        }
    ];
      (prisma.token.findMany as jest.Mock).mockResolvedValue(mockResponse);
      const result = await service.findAll();
      console.log(result, 'result in findAll');
      expect(result).toEqual(mockResponse);
      expect(prisma.token.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc'
        }
      });
    });
  });

  describe('findOne', () => {
    it('should return one specific token on the basis of contractAddress', async () => {
      const mockResponse = {
        id: 1,
        uuid: "uuid",
        name: "ABCDE",
        symbol: "XYZ",
        description: "This is description of ABCDE.",
        decimals: 1,
        initialSupply: 1,
        fromBlock: 1,
        contractAddress: "0x0000",
        transactionHash: "0x0000",
        type: "CREATED",
        createdAt: "2024-08-30T15:57:23.451Z",
        updatedAt: "2024-08-30T15:57:23.451Z",
        createdBy: null,
        updatedBy: null
      };
      const mockContractAdddress = mockResponse.contractAddress;
      (prisma.token.findUnique as jest.Mock).mockResolvedValue(mockResponse);
      const result = await service.findOne(mockContractAdddress);
      console.log(result, 'result findOne');
      expect(prisma.token.findUnique).toHaveBeenCalledWith({
        where: {
          contractAddress: mockContractAdddress
        }
      }) ;
      expect(result).toEqual(mockResponse);     
    });

    it('should return null if contractAddress is invalid', async () => {
      const mockContractAddress = 'invalid-contractAddress';
      (prisma.token.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.findOne(mockContractAddress);
      expect(result).toBeNull();
    });
  });
  
});
