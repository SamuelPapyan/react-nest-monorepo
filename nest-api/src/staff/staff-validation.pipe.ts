import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate } from 'class-validator'
import { plainToInstance } from "class-transformer";
import { ValidationErrorDTO } from "src/app/validation-error.dto";

@Injectable()
export class StaffValidationPipe implements PipeTransform<any> {
    async transform(value: any, {metatype}: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToInstance(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0)
        {
            const validationErrors = errors.map(error=> {
                const dto = new ValidationErrorDTO();
                dto.property = error.property;
                dto.message = error.constraints.isEmail ? error.constraints.isEmail : error.constraints.isLength;
                return dto;
            });
            throw new BadRequestException(validationErrors, 'Staff Validation Failed');
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
