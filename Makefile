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

package-win: build
	@cmd /c copy /y "mod\bin\Debug\netstandard2.1\0Harmony.dll" "dist\"
	@cmd /c copy /y "mod\bin\Debug\netstandard2.1\HookUIMod.dll" "dist\"
	@echo Packaged to dist/

package-unix: build
	@cp mod/bin/Debug/netstandard2.1/0Harmony.dll dist
	@cp mod/bin/Debug/netstandard2.1/HookUIMod.dll dist
	@echo Packaged to dist/