enum layerType {
    mapImage = 'mapImage',
    feature = 'feature'
}

interface allLayers {
    mapId: string,
    title: string,
    url: string,
    layerType: layerType,
    activeOnLoad?: boolean
}

interface groups {
    name: string,
    layers: allLayers[]
}

const allLayersUnindexed: allLayers[] = [
    {
        //0
        mapId: 'recreation',
        title: 'Recreation',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Recreation/MapServer/0',
        layerType: layerType.feature,
        activeOnLoad: true
    },
    {
        //1
        mapId: 'military',
        title: 'Military',
        layerType: layerType.mapImage,
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Military/MapServer'
    },
    {
        //2
        mapId: 'usa',
        title: 'USA',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        layerType: layerType.mapImage,
        activeOnLoad: true
    },
    {
        //3
        mapId: 'wildfire0',
        title: 'Wildfire Points',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0',
        layerType: layerType.feature
    },
    {
        //4
        mapId: 'wildfire1',
        title: 'Wildfire Line',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1',
        layerType: layerType.feature
    },
    {
        //5
        mapId: 'wildfire2',
        title: 'Wildfire Polygon',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2',
        layerType: layerType.feature
    },
    {
        //6
        mapId: 'earthquakes',
        title: 'Earthquakes Since 1970',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/MapServer/0',
        layerType: layerType.feature
    },
    {
        //7
        mapId: 'mountainLions',
        title: 'Mountain Lions',
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/MountainLion/FeatureServer/0',
        layerType: layerType.feature
    },
    {
        //8
        mapId: 'Bigfoot',
        title: 'Bigfoot',
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/BigFoot/FeatureServer/0',
        layerType: layerType.feature
    },
    {
        //9
        mapId: 'ufo',
        title: 'UFO',
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/UFOSightings/FeatureServer/0',
        layerType: layerType.feature
    },
    {
        //10
        mapId: 'squirrels',
        title: 'Central Park Squirrel Census',
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/2018_Central_Park_Squirrel_Census/FeatureServer/0',
        layerType: layerType.feature
    }

]

export const allLayers = allLayersUnindexed.map((obj, index) => ({ ...obj, index }))

const groupsUnindexed: groups[] = [
    {
        name: 'Travel',
        layers: [allLayers[2], allLayers[0]]
    },
    {
        name: 'Disasters',
        layers: [allLayers[3], allLayers[4], allLayers[5], allLayers[6]]
    },
    {
        name: 'Animal Sightings',
        layers: [allLayers[7], allLayers[8], allLayers[9], allLayers[10]]
    }
]

export const groups = groupsUnindexed.map((obj, index) => ({ ...obj, index }))