import { Pagination } from "@rumsan/sdk/types";
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { formatResponse } from "@rumsan/sdk/utils";
import { getGrievanceClient } from '../../clients/grievance.client';
import { GrievanceClient } from "../../clients/grievance.client";
import { Grievance, GrievanceStatus, GrievanceType } from "@rahataid/sdk/grievance";

const mockAxios: jest.Mocked<AxiosInstance> = {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
} as any;
  
jest.mock('@rumsan/sdk/utils', () => ({
    FormattedResponse: jest.fn(),
    formatResponse: jest.fn(),
}));

const grievanceUrl = {
    create: '/grievances',
    list: '/grievances',
    changeStatus: (uuid: string) => `/grievances/${uuid}/change-status`,
    delete: (uuid: string) => `/grievances/${uuid}`
};

describe('GrievanceClient', () => {
    const client: GrievanceClient = getGrievanceClient(mockAxios); 

    describe('create', () => {
        it('should create new grievance with required data, config and formatted response', async () => {
            const mockRequest = {
                projectId: "uuid",
                reporterContact: "9898",
                title: "Grievance title",
                description: "Grievance description",
                type: GrievanceType.NON_TECHNICAL,
                status: GrievanceStatus.NEW,
                reportedBy: "abc"
            };
            const mockResponse:Grievance = {
                id: 1,
                reportedBy: "abc",
                reporterUserId: 1,
                reporterContact: "9898",
                title: "Grievance title",
                type: GrievanceType.NON_TECHNICAL,
                projectId: "uuid",
                description: "Grievance description",
                status: GrievanceStatus.NEW,
                createdAt: new Date ("2024-09-13T07:17:19.294Z"),
                updatedAt: new Date ("2024-09-13T07:17:19.294Z"),
                project: {
                    name: 'xyz',
                    uuid: 'projectUUID'
                },
                reporterUser: {
                    name: 'abc',
                    uuid: 'uuid',
                    id: 1
                }
            };
            const mockConfig:AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' }};
            mockAxios.post.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.create(mockRequest, mockConfig);
            expect(mockAxios.post).toHaveBeenCalledWith(grievanceUrl.create, mockRequest, mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('list', () => {
        it('should list all the grievances, config with formatted response', async () => {
            const mockResponse:Grievance[] = [{
                id: 1,
                reportedBy: "abc",
                reporterUserId: 1,
                reporterContact: "9898",
                title: "Grievance title",
                type: GrievanceType.NON_TECHNICAL,
                projectId: "uuid",
                description: "Grievance description",
                status: GrievanceStatus.NEW,
                createdAt: new Date ("2024-09-13T07:17:19.294Z"),
                updatedAt: new Date ("2024-09-13T07:17:19.294Z"),
                project: {
                    name: 'xyz',
                    uuid: 'projectUUID'
                },
                reporterUser: {
                    name: 'abc',
                    uuid: 'uuid',
                    id: 1
                }
            }];
            const mockPagination: Partial<Pagination> = {
                page: 1,
                perPage: 10,
                sort: 'createdAt',
                order: 'asc'
            };
            const mockConfig: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
            mockAxios.get.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.list(mockPagination, mockConfig);
            expect(mockAxios.get).toHaveBeenCalledWith(grievanceUrl.list, { params: mockPagination, ...mockConfig });
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('changeStatus', () => {
        it('should change status as per uuid and provide formatted response', async () => {
            const mockResponse:Grievance = {
                id: 1,
                reportedBy: "abc",
                reporterUserId: 1,
                reporterContact: "989898",
                title: "Updated title",
                type: GrievanceType.NON_TECHNICAL,
                projectId: "uuid",
                description: "Updated description",
                status: GrievanceStatus.NEW,
                createdAt: new Date ("2024-09-13T07:17:19.294Z"),
                updatedAt: new Date ("2024-09-13T07:17:19.294Z"),
                project: {
                    name: 'xyz',
                    uuid: 'projectUUID'
                },
                reporterUser: {
                    name: 'abc',
                    uuid: 'uuid',
                    id: 1
                }
            };
            const mockDto = {
                uuid: 'uuid' as `${string}-${string}-${string}-${string}-${string}`,
                data: 'NEW' as GrievanceStatus
            }
            const mockConfig: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
            mockAxios.patch.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.changeStatus(mockDto, mockConfig);
            expect(mockAxios.patch).toHaveBeenCalledWith(grievanceUrl.changeStatus(mockDto.uuid), mockDto.data, mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('delete', () => {
        it('should delete the grievance as per uuid with formatted response', async () => {
            const mockResponse = {
                id: 1,
                uuid: "uuid" as`${string}-${string}-${string}-${string}-${string}`,
                reportedBy: "abc",
                reporterUserId: 1,
                reporterContact: "9898",
                title: "Grievance title",
                type: "TECHNICAL",
                projectId: "projectId",
                description: "Grievance description",
                status: "NEW",
                createdAt: "2024-09-13T12:00:10.023Z",
                updatedAt: "2024-09-13T12:01:08.316Z",
                deletedAt: "2024-09-13T12:01:08.307Z"
            };
            const mockConfig: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };

            mockAxios.delete.mockResolvedValue(mockResponse);
            (formatResponse as jest.Mock).mockReturnValueOnce(mockResponse);
            const result = await client.delete(mockResponse.uuid, mockConfig);
            expect(mockAxios.delete).toHaveBeenCalledWith(grievanceUrl.delete(mockResponse.uuid), mockConfig);
            expect(formatResponse).toHaveBeenCalledWith(mockResponse);
            expect(result).toEqual(mockResponse);
        });
    });
});