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
  constructor(private readonly certificatesService: CertificateService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List of Certificates' })
  @ApiResponse({
    status: 200,
    description: 'The records found',
    type: [BaseCertificate],
  })
  @Get()
  async getCertificates() {
    return await this.certificatesService.getCertificates();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Certificate' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseCertificate,
  })
  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.certificatesService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Certificate' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseCertificate,
  })
  @Post()
  async create(@Body() createTodoDto: BaseCertificate) {
    return await this.certificatesService.create(createTodoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Certificate' })
  @ApiResponse({
    status: 200,
    description: 'The record updated',
    type: BaseCertificate,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: BaseCertificate,
  ) {
    return await this.certificatesService.update(id, updateTodoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Certificate' })
  @ApiResponse({
    status: 200,
    description: 'The record deleted',
    type: BaseCertificate,
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.certificatesService.delete(id);
  }
}
