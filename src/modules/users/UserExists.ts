import { UsersService } from './users.service';
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(email: any): Promise<boolean> {
    const user = await this.usersService.getUserByEmail(email);
    return user === null || user === undefined;
  }

  defaultMessage(): string {
    return 'The email «$value» is already registered.';
  }
}
