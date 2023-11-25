# Embedded into existing C# Mod

Follow the same steps as with a [UI-only mod](./ui-only-mods.md), except the last step of putting the transpiled file into the game directory. If you haven't followed the steps in [UI-only mods](./ui-only-mods.md), please do so now.

Instead, you should reference the transpiled file inside your mod with the HookLib C# API, and it'll automatically be used when the mod is loaded.

Add `HookUILib` as a dependency to your project, and then declare the path to your UI and use `LoadEmbeddedResource` to embed the transpiled code into your mod.

```csharp
using HookUILib.Core;

namespace MyCoolMod {
    public class Plugin : BaseUnityPlugin {
        private void Awake() {
            Logger.LogInfo($"Plugin {MyPluginInfo.PLUGIN_GUID} is loaded!");
            // [...]
        }
    }
    public class MyCoolModUI : UIExtension {
        public new readonly ExtensionType extensionType = ExtensionType.Panel;
        public new readonly string extensionID = "examples.mycoolmod";
        public new readonly string extensionContent = LoadEmbeddedResource("MyCoolMod.dist.mycoolmod.transpiled.js");
    }
}
```

> [!IMPORTANT]  
> The string used as the argument is the namespace and the path of your file **BUT** the `/` (directory separator) is a `.` (dot) instead.

Embed the resource via your .csproj file:

```csharp
<ItemGroup>
    <EmbeddedResource Include="dist/mycoolmod.transpiled.js" />
</ItemGroup>
```
