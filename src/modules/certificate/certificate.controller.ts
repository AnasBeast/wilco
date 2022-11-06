import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseCertificate } from 'src/dto/certificate/base-certificate.dto';
import { CertificateService } from './certificate.service';

@Controller('certificates')
@ApiTags('certificates')
export class CertificateController {
  constructor(private readonly service: CertificateService) {}

  @Get()
  @ApiOperation({ summary: 'Get List of Certificates' })
  @ApiResponse({
    status: 200,
    description: 'The records found',
    type: [BaseCertificate],
  })
  async index() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Certificate' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseCertificate,
  })
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Certificate' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseCertificate,
  })
  async create(@Body() createTodoDto: BaseCertificate) {
    return await this.service.create(createTodoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Certificate' })
  @ApiResponse({
    status: 200,
    description: 'The record updated',
    type: BaseCertificate,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: BaseCertificate,
  ) {
    return await this.service.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Certificate' })
  @ApiResponse({
    status: 200,
    description: 'The record deleted',
    type: BaseCertificate,
  })
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
