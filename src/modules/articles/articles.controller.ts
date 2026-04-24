import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('Authorization')
  createArticle(
    @Body() dto: CreateArticleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.articlesService.createArticle(dto, user.id);
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard) // Allow both authenticated and unauthenticated users
  getArticle(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthenticatedUser | null,
  ) {
    return this.articlesService.getArticle(slug, user?.id ?? null);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('Authorization')
  updateArticle(
    @Param('slug') slug: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.articlesService.updateArticle(slug, dto, user.id);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('Authorization')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArticle(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.articlesService.deleteArticle(slug, user.id);
  }
}
