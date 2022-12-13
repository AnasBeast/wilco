import { IsNotEmpty, IsNotEmptyObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class DeviceDto {
    @IsNotEmpty()
    token: string;
}

export class CreateDeviceDto {
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => DeviceDto)
    device: DeviceDto;
}

