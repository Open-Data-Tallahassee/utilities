// store map configuration & layers

// initial conditions
export const config = {
    accessToken: "pk.eyJ1IjoicGFzaWgiLCJhIjoiY2pybzJqdTVjMHJzeDQ0bW80aGdzaXV3ayJ9.yxD8Nqu7FLnf8-lBo7F1zQ",
    minZoom: 5,
    padding: 0.1
}

// sources for the map layers
export const sources = {
    // points: {
    //     type: 'geojson',
    //     data: 'https://raw.githubusercontent.com/Open-Data-Tallahassee/utilities/dev/data/clean/disconnections/05242021_10242021.geojson',
    // },
    polygons: {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/Open-Data-Tallahassee/utilities/dev/data/disconnected_09242021.geojson',
    },
}

// settings for the map layers
export const layers = [
    {
        id: "polygons-fill",
        source: 'polygons',
        type: 'fill',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'disconnections'],
                // // palette from colorbrewer.com ['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15']
                '#fee5d9', // 0
                1,
                '#fcbba1', // 1 to 99
                100,
                '#fc9272', // 100 to 499
                500,
                '#fb6a4a', // 500 to 999
                1000,
                '#de2d26', // 1000 to 1999
                1999,
                '#a50f15', // 2000 and more
            ],
            'fill-outline-color': 'white',
            'fill-opacity': 0.75
        }
    }, 
    {
        id: 'zip-label',
        type: 'symbol',
        source: 'polygons',
        layout: {
        	'text-field': ['get', 'GEOID20'],
          
        },
        'paint': {
            'text-color': 'black'
        }
    }
    // {
    //   id: "points-fill",
    //   source: 'points',
    //   type: 'circle',
    //   paint: {
    //     'circle-color': 'black',
    //     'circle-radius': {
    //         'base': 1.75,
    //         'stops': [
    //             [12, 2],
    //             [22, 180]
    //         ]
    //     },
    //     // 'circle-outline-color': 'white'
    //   },
    //   layout: {
    //     visibility: 'visible',
    //     },
    // }
]