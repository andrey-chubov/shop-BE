import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from './../exceptions/validation.exception';

@Injectable()
export class UserValidationPipes implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    const object = plainToInstance(metatype, value);
    const errors = await validate(object, { skipMissingProperties: true });
    if (errors.length > 0) {
      const messages = errors.map(err => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      });

      throw new ValidationException(messages);
    }

    return value;
  }
}
