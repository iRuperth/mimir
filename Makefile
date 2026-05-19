.PHONY: dev install build preview typecheck deploy clean

PKG ?= pnpm

install:
	$(PKG) install

dev:
	$(PKG) run dev

build:
	$(PKG) run build

preview:
	$(PKG) run preview

typecheck:
	$(PKG) exec tsc -b --noEmit

deploy:
	$(PKG) run deploy

clean:
	rm -rf dist node_modules/.vite
