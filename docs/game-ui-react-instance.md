# Using global `React` vs Game UI's `react`

One tricky thing with how HookUI works is related to React and its requirement to be the single "owner" of a DOM tree.

So if you're using React already in an application to own a specific tree of DOM components, you cannot/shouldn't use another React instance to own some of the components inside of that tree. Then React won't be able to properly calculate the differences, and it'll scream at you.

And unfortunatly, the Game UI doesn't expose the React version they're using, so we need to pass down `react` references down our component trees, in order to use the built-in React instance the Game UI already uses.

This means that a component that would look like this:

```jsx
import React, {useState} from 'React'
const $MyPanel = () => {
    const [pressed, setPressed] = useState(false)
    // [...]
}

window._$hookui.registerPanel({
    id: "example.hello-world",
    name: "Hello World",
    icon: "Media/Game/Icons/Trash.svg",
    component: $MyPanel
})
```

Instead have to look like this:

```jsx
import React from 'React'
const $MyPanel = ({react}) => {
    const [pressed, setPressed] = react.useState(false)
    // [...]
}
```

The initial point where the `react` instance from Game UI is being passed down, is the component you use to register your mod extension with HookUI (right now, only Panels).
