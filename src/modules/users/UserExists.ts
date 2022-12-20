import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersRepository } from './users.repository';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(private usersRepository: UsersRepository) {}

  async validate(email: string, validationArguments: ValidationArguments): Promise<boolean> {
    const user = await this.usersRepository.getUserByEmail(email);
    const result = user === null || user === undefined;
    return validationArguments.constraints[0] ? !result: result;
  }

  defaultMessage(): string {
    return 'The email «$value» is already registered.';
  }
}
