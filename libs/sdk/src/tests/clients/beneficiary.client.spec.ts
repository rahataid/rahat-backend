import { getBeneficiaryClient } from '../../clients/beneficiary.client';
import { Beneficiary, TPIIData } from '../../beneficiary';
import { Pagination } from '@rumsan/sdk/types';
import { randomUUID } from 'crypto';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { formatResponse } from '@rumsan/sdk/utils';
import { Stats } from '../../types';
import { BankedStatus, Gender, InternetStatus, PhoneStatus } from '@rahataid/sdk/enums';

const mockAxios: jest.Mocked<AxiosInstance> = {
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  put: jest.fn()
} as any;

jest.mock('@rumsan/sdk/utils', () => ({
  formatResponse: jest.fn(),
}));

const beneficiaryUrl = {
  create: '/beneficiaries',
  createBulk: '/beneficiaries/bulk',
  getStats: '/beneficiaries/stats',
  list: '/beneficiaries',
  listPiiData: '/beneficiaries/pii',
  get: (uuid: string) => `/beneficiaries/${uuid}`,
  update: (uuid: string) => `/beneficiaries/${uuid}`,
  getByPhone: (phone: string) => `/beneficiaries/phone/${phone}`,
  importTempBeneficiaries: '/beneficiaries/import-temp'
};

