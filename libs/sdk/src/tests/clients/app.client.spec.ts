import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { formatResponse } from '@rumsan/sdk/utils';
import { TAuthApp } from '../../app';
import { AppClient } from '../../types/app.types';
import { getAppClient } from '../../clients/app.client';
import { Pagination } from '@rumsan/sdk/types';

const mockAxios: jest.Mocked<AxiosInstance> = {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
} as any;
  
jest.mock('@rumsan/sdk/utils', () => ({
    formatResponse: jest.fn(),
}));

const appUrl = {
    createAuthApp: '/app/auth-apps',
    updateAuthApp: (uuid: string) => `/app/auth-apps/${uuid}`,
    listAuthApps: '/app/auth-apps',
    getAuthApp: (uuid: string) => `/app/auth-apps/${uuid}`,
    softDeleteAuthApp: (uuid: string) => `/app/auth-apps/${uuid}`,
}

describe('AppClient', () => {
    const client: AppClient = getAppClient(mockAxios);

    describe('createAuthApp', () => {
        it('should create new auth app', async () => {
            const mockRequest: TAuthApp = {
                name: "Community Tool",
                address: "0x00",
                description: "This is app desc",
                nonceMessage: "HelloWorld",
                createdBy: "0x00"
            };
            const mockResponse: TAuthApp = {
                uuid: 'uuid' as `${string}-${string}-${string}-${string}-${string}`,
                name: "Community Tool",
                description: "This is app desc",
                nonceMessage: "HelloWorld",
                address: "0x00",
                createdBy: "abc",
                createdAt: new Date("2024-09-12T04:57:05.255Z"),
                updatedAt: new Date("2024-09-12T04:57:05.255Z"),
                deletedAt: null
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
            mockAxios.post.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.createAuthApp(mockRequest, mockConfig);
            expect(mockAxios.post).toHaveBeenCalledWith(appUrl.createAuthApp, mockRequest, mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateAuthApp', () => {
        it('should update the auth app as per uuid', async () => {
            const mockRequest: TAuthApp = {
                name: "Updated Name",
                description: "Updated Description",
                nonceMessage: "Ipdated NonceMessage"
            };
            const mockResponse: TAuthApp= {
                uuid: 'uuid' as `${string}-${string}-${string}-${string}-${string}`,
                name: "Updated Name",
                description: "Updated Description",
                nonceMessage: "Updated NonceMessage",
                address: "0x00",
                createdBy: "abc",
                createdAt: new Date("2024-09-12T04:57:05.255Z"),
                updatedAt: new Date("2024-09-12T04:57:05.255Z"),
                deletedAt: null
            };
            const mockDto = {
                uuid: 'uuid' as`${string}-${string}-${string}-${string}-${string}`,
                data: mockRequest
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
            mockAxios.put.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.updateAuthApp(mockDto, mockConfig);
            expect(mockAxios.put).toHaveBeenCalledWith(appUrl.updateAuthApp(mockResponse.uuid), mockDto.data, mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('listAuthApps', () => {
        it('should list all the auth apps', async () => {
            const queryParams: Pagination = {
                page: 1,
                perPage: 10,
                sort: 'createdAt',
                order: 'asc'
            };
            const mockResponse: TAuthApp[] = [
                {
                    uuid: 'uuid' as `${string}-${string}-${string}-${string}-${string}`,
                    address: "0x00",
                    name: "Updated Name",
                    description: "Updated Description",
                    nonceMessage: "Updated NonceMessage",
                    createdBy: "abc",
                    createdAt: new Date("2024-09-12T04:57:05.255Z"),
                    updatedAt: new Date("2024-09-12T04:57:05.255Z"),
                    deletedAt: null
                },
                {
                    uuid: 'uuid' as `${string}-${string}-${string}-${string}-${string}`,
                    address: "0x0000",
                    name: "Updated Name Two",
                    description: "Updated Description Two",
                    nonceMessage: "Updated NonceMessage Two",
                    createdBy: "xyz",
                    createdAt: new Date("2024-09-12T04:57:05.255Z"),
                    updatedAt: new Date("2024-09-12T04:57:05.255Z"),
                    deletedAt: null
                }
            ];
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
            mockAxios.get.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.listAuthApps(queryParams, mockConfig);
            expect(mockAxios.get).toHaveBeenCalledWith(appUrl.listAuthApps, {
                params: queryParams, ...mockConfig
            });
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getAuthApp', () => {
        it('should return the details of auth app as per uuid', async () => {
            const mockResponse = {
                uuid: 'uuid' as `${string}-${string}-${string}-${string}-${string}`,
                address: "0x00",
                name: "Updated Name",
                description: "Updated Description",
                nonceMessage: "Updated NonceMessage",
                createdBy: "abc",
                createdAt: new Date("2024-09-12T04:57:05.255Z"),
                updatedAt: new Date("2024-09-12T04:57:05.255Z"),
                deletedAt: null
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
            mockAxios.get.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.getAuthApp(mockResponse.uuid, mockConfig);
            expect(mockAxios.get).toHaveBeenCalledWith(appUrl.getAuthApp(mockResponse.uuid), mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('softDeleteAuthApp', () => {
        it('should soft delete an auth app as per uuid', async () => {
            const mockResponse: TAuthApp = {
                uuid: 'uuid' as `${string}-${string}-${string}-${string}-${string}`,
                address: "0x00",
                name: "Updated Name",
                description: "Updated Description",
                nonceMessage: "Updated NonceMessage",
                createdBy: "abc",
                createdAt: new Date("2024-09-12T04:57:05.255Z"),
                updatedAt: new Date("2024-09-12T04:57:05.255Z"),
                deletedAt: new Date("2024-09-12T06:11:33.812Z")
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
            mockAxios.delete.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.softDeleteAuthApp(mockResponse.uuid, mockConfig);
            expect(mockAxios.delete).toHaveBeenCalledWith(appUrl.softDeleteAuthApp(mockResponse.uuid), mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });
});