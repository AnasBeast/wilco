import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersService } from '../users/users.service';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(email: string, validationArguments: ValidationArguments): Promise<boolean> {
    // const user = await this.usersService.getUserByEmail(email);
    // const result = user === null || user === undefined;
    // return validationArguments.constraints[0] ? !result: result;
    return true;
  }

  defaultMessage(): string {
    return 'The email «$value» is already registered.';
  }
}
