import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthsModule, AuthsService, User } from '@rumsan/user';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as dotenv from 'dotenv';
import { invalidVendor, vendorDto, vendorEmail } from './testFixtureData';
dotenv.config();

describe('CRUD /v1/vendors', () => {
    let accessToken;
    let authService: AuthsService;
    let header;
    const baseUrl = process.env.BASE_URL;
    const resCache = new Map();
    const resBulkCache = new Map();

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

    it('should create new vendor', async () => {
        console.log(header, 'header');
        const response = await request(baseUrl).post('/vendors').set('Authorization', header).send(vendorDto);
        resCache.set('vendor', response.body.data);
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(response.body.data);
    }); 

    it('should throw error if email is not unique', async () => {
        const response = await request(baseUrl).post('/vendors').set('Authorization', header).send(vendorEmail);
        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual("Email must be unique");
    }); 

    it('should throw error if wallet is not provided in the dto', async () => {
        const response = await request(baseUrl).post('/vendors').set('Authorization', header).send(invalidVendor);
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual("Bad Request Exception");
    }); 

    it('should return list of vendors', async () => {
        const response = await request(baseUrl).get('/vendors').set('Authorization', header);
        expect(response.statusCode).toBe(200);
        resBulkCache.set('bulkVendors', response.body.data);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.every(item => typeof item === 'object')).toBe(true);
    });

    it('should return stats of vendors', async () => {
        const response = await request(baseUrl).get('/vendors/stats').set('Authorization', header);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(typeof response.body.data).toEqual('number');
        expect(response.body.data).toEqual(resBulkCache.get('bulkVendors').length);
    });

    it('should return details of vendor using id', async () => {
        console.log(resCache.get('vendor').id, 'id');
        const response = await request(baseUrl).get(`/vendors/${resCache.get('vendor').id}`).set('Authorization', header);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(response.body.data);
    });
});