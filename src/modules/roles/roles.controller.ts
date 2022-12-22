import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get('/default_roles')
  async getDefaultRoles(@Query() { page, per_page }: PaginationDTO) {
    return await this.rolesService.getDefaultRoles(Number.parseInt(page), Number.parseInt(per_page));
  }
}
