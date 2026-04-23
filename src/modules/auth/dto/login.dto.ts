import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsEmail({}, { message: i18nValidationMessage('common.validation.IS_EMAIL') })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  @MinLength(6, {
    message: i18nValidationMessage('common.validation.MIN_LENGTH'),
  })
  password: string;
}
