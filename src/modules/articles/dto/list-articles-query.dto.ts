import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ListArticlesQueryDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  tag?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  author?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('common.validation.IS_STRING') })
  favorited?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('common.validation.IS_INT') })
  @Min(1, { message: i18nValidationMessage('common.validation.MIN') })
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('common.validation.IS_INT') })
  @Min(0, { message: i18nValidationMessage('common.validation.MIN') })
  offset?: number = 0;
}
