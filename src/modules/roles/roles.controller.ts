import { RoleEntity } from '../../common/entities/role.entity';
import { CreateRoleDto } from './dto/create.dto';
import { RolesService } from './roles.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CREATED } from 'src/common/constants/response.constants';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { PaginationDTO } from 'src/dto/pagination.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  // @Post('/')
  // @ApiBearerAuth()
  // @ApiCreatedResponse({ description: 'Role has been successfully created.', type: RoleEntity })
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @HttpCode(HttpStatus.CREATED)
  // @ResponseMessage(CREATED)
  // @ApiOperation({ summary: 'Create Custom Role' })
  // async createRole(@Body() body: CreateRoleDto): Promise<RoleEntity> {
  //   return await this.rolesService.createRole(body);
  // }

  @Get('/default_roles')
  async getDefaultRoles(@Query() { page, per_page }: PaginationDTO) {
    return await this.rolesService.getDefaultRoles(Number.parseInt(page), Number.parseInt(per_page));
  }
}
