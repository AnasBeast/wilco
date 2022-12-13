import { Injectable } from '@nestjs/common';
import { isInt, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersService } from '../users/users.service';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class ValidatePagePagination implements ValidatorConstraintInterface {
  async validate(param: string, validationArguments: ValidationArguments): Promise<boolean> {
    const number = Number.parseInt(param);

    if (isNaN(number)) {
        return false;
    }
     
    if(validationArguments.constraints[0]) {
        if (number < 1) {
          return false;
        }
        return true;
      } else {
        if (number > 25) {
          return false;
        }
        return true;
      }
  }

  defaultMessage(): string {
    return 'The «$value» «$value» is already registered.';
  }
}
