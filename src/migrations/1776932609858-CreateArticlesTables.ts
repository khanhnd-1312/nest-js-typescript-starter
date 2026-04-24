import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticlesTables1776932609858 implements MigrationInterface {
    name = 'CreateArticlesTables1776932609858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "body" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid NOT NULL, "articleId" uuid NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "body" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid NOT NULL, CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follows" ("followerId" uuid NOT NULL, "followingId" uuid NOT NULL, CONSTRAINT "PK_105079775692df1f8799ed0fac8" PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE TABLE "article_tags" ("articlesId" uuid NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_76f5b1f278d3127f34268ab002d" PRIMARY KEY ("articlesId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b75655619539f2c19724045441" ON "article_tags" ("articlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab2929ab48ecedb624e30b2649" ON "article_tags" ("tagsId") `);
        await queryRunner.query(`CREATE TABLE "article_favorites" ("articlesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_421c23edf8c34c0a6207d32c44f" PRIMARY KEY ("articlesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c49632f965082c4a1048e86305" ON "article_favorites" ("articlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a21ccfcabb833c62da7c799917" ON "article_favorites" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_tags" ADD CONSTRAINT "FK_b75655619539f2c19724045441d" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_tags" ADD CONSTRAINT "FK_ab2929ab48ecedb624e30b26490" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_favorites" ADD CONSTRAINT "FK_c49632f965082c4a1048e863052" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_favorites" ADD CONSTRAINT "FK_a21ccfcabb833c62da7c7999177" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_favorites" DROP CONSTRAINT "FK_a21ccfcabb833c62da7c7999177"`);
        await queryRunner.query(`ALTER TABLE "article_favorites" DROP CONSTRAINT "FK_c49632f965082c4a1048e863052"`);
        await queryRunner.query(`ALTER TABLE "article_tags" DROP CONSTRAINT "FK_ab2929ab48ecedb624e30b26490"`);
        await queryRunner.query(`ALTER TABLE "article_tags" DROP CONSTRAINT "FK_b75655619539f2c19724045441d"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a21ccfcabb833c62da7c799917"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c49632f965082c4a1048e86305"`);
        await queryRunner.query(`DROP TABLE "article_favorites"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab2929ab48ecedb624e30b2649"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b75655619539f2c19724045441"`);
        await queryRunner.query(`DROP TABLE "article_tags"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
