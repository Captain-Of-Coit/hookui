## "Scrape" list of events in the frontend

Useful to see what data the UI is currently subscribed to.

```javascript
var allEvents = {}
var clear = engine.on('*', (a,b,c) => {
    if ([//In order to make introspection a bit easier, we ignore logging some common and often updated elements, so it's easier to see the ones we care about
         'climate.temperature.update',
         'cityInfo.residentialLowDemand.update',
         'cityInfo.residentialMediumDemand.update',
         'cityInfo.residentialHighDemand.update',
         'cityInfo.industrialDemand.update',
         'cityInfo.commercialDemand.update',
         "time.ticks.update",
         "input.setActionPriority",
         "cityInfo.happinessFactors.update",
         "app.frameStats.update"
    ].includes(a)) {
        return
    }
    allEvents[a] = a
    console.log(a,b,c)
})
```

Click around in the UI after running this to trigger calls to capture, then finally execute `copy(JSON.stringify(Object.keys(allEvents), null, 2))` to get a JS array of all found events copied into your clipboard.

## "Scrape" interactive triggers

The Game UI also Triggers things on the C# part of the game. If you want to see those happening as they get triggered, you can run the snippet below in the devtools.

```javascript
function newEngineTrigger() {
    const args = arguments
    if (!["input.setActionPriority"].includes(args[0])) {
        console.log('trigger', args)
    }
    window.engine._oldTrigger.apply(this, args)
}
window.engine._oldTrigger = window.engine.trigger
window.engine.trigger = newEngineTrigger
// To undo:
window.engine.trigger = window.engine._oldTrigger
```

## Basic vanilla example

The very first code I executed in the browser devtools connected to CS2, which would present a very barebones indicator of the electricity availability. Mostly here for posterity.

```javascript
var myElement = document.createElement('div')
myElement.style.left = "300px"
myElement.style.top = "300px"
myElement.style.position = "relative"
myElement.style.color = "white"

var myLabel = document.createElement('span')
var myValue = document.createElement('span')

myLabel.innerHTML = 'Electricity'
myValue.innerHTML = 'N/A'

myElement.appendChild(myLabel)
myElement.appendChild(myValue)

document.body.appendChild(myElement)

// Subscription
var clear = engine.on('electricityInfo.electricityAvailability.update', (data) => {
    console.log(data)
    myValue.innerHTML = data.current.toString()
})
engine.trigger('electricityInfo.electricityAvailability.subscribe')
// later, unsubscribe
engine.trigger('electricityInfo.electricityAvailability.unsubscribe')
```