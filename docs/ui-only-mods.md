# UI-only Mods with React

> UI only means you'll only provide UI on top of already existing data/methods available in the UI. No C# code can be added in this mode. Useful if you want to add your own visualizations or similar. You can access any of the data you see in the default UI, on any panel, and also trigger the same events as the built-in UI can trigger.

Write your React UI component:

```jsx
import React from 'react';

const HelloWorld = () => {
    const style = {
        position: "absolute",
        top: 100,
        left: 100,
        color: "white"
    }
    return <div style={style}>
        Hello World
    </div>
}

window._$hookui.registerPanel({
    id: "example.hello-world",
    name: "Hello World",
    icon: "Media/Game/Icons/Trash.svg",
    component: HelloWorld
})
```

> [!IMPORTANT]  
> Make sure the `id` you provide is unique. Ideally, use `$username.$mod-title` so there are no collisions.

The subscribe to data, please see the [UI Bindings](./ui-bindings.md) page.

Then you need to compile the code from JSX to JS, and bundle the code. This shouldn't be news to you if you've ever dealt with React + JSX before :)

```
npx esbuild helloworld.jsx --bundle --outfile=helloworld.transpiled.js
```

Then finally you need to put the file in the `Cities2_Data\StreamingAssets\~UI~\HookUI\Extensions` directory in your game directory and it'll get picked up automatically, as long as it ends with `.js`

> [!NOTE]  
> No need to manually put the file into the `Extensions/` directory if you're planning to [embed the UI with your mod](./csharp-embedding.md)