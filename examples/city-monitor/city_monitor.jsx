import React from 'react';

function mapToPercentage(value) {
    if (value < -1 || value > 1) {
      throw new Error('Input must be between -1 and 1.');
    }
    return (value + 1) * 50;
  }

const $Meter = ({label, value, gradient}) => {
    const gradientStyle = {
        "backgroundImage": gradient
    }
    const pointerStyle = {
        left: value + "%"
    }
    return <div className="infoview-panel-section_RXJ">
        <div className="content_1xS focusable_GEc item-focused_FuT">
            <div className="labels_L7Q row_S2v">
                <div className="uppercase_RJI left_Lgw row_S2v">{label}</div>
            </div>
            <div className="bar_nW3">
                <div className="gradient_P8C" style={gradientStyle}></div>
                <div className="pointer_SV2" style={pointerStyle}>
                    <img className="pointerIcon_i8i" src="Media/Misc/IndicatorBarPointer.svg"></img>
                </div>
            </div>
            {/* <div className="labels_L7Q row_S2v tiny_m9B">
                <div className="left_Lgw row_S2v">Consumption: 50.8 kW</div>
                <div className="right_k3O row_S2v">Production: 0 kW</div>
            </div> */}
            <div className="small-space_DCq"></div>
        </div>
    </div>
}

const panelStyle = {
    position: 'absolute',
    width: 300,
    height: 400,
}

