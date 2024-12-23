import { Test, TestingModule } from '@nestjs/testing';
import { DevService } from './develop.service';
import { ClientProxy } from '@nestjs/microservices';

describe('DevService', () => {
    let service: DevService;
    let mockClientProxy: ClientProxy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DevService,
                {
                    provide: 'RAHAT_CLIENT',
                    useValue: {
                        send: jest.fn().mockReturnValue({
                          subscribe: jest.fn(),
                        }),
                    },
                }
            ]
        }).compile();

        service = module.get<DevService>(DevService);
        mockClientProxy = module.get<ClientProxy>('RAHAT_CLIENT');

    });

    describe('log', () => {
        const cmd = 'abc';
        const data = 'xyz';
        it('should log message when NODE_ENV is development', async () => {
            process.env.NODE_ENV = 'development';
            await service.log(cmd, data);
            expect(mockClientProxy.send).toHaveBeenCalledWith(
                { cmd: 'abc', dev: true }, data);
            const sendMock = mockClientProxy.send as jest.Mock;
            expect(sendMock().subscribe).toHaveBeenCalled();
        });
        it('should not log a message when NODE_ENV is production', async () => {
            process.env.NODE_ENV = 'production';
            await service.log(cmd, data);
            expect(mockClientProxy.send).not.toHaveBeenCalled();
        });
    });

    describe('otp', () => {
        const data = {
            otp: '123456',
            challenge: 'challenge',
            requestInfo: {
             origin: 'testOrigin',
           },
        };
        it('should send otp when NODE_ENV is development', async () => {
            const cmd = 'slack';
            process.env.NODE_ENV = 'development';
            await service.otp(data);
            expect(mockClientProxy.send).toHaveBeenCalledWith(
                { cmd, dev: true }, {
                    otp: data.otp,
                    challenge: data.challenge,
                    origin: data.requestInfo.origin
                });
            const sendMock = mockClientProxy.send as jest.Mock;
            expect(sendMock().subscribe).toHaveBeenCalled();
        });
        it('should not send otp when NODE_ENV is production', async () => {
            process.env.NODE_ENV = 'production';
            await service.otp(data);
            expect(mockClientProxy.send).not.toHaveBeenCalled();
        });
    });
});