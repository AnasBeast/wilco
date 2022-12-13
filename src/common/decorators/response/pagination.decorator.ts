import { SetMetadata } from '@nestjs/common';

export const PaginationKey = 'PaginationKey';
export const Pagination = (value: boolean) => SetMetadata(PaginationKey, value);