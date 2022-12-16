import { Controller, Get } from "@nestjs/common";
import { CredentialsService } from "./credentials.service";

@Controller('credentials')
export class CrendentialsController {
    constructor(private credentialsService: CredentialsService) {}

    @Get()
    async getCredentials() {
        return await this.credentialsService.getCredentials();
    }
}