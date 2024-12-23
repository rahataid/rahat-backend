import { Pagination, Setting } from '@rumsan/sdk/types';
import { SettingClient } from '../../types/settings.clients.types';
import { SettingList, SettingResponse } from '../../settings/settings.types';
import { getSettingsClient } from '../../clients/settings.client';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { formatResponse } from '@rumsan/sdk/utils';

const mockAxios: jest.Mocked<AxiosInstance> = {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn()
} as any;
  
jest.mock('@rumsan/sdk/utils', () => ({
    formatResponse: jest.fn(),
}));

const settingsUrl = {
    create: '/settings',
    get: '/settings',
    update: (settingName: string) => `/settings/${settingName}`,
    getByName: (settingName: string) => `/settings/${settingName}`
};

describe('SettingsClient', () => {
    const client:SettingClient = getSettingsClient(mockAxios);

    describe('create', () => {
        it('should create settings with necessary details', async () => {
            const mockRequest: Setting = {
                name: "TEST",
                value: {
                    host: "test.gmail.com",
                    Port: 111,
                    secure: true,
                    username: "test",
                    password: "test"
                },
                requiredFields: [
                    "host",
                    "port",
                    "secure",
                    "username",
                    "PASSWORD"
                ],
                isReadOnly: false,
                isPrivate: true
            };
            const mockResponse: SettingList = {
                sucess: true,
                data: mockRequest
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
            mockAxios.post.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.create(mockRequest, mockConfig);
            expect(mockAxios.post).toHaveBeenCalledWith(settingsUrl.create, mockRequest, mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('listSettings', () => {
        it('should return list of settings', async () => {
            const queryParams:Pagination = {
                sort: 'createdAt',
                order: 'asc',
                page: 1,
                perPage: 10
            };
            const mockResponse:SettingList = {
                sucess: true,
                data: [
                    {
                        name: "TEST_ABC",
                        dataType: "STRING",
                        isPrivate: true,
                        isReadOnly: false,
                        requiredFields: [
                            "HOST",
                            "PORT",
                            "SECURE",
                            "USERNAME",
                            "PASSWORD"
                        ],
                        value: {
                            host: "test_abc.gmail.com",
                            Port: 111,
                            secure: true,
                            username: "test",
                            password: "test"
                        }
                    },
                    {
                        name: "TEST",
                        dataType: "STRING",
                        isPrivate: true,
                        isReadOnly: false,
                        requiredFields: [
                            "HOST",
                            "PORT",
                            "SECURE",
                            "USERNAME",
                            "PASSWORD"
                        ],
                        value: {
                            host: "test.gmail.com",
                            Port: 111,
                            secure: true,
                            username: "test",
                            password: "test"
                        }
                    }
                ]
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }, params: queryParams};
            mockAxios.get.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.listSettings(queryParams, mockConfig);
            expect(mockAxios.get).toHaveBeenCalledWith(settingsUrl.get, mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('update', () => {
        it('should update the settings detail as per uuid', async () => {
            const mockRequest:Setting = {
                name: "SMTPS",
                value: {
                    username: "xyz",
                    password: "12345"
                },
                requiredFields: [
                    "username",
                    "password"
                ],
                isPrivate: false,
                isReadOnly: true
            };

            const mockResponse:SettingResponse = {
                    name: "SMTPS",
                    value: {
                        password: "12345",
                        username: "xyz"
                    },
                    dataType: "OBJECT",
                    requiredFields: [
                        "username",
                        "password"
                    ],
                    isReadOnly: true,
                    isPrivate: false
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
            mockAxios.patch.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.update(mockRequest, mockConfig);
            expect(mockAxios.patch).toHaveBeenCalledWith(settingsUrl.update(mockRequest.name), mockRequest, mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getByName', () => {
        it('should return seting as per name', async () => {
            const mockResponse: SettingResponse = {
                name: "SMTPS",
                dataType: "OBJECT",
                isPrivate: false,
                isReadOnly: true,
                requiredFields: [
                    "username",
                    "password"
                ],
                value: {
                    password: "12345",
                    username: "xyz"
                }
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
            mockAxios.get.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.getByName(mockResponse.name, mockConfig);
            expect(mockAxios.get).toHaveBeenCalledWith(settingsUrl.getByName(mockResponse.name), mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });
});
