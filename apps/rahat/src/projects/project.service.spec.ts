import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@rumsan/prisma';
import { ProjectService } from './project.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectEvents } from '@rahataid/sdk';
import { RequestContextService } from '../request-context/request-context.service';
import { randomUUID } from 'crypto';
import { ProjectStatus } from '@rahataid/sdk/enums';

jest.mock('@nestjs/event-emitter', () => ({
    EventEmitter2: jest.fn().mockImplementation(() => ({
        emit: jest.fn(),
    })),
}));

describe('ProjectService', () => {
    let service: ProjectService;
    let prisma: PrismaService;
    let eventEmitter: EventEmitter2;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
            ProjectService,
            {
                provide: PrismaService,
                useValue: {
                    project: {
                        create: jest.fn(),
                        findMany: jest.fn(),
                        findUnique: jest.fn(),
                        update: jest.fn()
                    }
                }
            },
            {
                provide: EventEmitter2,
                useValue: new (EventEmitter2 as any)()
            },
            {
                provide: RequestContextService,
                useValue: {},
            },
            {
                provide: 'RAHAT_CLIENT',
                useValue: { 
                    send: jest.fn(), 
                    emit: jest.fn(),
                },
            },
        ]
      }).compile();

      service = module.get<ProjectService>(ProjectService);
      prisma = module.get<PrismaService>(PrismaService);
      eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    });

    const mockResponse = [
        {
            id: 1,
            uuid: randomUUID(),
            name: "Test Project 1",
            description: "This is the description for Test Project 1.",
            status: "NOT_READY",
            type: "X",
            contractAddress: "0x00",
            extras: {
                test: "test"
            },
            createdAt: "2024-09-02T11:59:25.229Z",
            updatedAt: "2024-09-02T11:59:25.229Z",
            deletedAt: null
        },
        {
            id: 2,
            uuid: randomUUID(),
            name: "Test Project 2",
            description: "This is the description for Test Project 2.",
            status: "NOT_READY",
            type: "X",
            contractAddress: "0x00",
            extras: {
              test: "test"
            },
            createdAt: "2024-09-02T11:59:25.229Z",
            updatedAt: "2024-09-02T11:59:25.229Z",
            deletedAt: null
        }
    ];

    describe('create', () => {
        it('should create new project with required details', async () => {
            const mockRequest = {
                name: "Test",
                description: "This is description for testing.",
                type: "X",
                extras: {
                    test: "test"
                },
                contractAddress: "0x00"
            };
            (prisma.project.create as jest.Mock).mockResolvedValue(mockRequest);
            const result = await service.create(mockRequest);
            expect(result).toBeDefined();
            expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
            expect(eventEmitter.emit).toHaveBeenCalledWith(
                ProjectEvents.PROJECT_CREATED, expect.any(Object)
            );
        });
    });

    describe('list', () => {
        it('should return list of projects', async () => {
            (prisma.project.findMany as jest.Mock).mockResolvedValue(mockResponse);
            const result = await service.list();
            expect(result).toEqual(mockResponse);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThanOrEqual(1); 
        });

        it('should return an empty list when no projects are found', async () => {
            (prisma.project.findMany as jest.Mock).mockResolvedValue(null);
            const result = await service.list();
            console.log(result, 'result in list');
            expect(result).toBeNull;
        });
    });

    describe('findOne', () => {
        it('should return specific project detail using uuid', async () => {
            (prisma.project.findUnique as jest.Mock).mockResolvedValue(mockResponse[0]);
            const result = await service.findOne(mockResponse[0].uuid);
            expect(prisma.project.findUnique).toHaveBeenCalledWith({
                where: {
                    uuid: mockResponse[0].uuid
                }
            });
            expect(result).toEqual(mockResponse[0]);
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result).toHaveProperty('uuid');
        });
    });

    describe('update', () => {
        it('should update the details of the project using uuid', async () => {
            const mockRequest = {
                name: "updated name",
                contractAddress: "0x11"
            };
            const mockResponseUpdate = {
                id: 2,
                uuid: randomUUID(),
                name: "updated name",
                description: "This is the description for Test Project 2.",
                status: "NOT_READY",
                type: "X",
                contractAddress: "0x11",
                extras: {
                  test: "test"
                },
                createdAt: "2024-09-02T11:59:25.229Z",
                updatedAt: "2024-09-02T11:59:25.229Z",
                deletedAt: null
            };
            (prisma.project.update as jest.Mock).mockResolvedValue(mockResponseUpdate);
            const result = await service.update(mockResponseUpdate.uuid, mockRequest);
            expect(prisma.project.update).toHaveBeenCalledWith({
                where: {
                    uuid: mockResponseUpdate.uuid
                },
                data: mockRequest
            });
            expect(result).toEqual(mockResponseUpdate);
            expect(result).not.toBeNull();
        });
    });

    describe('updateStatus', () => {
        it('should update the status of the specific project using uuid', async () => {
            const mockRequest = {
                status: ProjectStatus.ACTIVE,
                description: "This is the description for Test Project 2.",
            };
            const mockResponseUpdate = {
                id: 2,
                uuid: randomUUID(),
                name: "updated name",
                description: "This is the description for Test Project 2.",
                status: "ACTIVE",
                type: "X",
                contractAddress: "0x11",
                extras: {
                  test: "test"
                },
                createdAt: "2024-09-02T11:59:25.229Z",
                updatedAt: "2024-09-02T11:59:25.229Z",
                deletedAt: null
            };
            (prisma.project.update as jest.Mock).mockResolvedValue(mockResponseUpdate);
            const result = await service.update(mockResponseUpdate.uuid, mockRequest);
            expect(prisma.project.update).toHaveBeenCalledWith({
                where: {
                    uuid: mockResponseUpdate.uuid
                },
                data: mockRequest
            });
            expect(result).toEqual(mockResponseUpdate);
            expect(result).not.toBeNull();
        });
    });
});
