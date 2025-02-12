import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ProjectProcessor } from "./project.processor";
import { RahatProcessor } from "./rahat.processor";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'DEPLOYMENT_CLIENT',
                transport: Transport.REDIS,
                options: {
                    host: process.env.REDIS_HOST,
                    port: +process.env.REDIS_PORT,
                    password: process.env.REDIS_PASSWORD,
                },
            },
        ])
    ],
    providers: [RahatProcessor, ProjectProcessor]
})
export class ProcessorsModule { }