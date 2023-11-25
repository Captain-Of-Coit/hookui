import React from 'react'

const loadExtensions = (extensions) => {
    extensions.forEach(extension => {
        const script = document.createElement('script');
        script.src = "Extensions/" + extension;
        script.async = true;
        script.className = "hookui_extension"; // Assign a class name
        document.head.appendChild(script);
    });
};

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

    react.useEffect(() => {
        console.log('listening to avilable extensions')
        engine.on('hookui.available_extensions.update', (extensions) => {
            console.log('These are extensions we need to auto load:', extensions);
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