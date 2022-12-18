import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'IsValidTailNumber' })
@Injectable()
export class IsValidTailNumber implements ValidatorConstraintInterface {
    validate(value: string, validationArguments?: ValidationArguments): boolean {
        if (value.startsWith("N")) {
            return true
        }
        return false
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "tail_number must start with the letter 'N'";
    }
}