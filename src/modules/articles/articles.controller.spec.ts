import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import type { AuthenticatedUser } from '../auth/types';
import type { CreateArticleDto } from './dto/create-article.dto';
import type { UpdateArticleDto } from './dto/update-article.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  const articlesService = {
    createArticle: jest.fn(),
    getArticle: jest.fn(),
    updateArticle: jest.fn(),
    deleteArticle: jest.fn(),
  };

  const mockUser: AuthenticatedUser = {
    id: 'user-1',
    email: 'user@example.com',
    username: 'tester',
    bio: null,
    image: null,
  };

  const mockArticleResponse = {
    article: {
      slug: 'test-1-abc123',
      title: 'test 1',
      description: 'test 1',
      body: 'test 1.',
      tagList: ['test'],
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'tester',
        bio: null,
        image: null,
        following: false,
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: articlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    it('delegates to ArticlesService.createArticle with dto and user id', async () => {
      const dto: CreateArticleDto = {
        title: 'test 1',
        description: 'test 1',
        body: 'test 1.',
        tagList: ['test'],
      };
      articlesService.createArticle.mockResolvedValue(mockArticleResponse);

      await expect(controller.createArticle(dto, mockUser)).resolves.toEqual(
        mockArticleResponse,
      );
      expect(articlesService.createArticle).toHaveBeenCalledWith(
        dto,
        mockUser.id,
      );
    });

    it('delegates to ArticlesService.createArticle without tagList', async () => {
      const dto: CreateArticleDto = {
        title: 'test 2',
        description: 'test 2',
        body: 'test 2.',
      };
      articlesService.createArticle.mockResolvedValue(mockArticleResponse);

      await controller.createArticle(dto, mockUser);

      expect(articlesService.createArticle).toHaveBeenCalledWith(
        dto,
        mockUser.id,
      );
    });
  });

  describe('getArticle', () => {
    it('delegates to ArticlesService.getArticle with slug and authenticated user id', async () => {
      const slug = 'test-1-abc123';
      articlesService.getArticle.mockResolvedValue(mockArticleResponse);

      await expect(controller.getArticle(slug, mockUser)).resolves.toEqual(
        mockArticleResponse,
      );
      expect(articlesService.getArticle).toHaveBeenCalledWith(
        slug,
        mockUser.id,
      );
    });

    it('delegates to ArticlesService.getArticle with null when user is not authenticated', async () => {
      const slug = 'test-1-abc123';
      articlesService.getArticle.mockResolvedValue(mockArticleResponse);

      await expect(controller.getArticle(slug, null)).resolves.toEqual(
        mockArticleResponse,
      );
      expect(articlesService.getArticle).toHaveBeenCalledWith(slug, null);
    });
  });

  describe('updateArticle', () => {
    it('delegates to ArticlesService.updateArticle with slug, dto and user id', async () => {
      const slug = 'test-1-abc123';
      const dto: UpdateArticleDto = {
        title: 'test 11',
        description: 'test 11',
      };
      const updatedResponse = {
        article: {
          ...mockArticleResponse.article,
          title: 'test 11',
          description: 'test 11',
        },
      };
      articlesService.updateArticle.mockResolvedValue(updatedResponse);

      await expect(
        controller.updateArticle(slug, dto, mockUser),
      ).resolves.toEqual(updatedResponse);
      expect(articlesService.updateArticle).toHaveBeenCalledWith(
        slug,
        dto,
        mockUser.id,
      );
    });

    it('delegates partial update to ArticlesService.updateArticle', async () => {
      const slug = 'test-1-abc123';
      const dto: UpdateArticleDto = { body: 'test 11' };
      articlesService.updateArticle.mockResolvedValue(mockArticleResponse);

      await controller.updateArticle(slug, dto, mockUser);

      expect(articlesService.updateArticle).toHaveBeenCalledWith(
        slug,
        dto,
        mockUser.id,
      );
    });
  });

  describe('deleteArticle', () => {
    it('delegates to ArticlesService.deleteArticle with slug and user id', async () => {
      const slug = 'test-1-abc123';
      articlesService.deleteArticle.mockResolvedValue(undefined);

      await expect(
        controller.deleteArticle(slug, mockUser),
      ).resolves.toBeUndefined();
      expect(articlesService.deleteArticle).toHaveBeenCalledWith(
        slug,
        mockUser.id,
      );
    });
  });
});
