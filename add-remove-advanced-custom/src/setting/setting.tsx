import { React } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { Label, NumericInput, Switch } from 'jimu-ui'

const Setting = (props: AllWidgetSettingProps<any>) => {
    const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
        props.onSettingChange({
            id: props.id,
            useMapWidgetIds: useMapWidgetIds
        })
    }

    const handleIndex = (value: number) => {
        props.onSettingChange({
            id: props.id,
            config: props.config.set('index', value)
        })
    }

    const handleDelay = (value: number) => {
        props.onSettingChange({
            id: props.id,
            config: props.config.set('delay', value)
        })
    }

    const handleGroups = () => {
        props.onSettingChange({
            id: props.id,
            config: props.config.set('userGroups', !props.config.userGroups)
        })
    }

    const handleButton = () => {
        props.onSettingChange({
            id: props.id,
            config: props.config.set('button', !props.config.button)
        })
    }

    return (
        <div className="widget-setting">
            <p>This widget must be used with a Map Widget.</p>
            <p>This widget_id is: {props.widgetId}</p>
            <MapWidgetSelector
                useMapWidgetIds={props.useMapWidgetIds}
                onSelect={onMapWidgetSelected}
            />
            <hr></hr>
            <p>This widget will add layers starting at the index number specified below. Note: Defaults to lowest possible operational layer at index 0.</p>
            <Label className='w-100'>
                Start adding layers at index:
                <NumericInput
                    className="w-100"
                    onAcceptValue={(value) => handleIndex(value)}
                    size="default"
                    defaultValue={props.config.index}
                    value={props.config.index}
                    step={1}
                    precision={0}
                    min={0}
                />
            </Label>
            <hr></hr>
            <p>Layers will be initially loaded in a "random" order. This will correct itself after the number of milliseconds specified below. Set this value slightly higher than the amount of time it takes for the most complex group change to complete. Default value 5 seconds (5000 milliseconds).</p>
            <Label className='w-100'>
                Reordering delay:
                <NumericInput
                    className="w-100"
                    onAcceptValue={(value) => handleDelay(value)}
                    size="default"
                    defaultValue={props.config.delay}
                    value={props.config.delay}
                    step={1}
                    precision={0}
                    min={1000}
                />
            </Label>
            <Label>
                Allow User Created Groups
                <Switch
                    checked={props.config.userGroups}
                    onChange={() => handleGroups()}
                ></Switch>
            </Label>
            <Label>
                Default Layer Order Button
                <Switch
                    checked={props.config.button}
                    onChange={() => handleButton()}
                ></Switch>
            </Label>
        </div>
    )
}

export default Setting