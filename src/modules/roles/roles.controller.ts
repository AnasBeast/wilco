import { RoleEntity } from '../../common/entities/role.entity';
import { CreateRoleDto } from './dto/create.dto';
import { RolesService } from './roles.service';
import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { CREATED } from 'src/common/constants/response.constants';
import { TransformationInterceptor } from 'src/authentication/interceptors/transform.interceptor';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post('/')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Role has been successfully created.', type: RoleEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(CREATED)
  @UseInterceptors(TransformationInterceptor)
  async createRole(@Body() body: CreateRoleDto): Promise<RoleEntity> {
    return await this.rolesService.createRole(body);
  }
}
