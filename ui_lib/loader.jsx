import React from 'react'

const $Loader = ({ react }) => {
    const [visibleComponents, setVisibleComponents] = react.useState([])

    react.useEffect(() => {
        const handleEvent = (e) => {
            const {id, type} = e.detail
            if (visibleComponents.includes(id)) {
                setVisibleComponents(visibleComponents.filter(id_b => id !== id_b))
            } else {
                setVisibleComponents(visibleComponents => [...visibleComponents, id]);
            }
        }

        window.addEventListener('hookui', handleEvent)
        return () => {
            window.removeEventListener('hookui', handleEvent)
        };
    }, [visibleComponents])

    const components = Object.keys(window._$hookui.__registeredPanels)
    .filter(i => visibleComponents.includes(i))
    .map(k => window._$hookui.__registeredPanels[k].component)

    const to_render = components.map(c => {
        const el = React.createElement(c, {react: react})
        return <div key={c.id}>
            {el}
        </div>
    })

    return <div key="hookui_loader">
        {...to_render}
    </div>
}

window._$hookui_loader = $Loader