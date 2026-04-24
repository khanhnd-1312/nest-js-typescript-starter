import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsEmail({}, { message: i18nValidationMessage('common.validation.IS_EMAIL') })
  email?: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  username?: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  @MinLength(6, {
    message: i18nValidationMessage('common.validation.MIN_LENGTH'),
  })
  password?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  bio?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  image?: string;
}