const $Panel = ({ title, children, react }) => {
    const [position, setPosition] = react.useState({ top: 100, right: 10 });
    const [dragging, setDragging] = react.useState(false);
    const [rel, setRel] = react.useState({ x: 0, y: 0 }); // Position relative to the cursor

    const onMouseDown = (e) => {
        if (e.button !== 0) return; // Only left mouse button
        const panelElement = e.target.closest('.panel_YqS');

        // Calculate the initial relative position
        const rect = panelElement.getBoundingClientRect();
        setRel({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });

        setDragging(true);
        e.stopPropagation();
        e.preventDefault();
    }

    const onMouseUp = (e) => {
        setDragging(false);
        // Remove window event listeners when the mouse is released
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    const onMouseMove = (e) => {
        if (!dragging) return;

        setPosition({
            top: e.clientY - rel.y,
            right: window.innerWidth - e.clientX - (panelStyle.width - rel.x),
        });
        e.stopPropagation();
        e.preventDefault();
    }

    const draggableStyle = {
        ...panelStyle,
        top: position.top + 'px',  // Ensure the values are not NaN
        right: position.right + 'px',
    }

    react.useEffect(() => {
        if (dragging) {
            // Attach event listeners to window
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }

        return () => {
            // Clean up event listeners when the component unmounts or dragging is finished
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [dragging]); // Only re-run the effect if dragging state changes

    return (
        <div className="panel_YqS" style={draggableStyle}>
            <div className="header_H_U header_Bpo child-opacity-transition_nkS"
                 onMouseDown={onMouseDown}>
                <div className="title-bar_PF4">
                    <div className="icon-space_h_f"></div>
                    <div className="title_SVH title_zQN">{title}</div>
                </div>
            </div>
            <div className="content_XD5 content_AD7 child-opacity-transition_nkS">
                {children}
            </div>
        </div>
    );
}

const engineEffect = (react, event, setFunc) => {
    const updateEvent = event + ".update"
    const subscribeEvent = event + ".subscribe"
    const unsubscribeEvent = event + ".unsubscribe"

    return react.useEffect(() => {
        var clear = engine.on(updateEvent, (data) => {
            if (data.current) {
                // If the range is -1 <> 1 we turn it into a percentage
                if (data.min === -1) {
                    setFunc(mapToPercentage(data.current))
                } else { // otherwise its probably already a percentage?
                    setFunc(data.current)
                }
            } else {
                // console.warn(`${updateEvent} didn't have .current`, a)
                setFunc(data)
            }
        })
        engine.trigger(subscribeEvent)
        return () => {
            engine.trigger(unsubscribeEvent)
            clear.clear();
        };
    }, [])
}

const $CityMonitor = ({react}) => {
    const [electricityDemand, setElectricityDemand] = react.useState(-1)
    engineEffect(react, 'electricityInfo.electricityAvailability', setElectricityDemand)
    
    const [waterDemand, setWaterDemand] = react.useState(-1)
    engineEffect(react, 'waterInfo.waterAvailability', setWaterDemand)
    
    const [sewageDemand, setSewageDemand] = react.useState(-1)
    engineEffect(react, 'waterInfo.sewageAvailability', setSewageDemand)

    const [fireHazard, setFireHazard] = react.useState(-1)
    engineEffect(react, 'fireAndRescueInfo.averageFireHazard', setFireHazard)

    const [healthcareDemand, setHealthcareDemand] = react.useState(-1)
    engineEffect(react, 'healthcareInfo.averageHealth', setHealthcareDemand)

    return <div>
        <$Panel title="City Monitor" react={react}>
            <$Meter label="Electricity" value={electricityDemand} gradient="linear-gradient(to right,rgba(255, 78, 24, 1.000000) 0.000000%, rgba(255, 78, 24, 1.000000) 40.000000%, rgba(255, 131, 27, 1.000000) 40.000000%, rgba(255, 131, 27, 1.000000) 50.000000%, rgba(99, 181, 6, 1.000000) 50.000000%, rgba(99, 181, 6, 1.000000) 60.000000%, rgba(71, 148, 54, 1.000000) 60.000000%, rgba(71, 148, 54, 1.000000) 100.000000%)"/>
            <$Meter label="Water" value={waterDemand} gradient="linear-gradient(to right,rgba(255, 78, 24, 1.000000) 0.000000%, rgba(255, 78, 24, 1.000000) 40.000000%, rgba(255, 131, 27, 1.000000) 40.000000%, rgba(255, 131, 27, 1.000000) 50.000000%, rgba(99, 181, 6, 1.000000) 50.000000%, rgba(99, 181, 6, 1.000000) 60.000000%, rgba(71, 148, 54, 1.000000) 60.000000%, rgba(71, 148, 54, 1.000000) 100.000000%)"/>
            <$Meter label="Sewage" value={sewageDemand} gradient="linear-gradient(to right,rgba(255, 78, 24, 1.000000) 0.000000%, rgba(255, 78, 24, 1.000000) 40.000000%, rgba(255, 131, 27, 1.000000) 40.000000%, rgba(255, 131, 27, 1.000000) 50.000000%, rgba(99, 181, 6, 1.000000) 50.000000%, rgba(99, 181, 6, 1.000000) 60.000000%, rgba(71, 148, 54, 1.000000) 60.000000%, rgba(71, 148, 54, 1.000000) 100.000000%)"/>
            <$Meter label="Healthcare" value={healthcareDemand} gradient="linear-gradient(to right,rgba(255, 78, 24, 1.000000) 0.000000%, rgba(255, 78, 24, 1.000000) 40.000000%, rgba(255, 131, 27, 1.000000) 40.000000%, rgba(255, 131, 27, 1.000000) 50.000000%, rgba(99, 181, 6, 1.000000) 50.000000%, rgba(99, 181, 6, 1.000000) 60.000000%, rgba(71, 148, 54, 1.000000) 60.000000%, rgba(71, 148, 54, 1.000000) 100.000000%)"/>
            <$Meter label="Fire Hazard" value={fireHazard} gradient="linear-gradient(to right,rgba(71, 148, 54, 1.000000) 0.000000%, rgba(99, 181, 6, 1.000000) 66.000000%, rgba(255, 131, 27, 1.000000) 33.000000%, rgba(255, 78, 24, 1.000000) 100.000000%)"/>
        </$Panel>
    </div>
}

window._$hookui.registerPanel({
    id: "example.city-monitor",
    name: "City Monitor",
    icon: "Media/Game/Icons/BuildingLevel.svg",
    component: $CityMonitor
})