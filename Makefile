all: build
BEPINEX_VERSION = 6
NUGET_KEY = "key"

mod-build: lib-build
	@echo Building HookUIMod...
	@cd mod && dotnet clean && dotnet restore && dotnet build /p:BepInExVersion=$(BEPINEX_VERSION)

lib-build:
	@echo Building HookUILib...
	@cd lib && dotnet clean && dotnet restore && dotnet build

lib-publish: lib-build
	@echo "Publishing HookUILib..."
	@cd lib && dotnet pack && dotnet nuget push bin/Debug/HookUILib.0.3.0.nupkg -k $(NUGET_KEY) -s https://api.nuget.org/v3/index.json

install-ui-deps:
	@echo Installing frontend dependencies...
	@npm ci

ui-bundle: install-ui-deps
	@echo Building HookUI frontend...
	@node bundle_ui.mjs

ui-install: package-win
	cmd /c copy /y "dist\hookui.menu.bundle.js" "C:\Program Files (x86)\Steam\steamapps\common\Cities Skylines II\Cities2_Data\StreamingAssets\~UI~\HookUI\lib"
	cmd /c copy /y "dist\hookui.api.bundle.js" "C:\Program Files (x86)\Steam\steamapps\common\Cities Skylines II\Cities2_Data\StreamingAssets\~UI~\HookUI\lib"
	cmd /c copy /y "dist\hookui.loader.bundle.js" "C:\Program Files (x86)\Steam\steamapps\common\Cities Skylines II\Cities2_Data\StreamingAssets\~UI~\HookUI\lib"

build: ui-bundle mod-build
	@echo Build complete.

package-win: build
	cmd /c copy /y "mod\bin\Debug\netstandard2.1\0Harmony.dll" "dist"
	cmd /c copy /y "mod\bin\Debug\netstandard2.1\Microsoft.Bcl.AsyncInterfaces.dll" "dist"
	cmd /c copy /y "mod\bin\Debug\netstandard2.1\HookUIMod.dll" "dist"
	cmd /c copy /y "lib\bin\Debug\netstandard2.1\HookUILib.dll" "dist"
	echo Packaged to dist/

package-unix: build
	@cp mod/bin/Debug/netstandard2.1/0Harmony.dll dist
	@cp mod/bin/Debug/netstandard2.1/Microsoft.Bcl.AsyncInterfaces.dll dist
	@cp mod/bin/Debug/netstandard2.1/HookUIMod.dll dist
	@cp lib/bin/Debug/netstandard2.1/HookUILib.dll dist
	@echo Packaged to dist/