import React from 'react'
import {useDataUpdate} from 'hookui-framework'

const $MenuItem = ({icon}) => {
    return <button className="button_FBo button_ECf item_It6 item-mouse-states_Fmi item-selected_tAM item-focused_FuT toggle-states_DTm button_FBo button_ECf item_It6 item-mouse-states_Fmi item-selected_tAM item-focused_FuT toggle-states_DTm item_IYJ">
        <img className="icon_ZjN icon_soN icon_Iwk" src={icon}></img>
    </button>
}

const $MenuRow = ({children, onClick}) => {
    return <div className="row_B8G" onClick={onClick}>
        {children}
    </div>
}

const toggleVisibility = (id) => {
    return () => {
        const data = {type: "toggle_visibility", id: id};
        const event = new CustomEvent('hookui', { detail: data });
        window.dispatchEvent(event);
    }
}

const getPanels = () => {
    const panels = window._$hookui.__registeredPanels
    const ks = Object.keys(panels)

    const $panels = ks.map((k) => {
        const panel = panels[k]
        return <$MenuRow onClick={toggleVisibility(panel.id)}>
            <$MenuItem icon={panel.icon}/>
            {panel.name}
        </$MenuRow>
    })
    return $panels
}

const $Menu = ({visible}) => {
    const $panels = getPanels()

    if ($panels.length === 0) {
        $panels.push(<$MenuRow>
            No ModUIs added!
        </$MenuRow>)
    }

    const style = {
        bottom: "initial",
        opacity: visible ? 1 : 0,
        left: "50rem",
        top: "45rem",
        pointerEvents: visible ? "auto" : "none",
        visibility: visible ? "visible" : "hidden",
        transition: "opacity 0.5s, visibility 0.5s",
        transitionDelay: visible ? "0s" : "0.05s" // Delay applying 'hidden' when fading out
    }

    return <div class="info-layout_BVk" style={style}>
        <div class="infoview-menu_LhU infoview-menu_VQI">
            <div class="panel_YqS menu_O_M">
                <div class="content_XD5 content_AD7 child-opacity-transition_nkS content_Hzl">
                    {...$panels}
                </div>
            </div>
        </div>
    </div>
}

const $HookUIMenu = ({react}) => {
    const [showMenu, setShowMenu] = react.useState(false)

    useDataUpdate(react, "hookui.is_menu_open", (new_val) => {
        setShowMenu(new_val)
    })

    const toggleMenu = () => {
        const newVal = !showMenu
        window.engine.trigger('hookui.toggle_menu', newVal)
        // If we're displaying HookUI, hide infoview if it's open
        if (newVal) {
            window.engine.trigger('game.closePanel', 'Game.UI.InGame.InfoviewMenu')
        }
    }

    react.useEffect(() => {
        const subscription = window.engine.on('game.showPanel', (panel) => {
            if (panel === 'Game.UI.InGame.InfoviewMenu') {
                window.engine.trigger('hookui.toggle_menu', false)
            }
        })
        window.engine.trigger('game.showPanel.subscribe')

        return () => {
            window.engine.trigger('game.showPanel.unsubscribe')
            subscription.clear();
        };
    }, [showMenu])

    return <button className="button_ke4 button_ke4 button_H9N" style={{marginLeft: "5rem"}} onClick={toggleMenu}>
        <div className="tinted-icon_iKo icon_be5" style={{maskImage: "url(Media/Glyphs/Student.svg)"}}></div>
        <$Menu visible={showMenu}/>
    </button>
}

window._$hookui_menu = $HookUIMenu