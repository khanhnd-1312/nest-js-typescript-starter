import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateArticleDto {
  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  title: string;

  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  description: string;

  @IsNotEmpty({
    message: i18nValidationMessage('common.validation.IS_NOT_EMPTY'),
  })
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  body: string;

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('common.validation.IS_ARRAY') })
  @IsString({
    each: true,
    message: i18nValidationMessage('common.validation.IS_STRING'),
  })
  tagList?: string[];
}
