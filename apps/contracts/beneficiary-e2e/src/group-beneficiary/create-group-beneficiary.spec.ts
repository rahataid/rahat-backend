
import request from 'supertest';
import { AuthsModule, AuthsService, User } from '@rumsan/user';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { groupBeneficiaryDto } from './testFixtureGroupData';

const reqGroupCache = new Map();  
const resGroupCache = new Map();

const baseUrl = "http://localhost:5500";

describe('POST /v1/beneficiaries/groups', () => {
    let accessToken;
    let authService: AuthsService;
    let header;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AuthsModule,
                EventEmitterModule.forRoot(),
            ],
        }).compile();

        authService = moduleFixture.get<AuthsService>(AuthsService);

        const mockUser: User = {
            id: 1,
            uuid: "8e8f409e-b607-4ad1-b6cd-cc1e4f5a08c4",
            name: "Anupama Koirala",
            email: "anupama.rumsan@gmail.com",
            gender: 'UNKNOWN',
            phone: null,
            wallet: "0x75f598874DC39E364846d577CEde48d50378aC40",
            createdAt: new Date("2024-07-01T09:51:58.506Z"),
            extras: null,
            deletedAt: null,
            updatedAt: new Date("2024-07-01T09:51:58.506Z"),
            createdBy: null,
            updatedBy: null
        };
        const mockAuthority = {
            roles: [{ roleName: 'Admin' }],
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
        accessToken = token
    });    

    it('should add the beneficiaries in a group', async () => {
        header = `Bearer ${accessToken}`;
        const result = await request(baseUrl).post('/v1/beneficiaries/groups').set('Authorization', header).send(groupBeneficiaryDto);
        reqGroupCache.set('group', groupBeneficiaryDto);
        resGroupCache.set('resGroup', result.body.data);
        expect(result.status).toBe(201);
        expect(result.body.success).toBe(true);
        expect(result.body.data).toEqual(result.body.data);
    });
});
