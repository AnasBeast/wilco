import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  
  @ApiProperty({ example: 'token' })
  access_token: string;

  @ApiProperty({ example: 'Bearer' })
  token_type: string;

  @ApiProperty({ example: '0' })
  expires_in: number;

  @ApiProperty({ example: '0' })
  created_at: number;

}
