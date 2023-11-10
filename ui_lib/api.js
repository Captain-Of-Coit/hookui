window._$hookui = {} 

window._$hookui.__registeredPanels = {}

window._$hookui.registerPanel = ({id, name, icon, component}) => {
    console.log('[HookUI] Registering UI for ', id, name)
    window._$hookui.__registeredPanels[id] = {id, name, icon, component}
}