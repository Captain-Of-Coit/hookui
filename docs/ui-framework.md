# HookUI-Framework

The HookUI-Framework is reusable React code and CSS styles you can use to save a bit of time, if you want your UI to look like the built-in Game UI.

For more detailed document, check out the repository for HookUI-Framework: https://github.com/Captain-Of-Coit/hookui-framework

## Installation

First install the project with npm, make sure you have a `package.json` before installing dependencies (or run `npm init` once first). Then run:

```bash
npm install captain-of-coit/hookui-framework
```

Then you can access the built-in components with their styling by importing the right component:

```
import {$Panel} from 'hookui-framework'

<$Panel title="My first panel">
    <h1>This is inside the panel</h1>
</$Panel>
```

