import { ValidationPipe } from '@nestjs/common';

export function createStrictValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    transform: true,
  });
}
