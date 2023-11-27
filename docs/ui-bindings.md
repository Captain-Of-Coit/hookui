# HookUILib UI Bindings

## Making data in C# available to read in Game UI

The following is an example of a CS2 UI System, which can read data from the game state and communicate with the UI from your mod. When setting up bindings, your [System](https://cities2modding.github.io/wiki/reference/ecs/system.html) should extend from [`UISystemBase`](https://cities2modding.github.io/wiki/reference/game-ui/uisystembase.html)

```csharp
class MyUISystem : UISystemBase {
    private int seconds_passed = 0;
    private string kGroup = "myowncoolmod_namespace";
    protected override void OnCreate() {
        base.OnCreate();

        // Update the UI when seconds_passed changes
        this.AddUpdateBinding(new GetterValueBinding<int>(this.kGroup, "seconds_passed", () => {
            return this.seconds_passed;
        }));

        IncrementPeriodically();
    }
    private async void IncrementPeriodically() {
        while (true) {
            UnityEngine.Debug.Log($"Adding to {seconds_passed}!");
            await Task.Delay(5000);
            seconds_passed += 5;
        }
    }
}
```

## Reading data in C# from Game UI

Then in your React UI, you can listen for changes to the binding by listening to the `.update` event and then triggering the `.subscribe` event:

```jsx
const $MyCoolMod = ({ react }) => {
    const [seconds, setSeconds] = react.useState(0);

    react.useEffect(() => {
        const event = "myowncoolmod_namespace.seconds_passed"
        const updateEvent = event + ".update"
        const subscribeEvent = event + ".subscribe"
        const unsubscribeEvent = event + ".unsubscribe"

        var sub = engine.on(updateEvent, (data) => {
            setSeconds(data)
        })
        engine.trigger(subscribeEvent)
        return () => {
            engine.trigger(unsubscribeEvent)
            sub.clear();
        };
    }, [])

    return <div>
        It's been {seconds} seconds since the mod first loaded!
    </div>
}
```

## Loading UI System

In order to load your `MyUISystem` system, write a Harmony Postfix method to add the system to the game loop:

```csharp
[HarmonyPatch(typeof(SystemOrder))]
public static class SystemOrderPatch {
    [HarmonyPatch("Initialize")]
    [HarmonyPostfix]
    public static void Postfix(UpdateSystem updateSystem) {
        updateSystem.UpdateAt<MyUISystem>(SystemUpdatePhase.UIUpdate);
    }
}
```

## More Information

For more information on how Bindings work in Cities: Skylines 2, visit the Unofficial Wiki and browse the pages related to the Game UI.