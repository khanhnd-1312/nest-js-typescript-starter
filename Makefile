.PHONY: help up down db logs dev install build test

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ── Docker ────────────────────────────────────────────────
up: ## Start database (Docker)
	docker compose up -d

down: ## Stop database (Docker)
	docker compose down

db: ## Connect to database via psql
	docker compose exec db psql -U postgres -d realworld

logs: ## Show database logs
	docker compose logs -f db

# ── App ───────────────────────────────────────────────────
install: ## Install dependencies
	pnpm install

dev: ## Start app in watch mode
	pnpm start:dev

build: ## Build app
	pnpm build

# ── Test ──────────────────────────────────────────────────
test: ## Run unit tests
	pnpm test

test-e2e: ## Run e2e tests
	pnpm test:e2e

test-cov: ## Run tests with coverage
	pnpm test:cov

# ── Migrations ───────────────────────────────────────────────
migrate-generate: ## Generate migration (usage: make migrate-generate name=CreateUsers)
	pnpm migration:generate src/migrations/$(name)

migrate: ## Run pending migrations
	pnpm migration:run

migrate-revert: ## Revert last migration
	pnpm migration:revert

migrate-show: ## Show migration status
	pnpm migration:show

# ── Setup ─────────────────────────────────────────────────
setup: install up ## Install deps + start database
	@echo "✅ Dev environment ready!"
	@echo "Run 'make dev' to start the app"
