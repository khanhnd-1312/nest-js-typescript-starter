import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateArticleDto {
  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  title?: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  description?: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  body?: string;
}
