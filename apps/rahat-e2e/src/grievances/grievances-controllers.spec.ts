import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthsModule, AuthsService, User } from '@rumsan/user';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as dotenv from 'dotenv';
import { errorGrievance, errorGrievanceQuery, grievanceData, grievanceQuery } from './testFixtureData';
dotenv.config();

describe('CRUD /v1/grievances', () => {
    let accessToken;
    let authService: AuthsService;
    let header;
    const baseUrl = process.env.BASE_URL;
    const resCache = new Map();

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AuthsModule,
                EventEmitterModule.forRoot(),
            ]
        }).compile();

        authService = moduleFixture.get<AuthsService>(AuthsService);

        const mockUser: User = {
            id: 1,
            uuid: process.env.UUID,
            name: process.env.NAME,
            email: process.env.EMAIL,
            gender: 'UNKNOWN',
            phone: null,
            wallet: process.env.WALLET,
            createdAt: new Date("2024-07-01T09:51:58.506Z"),
            extras: null,
            deletedAt: null,
            updatedAt: new Date("2024-07-01T09:51:58.506Z"),
            createdBy: null,
            updatedBy: null
        };
        const mockAuthority = {
            roles: [{ roleName: process.env.ROLE_NAME }],
            permissions: [
                {
                    action: "manage",
                    subject: "all",
                    inverted: false,
                    conditions: null
                }
            ],
        };
        const { accessToken: token } = await authService.signToken(mockUser, mockAuthority);
        accessToken = token;
        header = `Bearer ${accessToken}`;

    });

    it('should create new grievance', async () => {
        console.log(header, 'header');
        const response = await request(baseUrl).post('/grievances').set('Authorization', header).send(grievanceData);
        resCache.set('grievance', response.body.data);
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(response.body.data);
    });

    it('should throw error if project id is not provided in grievance dto', async () => {
        const response = await request(baseUrl).post('/grievances').set('Authorization', header).send(errorGrievance);
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual("Bad Request Exception");
    });

    it('should throw error if token is not provided', async () => {
        const response = await request(baseUrl).post('/grievances').send(errorGrievance);
        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual("Unauthorized");
    });

    it('should list all the grievances', async () => {
        const response = await request(baseUrl).get('/grievances').set('Authorization', header).query(grievanceQuery);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toEqual(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.every(item => typeof item === 'object')).toBe(true);
    });

    it('should return empty array if project id is incorrect', async () => {
        const response = await request(baseUrl).get('/grievances').set('Authorization', header).query(errorGrievanceQuery);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data).toEqual([]);
    });

    it('should change the status of grievance', async () => {
        const grievanceDetail = resCache.get('grievance');
        const response = await request(baseUrl).patch(`/grievances/${grievanceDetail.uuid}/change-status`).set('Authorization', header).send({status: grievanceData.status});
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.status).toEqual(grievanceData.status);
        expect(response.body.data).toEqual(response.body.data);
        expect(response.body.data).toHaveProperty('status');
        expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should delete the grievance', async () => {
        const grievanceDetail = resCache.get('grievance');
        const response = await request(baseUrl).delete(`/grievances/${grievanceDetail.uuid}`).set('Authorization', header);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.status).toEqual(grievanceData.status);
        expect(response.body.data).toEqual(response.body.data);
        expect(response.body.data).toHaveProperty('deletedAt');
    });
})