describe('BeneficiaryClient', () => {
  const client = getBeneficiaryClient(mockAxios);

  describe('create', () => {
    it('should create a new beneficiary', async () => {
      const mockRequest: Beneficiary = {
        birthDate: new Date('2024-09-05T06:27:57.136Z'),
        age: 20,
        gender: Gender.FEMALE,
        location: 'abc',
        latitude: 26.24,
        longitude: 86.24,
        notes: 'notes',
        walletAddress: '0x00',
        extras: {
          hasCitizenship: true,
          passportNumber: '1234567',
          email: 'test@mailinator.com',
        },
        bankedStatus: BankedStatus.BANKED,
        internetStatus: InternetStatus.HOME_INTERNET,
        phoneStatus: PhoneStatus.NO_PHONE,
        piiData: {
          name: 'Test Test',
          phone: '9800000',
          extras: {
            bank: 'Bank',
            account: 'account',
          },
        },
      };
      const mockResponse: Beneficiary = {
        uuid: "uuid" as `${string}-${string}-${string}-${string}-${string}`,
        gender: Gender.FEMALE,
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        birthDate: new Date('2024-09-05T06:27:57.136Z'),
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
        bankedStatus: BankedStatus.BANKED,
        internetStatus: InternetStatus.HOME_INTERNET,
        phoneStatus: PhoneStatus.NO_PHONE,
        createdAt: new Date("2024-09-18T10:11:32.878Z"),
        updatedAt: new Date("2024-09-18T10:11:32.878Z"),
        deletedAt: null
      };
      const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
      mockAxios.post.mockResolvedValue(mockResponse);
      (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
      const result = await client.create(mockRequest as Beneficiary, mockConfig);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith(beneficiaryUrl.create, mockRequest, mockConfig);
      expect(formatResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createBulk', () => {
    it('should create beneficiaries in bulk', async () => {
        const mockRequest: Beneficiary[] = [
          {
            birthDate: new Date('2024-09-05T06:27:57.136Z'),
            age: 20,
            gender: Gender.FEMALE,
            location: 'abc',
            latitude: 26.24,
            longitude: 86.24,
            notes: 'notes',
            walletAddress: '0x00',
            extras: {
              hasCitizenship: true,
              passportNumber: '1234567',
              email: 'test@mailinator.com',
            },
            bankedStatus: BankedStatus.BANKED,
            internetStatus: InternetStatus.HOME_INTERNET,
            phoneStatus: PhoneStatus.NO_PHONE,
            piiData: {
              name: 'Test Test',
              phone: '9800000',
              extras: {
                bank: 'Bank',
                account: 'account',
              },
            },
          },
          {
            birthDate: new Date('2024-09-05T06:27:57.136Z'),
            age: 20,
            gender: Gender.FEMALE,
            location: 'xyz',
            latitude: 26.24,
            longitude: 86.24,
            notes: 'notes',
            walletAddress: '0x0000',
            extras: {
              hasCitizenship: true,
              passportNumber: '1234567',
              email: 'test@mailinator.com',
            },
            bankedStatus: BankedStatus.BANKED,
            internetStatus: InternetStatus.HOME_INTERNET,
            phoneStatus: PhoneStatus.NO_PHONE,
            piiData: {
              name: 'Test Test',
              phone: '9800000',
              extras: {
                bank: 'Bank',
                account: 'account',
              },
            },
          }];
        const mockResponse: Beneficiary[] = [
          {
            uuid: "uuid" as `${string}-${string}-${string}-${string}-${string}`,
            gender: Gender.FEMALE,
            walletAddress: "0x00",
            birthDate: new Date('2024-09-05T06:27:57.136Z'),
            age: 20,
            location: "abc",
            latitude: 26.24,
            longitude: 86.24,
            extras: {
              email: "test@mailinator.com",
              hasCitizenship: true,
              passportNumber: "1234567"
            },
            notes: "notes",
            bankedStatus: BankedStatus.BANKED,
            internetStatus: InternetStatus.HOME_INTERNET,
            phoneStatus: PhoneStatus.NO_PHONE,
            createdAt: new Date("2024-09-18T10:11:32.878Z"),
            updatedAt: new Date("2024-09-18T10:11:32.878Z"),
            deletedAt: null
          },
          {
            uuid: "uuid" as `${string}-${string}-${string}-${string}-${string}`,
            gender: Gender.FEMALE,
            walletAddress: "0x0000",
            birthDate: new Date('2024-09-05T06:27:57.136Z'),
            age: 20,
            location: "xyz",
            latitude: 26.24,
            longitude: 86.24,
            extras: {
              email: "test@mailinator.com",
              hasCitizenship: true,
              passportNumber: "1234567"
            },
            notes: "notes",
            bankedStatus: BankedStatus.BANKED,
            internetStatus: InternetStatus.HOME_INTERNET,
            phoneStatus: PhoneStatus.NO_PHONE,
            createdAt: new Date("2024-09-18T10:11:32.878Z"),
            updatedAt: new Date("2024-09-18T10:11:32.878Z"),
            deletedAt: null
          }
        ];
        const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
        mockAxios.post.mockResolvedValue(mockResponse);
        (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
        const result = await client.createBulk(mockRequest as Beneficiary[], mockConfig);
        expect(mockAxios.post).toHaveBeenCalledWith(beneficiaryUrl.createBulk, mockRequest, mockConfig);
        expect(formatResponse).toHaveBeenCalledWith(mockResponse);
        expect(result).toEqual(mockResponse);
    });
  });

  describe('getStats', () => {
    it('should return list of stats', async () => {
      const mockResponse: Stats[] = [
        {
          name: "BENEFICIARY_BANKEDSTATUS",
          data: [
            {
              id: "BANKED",
              count: 2
              }
            ]
        },
        {
          name: "BENEFICIARY_AGE_RANGE",
          data: [
            {
              id: "0-20",
              count: 2
            },
            {
              id: "20-40",
              count: 0
            },
          ]
        }
      ];
      const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
      mockAxios.get.mockResolvedValue(mockResponse);
      (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
      const result = await client.getStats(mockConfig);
      expect(mockAxios.get).toHaveBeenCalledWith(beneficiaryUrl.getStats, mockConfig);
      expect(formatResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('list', () => {
    it('should return list of beneficiaries', async () => {
      const paramData:Pagination = {
        order: "asc",
        page: 1,
        perPage: 10,
        sort: "gender"
      };
      const mockResponse: Beneficiary[] = [
          {
            uuid: randomUUID(),
            gender: Gender.FEMALE,
            walletAddress: "0x00",
            birthDate: new Date("1997-03-08T00:00:00.000Z"),
            age: 20,
            location: "xyz",
            latitude: 26.24,
            longitude: 86.24,
            extras: {
              email: "test@mailinator.com",
              hasCitizenship: true,
              passportNumber: "1234567"
            },
            notes: "9785623749",
            bankedStatus: BankedStatus.BANKED,
            internetStatus: InternetStatus.NO_INTERNET,
            phoneStatus: PhoneStatus.SMART_PHONE,
            createdAt: new Date("2024-09-03T16:15:32.098Z"),
            updatedAt: new Date("2024-09-03T16:15:32.098Z"),
            deletedAt: null,
            piiData: {
              beneficiaryId: 1,
              name: "ABC",
              phone: "9898",
              email: null,
              extras: {
                bank: "Bank",
                account: "9872200001"
              }
            }
          },
          {
            uuid: randomUUID(),
            gender: Gender.MALE,
            walletAddress: "0x00",
            birthDate: new Date("1997-03-08T00:00:00.000Z"),
            age: 20,
            location: "abc",
            latitude: 26.24,
            longitude: 86.24,
            extras: {
              email: "test@mailinator.com",
              hasCitizenship: true,
              passportNumber: "1234567"
            },
            notes: "9785623749",
            bankedStatus: BankedStatus.BANKED,
            internetStatus: InternetStatus.NO_INTERNET,
            phoneStatus: PhoneStatus.FEATURE_PHONE,
            createdAt: new Date("2024-09-03T16:15:32.098Z"),
            updatedAt: new Date("2024-09-03T16:15:32.098Z"),
            deletedAt: null,
            piiData: {
              beneficiaryId: 1,
              name: "XYZ",
              phone: "989898",
              email: null,
              extras: {
                bank: "Bank",
                account: "9872200001"
              }
            }
          }
      ];
      const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
      mockAxios.get.mockResolvedValue(mockResponse);
      (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
      const result = await client.list(paramData, mockConfig); 
      expect(mockAxios.get).toHaveBeenCalledWith(beneficiaryUrl.list, { params: paramData, ...mockConfig } );
      expect(formatResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('listPiiData', () => {
    it('should return list of beneficiary piiData', async () => {
      const mockResponse:TPIIData[] = [
        {
          beneficiaryId: 1,
          name: "ABC",
          phone: "9898",
          email: null,
          extras: {
            bank: "Bank",
            account: "9872200001"
          }
          },
          {
            beneficiaryId: 2,
            name: "XYZ",
            phone: "989898",
            email: null,
            extras: {
              bank: "Bank",
              account: "9872200001"
            }
          }
        ];
      const paramData: Pagination = {
        order: "asc",
        page: 1,
        perPage: 10,
        sort: "gender"
      };
      const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }, params: paramData};
      mockAxios.get.mockResolvedValue(mockResponse);
      (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
      const result = await client.listPiiData(paramData, mockConfig);
      expect(mockAxios.get).toHaveBeenCalledWith(beneficiaryUrl.listPiiData, { params: paramData, ...mockConfig });
      expect(formatResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('get', () => {
    it('should return specific beneficiary as per UUID', async () => {
      const mockResponse:Beneficiary = {
        uuid: randomUUID(),
        gender: Gender.FEMALE,
        walletAddress: "0x00",
        birthDate: new Date("1997-03-08T00:00:00.000Z"),
        age: 20,
        location: "xyz",
        latitude: 26.24,
        longitude: 86.24,
        extras: {
          email: "test@mailinator.com",
          hasCitizenship: true,
          passportNumber: "1234567"
        },
        notes: "9785623749",
        bankedStatus: BankedStatus.BANKED,
        internetStatus: InternetStatus.NO_INTERNET,
        phoneStatus: PhoneStatus.SMART_PHONE,
        createdAt: new Date("2024-09-03T16:15:32.098Z"),
        updatedAt: new Date("2024-09-03T16:15:32.098Z"),
        deletedAt: null,
        piiData: {
          beneficiaryId: 1,
          name: "ABC",
          phone: "9898",
          email: null,
          extras: {
            bank: "Bank",
            account: "9872200001"
          }
        }
      };
      const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
      const result = await client.get(mockResponse.uuid, mockConfig);
      expect(mockAxios.get).toHaveBeenCalledWith(beneficiaryUrl.get(mockResponse.uuid), mockConfig );
      expect(formatResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update the specific beneficiary details as per uuid', async () => {
      const dto = {
        age: 28,
        extras: {
          hasCitizenship: false
        },
        piiData: {
          phone: '9898848498'
        }
      };
      const mockResponse:Beneficiary = {
        uuid: randomUUID(),
        gender: Gender.FEMALE,
        walletAddress: "0x00",
        birthDate: new Date("1997-03-08T00:00:00.000Z"),
        age: 28,
        location: "xyz",
        latitude: 26.24,
        longitude: 86.24,
        extras: {
          email: "test@mailinator.com",
          hasCitizenship: false,
          passportNumber: "1234567"
        },
        notes: "9785623749",
        bankedStatus: BankedStatus.BANKED,
        internetStatus: InternetStatus.NO_INTERNET,
        phoneStatus: PhoneStatus.SMART_PHONE,
        createdAt: new Date("2024-09-03T16:15:32.098Z"),
        updatedAt: new Date("2024-09-03T16:15:32.098Z"),
        deletedAt: null,
        piiData: {
          beneficiaryId: 1,
          name: "ABC",
          phone: "9898848498",
          email: null,
          extras: {
            bank: "Bank",
            account: "9872200001"
          }
        }
      };
      const updateDto = {
        uuid: mockResponse.uuid,
        data: dto
      };
      const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
      mockAxios.put.mockResolvedValue(mockResponse);
      (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
      const result = await client.update(updateDto, mockConfig);
      expect(mockAxios.put).toHaveBeenCalledWith(beneficiaryUrl.update(mockResponse.uuid), updateDto.data, mockConfig);
      expect(formatResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getByPhone', () => {
    it('should return details of specific beneficiary as per phone number', async () => {
      const mockResponse:Beneficiary = {
        uuid: randomUUID(),
        gender: Gender.FEMALE,
        walletAddress: "0x00",
        birthDate: new Date("1997-03-08T00:00:00.000Z"),
        age: 20,
        location: "xyz",
        latitude: 26.24,
        longitude: 86.24,
        extras: {
          email: "test@mailinator.com",
          hasCitizenship: true,
          passportNumber: "1234567"
        },
        notes: "9785623749",
        bankedStatus: BankedStatus.BANKED,
        internetStatus: InternetStatus.NO_INTERNET,
        phoneStatus: PhoneStatus.SMART_PHONE,
        createdAt: new Date("2024-09-03T16:15:32.098Z"),
        updatedAt: new Date("2024-09-03T16:15:32.098Z"),
        deletedAt: null,
        piiData: {
          beneficiaryId: 1,
          name: "ABC",
          phone: "9898",
          email: null,
          extras: {
            bank: "Bank",
            account: "9872200001"
          }
        }
      };
      const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
      const result = await client.getByPhone(mockResponse.piiData.phone, mockConfig);
      expect(mockAxios.get).toHaveBeenCalledWith(beneficiaryUrl.getByPhone(mockResponse.piiData.phone), mockConfig );
      expect(formatResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('importTempBeneficiaries', () => {
    it('should import beneficiaries from temp', async () => {
      const mockRequest = {
        groupUUID: randomUUID()
      };
      const mockResponse = {
        success: true,
        data: {
          message: "Beneficiaries added to the queue!"
        }
      };
      const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
      mockAxios.post.mockResolvedValue(mockResponse);
      (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
      const result = await client.importTempBeneficiaries(mockRequest, mockConfig);
      expect(mockAxios.post).toHaveBeenCalledWith(beneficiaryUrl.importTempBeneficiaries, mockRequest, mockConfig);
      expect(formatResponse).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(mockResponse);
    });
  });
});