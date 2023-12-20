import React from 'react'
import {$Panel, useDataUpdate} from 'hookui-framework'

const loadExtensions = (extensions) => {
    extensions.forEach(extension => {
        const script = document.createElement('script');
        script.src = "Extensions/" + extension;
        script.async = true;
        script.className = "hookui_extension"; // Assign a class name
        document.head.appendChild(script);
    });
};

const debounced = (func, timeout) => {
    let id = null;
    return (...args) => {
        clearTimeout(id);
        id = setTimeout(() => func(...args), timeout);
    };
};

const $Loader = ({ react }) => {
    // Keep track of Position, Size and Visibility of the panels included into the game
    const [visiblePanels, setVisiblePanels] = react.useState([])
    const [panelPositions, setPanelPositions] = react.useState({})
    const [panelSizes, setPanelSizes] = react.useState({})

    useDataUpdate(react, "hookui.visible_panels", setVisiblePanels)
    useDataUpdate(react, "hookui.panel_positions", (res) => setPanelPositions(JSON.parse(res)))
    useDataUpdate(react, "hookui.panel_sizes", (res) => setPanelSizes(JSON.parse(res)))

    const closePanel = (panelID) => {
        const new_visible_panels = visiblePanels.filter(id => panelID !== id)
        window.engine.trigger('hookui.set_visible_panels', new_visible_panels)
    }

    react.useEffect(() => {
        const handleEvent = (e) => {
            const {id, type} = e.detail
            if (visiblePanels.includes(id)) {
                closePanel(id)
            } else {
                const new_visible_panels = [...visiblePanels, id]
                window.engine.trigger('hookui.set_visible_panels', new_visible_panels)
            }
        }

        window.addEventListener('hookui', handleEvent)
        return () => {
            window.removeEventListener('hookui', handleEvent)
        };
    }, [visiblePanels])

    react.useEffect(() => {
        engine.on('hookui.available_extensions.update', (extensions) => {
            loadExtensions(extensions);
        })
        engine.trigger('hookui.available_extensions.subscribe');

        return () => {
            engine.trigger('hookui.available_extensions.unsubscribe')
            document.querySelectorAll('head script.hookui_extension').forEach(script => {
                document.head.removeChild(script);
            });
        }
    }, [])

    // Get all visible, registered panels
    const panels = Object.keys(window._$hookui.__registeredPanels)
        .filter(i => visiblePanels.includes(i))
        .map(k => window._$hookui.__registeredPanels[k])

    const handlePanelMoved = (panelID, panelPosition) => {
        engine.trigger('hookui.set_panel_position', panelID, JSON.stringify(panelPosition))
    }

    const handlePanelResize = (panelID, panelSize) => {
        engine.trigger('hookui.set_panel_size', panelID, JSON.stringify(panelSize))
    }

    const handlePanelMovedDebounced = debounced(handlePanelMoved, 500)
    const handlePanelResizeDebounced = debounced(handlePanelResize, 500)

    const to_render = panels.map(p => {
        // (NOT RECOMMENDED) The panel itself was passed
        // mod authors manage the panel themselves
        if (p.component) {
            const el = React.createElement(p.component, {react: react})
            return <div key={p.id}>
                {el}
            </div>
        // (recommended) Only the body of the panel was passed
        // fully HookUI managed $Panel
        } else if (p.body) {
            const el = React.createElement(p.body, {react: react})
            const args = {
                key: p.id,
                title: p.name,
                react: react,
                style: p.panel_style || {},
                resizable: p.resizable,
                onPositionChange: (new_pos) => handlePanelMovedDebounced(p.id, new_pos),
                onSizeChange: (new_size) => handlePanelResizeDebounced(p.id, new_size),
                initialPosition: panelPositions[p.id],
                initialSize: panelSizes[p.id],
                onClose: () => closePanel(p.id)
            }
            return <$Panel {...args}>
                {el}
            </$Panel>
        } else {
            throw new Error('Unknown panel structure for registerPanel, missing .body or .component')
        }
    })

    return <div key="hookui_loader">
        {...to_render}
    </div>
}

window._$hookui_loader = $Loader