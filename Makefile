all: build

mod-build:
	@echo Building HookUIMod...
	@cd mod && dotnet clean && dotnet restore && dotnet build

install-ui-deps:
	@echo Installing frontend dependencies...
	@npm ci

ui-bundle: install-ui-deps
	@echo Building HookUI frontend...
	@node bundle_ui.mjs

build: ui-bundle mod-build
	@echo Build complete.