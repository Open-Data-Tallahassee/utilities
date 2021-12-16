// import modules
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { fromJS } from 'immutable'
import { siteMetadata } from '../../../gatsby-config'
import { sources, layers } from '../../../config/map'
import styled from '../../../util/style'

// wrapper component
const Wrapper = styled.div`
    height: 100%;
`

const MapContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0; 
`
const Sidebar = styled.div`
    position: absolute;
    overflow-y: auto;
    height: 200px;
    top: calc(47px + 30px);
    z-index: 4000;
    background-color: #fff;
    width: 340px;
    padding: 10px;
    border-radius: 0;
    color: #29323c;
    right: 30px;
    margin: auto;
    box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 1px 1px rgba(16, 22, 26, 0.2), 0 2px 6px rgba(16, 22, 26, 0.2);
`


// mapbox token
const mapboxToken = siteMetadata.mapboxToken

// map component
const Map = () => {

    if (!mapboxToken) {
        console.error(
            'ERROR: Mapbox token is required in gatsby-config.js siteMetadata'
        )
    }

    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const baseStyleRef = useRef(null) 
    
    // initialize map when component mounts
    useEffect(() => {
        mapboxgl.accessToken = siteMetadata.mapboxToken
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: `mapbox://styles/mapbox/light-v10`,
            center: [-84.28, 30.44],
            zoom: 11, 
            minZoom: 5
        })

        mapRef.current = map
        window.map = map

        map.on('load', () => { 

            // snapshot existing map config
            baseStyleRef.current = fromJS(map.getStyle())
            window.baseStyle = baseStyleRef.current
            
            // add every source
            Object.entries(sources).forEach(([id, source]) => {
                map.addSource(id, source)
            })
            
            // add every layer to the map 
            // layers is an array of the individual layers
            layers.forEach(layer => {
                map.addLayer(layer)
            })

            map.resize();
        });

        map.on('click', function(mapElement) {
            // when you click a point on the map, query the features under the point and store
            // in the variable 'features'
            const features = map.queryRenderedFeatures(mapElement.point, {
                layers: ['points-fill']
            })

            const html = `
            <b>Disconnection Date:</b> ${features[0].properties.Date}
            `;

            // create tooltip variable for the floating card div
            const tooltip = document.getElementById('floating-card')
            
            // store html in the tooltip, which will be displayed in the floating card div
            tooltip.innerHTML = html
            
        });

        // change cursor to pointer when hovering over a point
        map.on('mouseenter', function(mapElement) {
            // when you hover over a point on the map, query the features under the point and store
            // in the variable 'features'
            const features = map.queryRenderedFeatures(mapElement.point, {
                layers: ['points-fill']
            })
            // if there's something under the point (the features variable is not null)
            // then change the style of the cursor to pointer
            // to signal that you can click here
            if (features.length) {
                map.getCanvas().style.cursor = 'pointer';
            }
        });

        // change the cursor back to the "grabbing" mouse when you're not hovering over a clickable feature -- which is just a district
        map.on('mouseleave', function () {
            map.getCanvas().style.cursor = '';
        });

        // clean up on unmount
        return () => map.remove();
    
    }, [])

    return (
    <Wrapper>
        <MapContainer ref={mapContainer} style={{ width: '100%', height: '100%' }}/>
        <Sidebar>
            <div id="floating-card">
                <b>Over 4,200 City of Tallahassee Utility customers were disconnected from 04/24/2021 - 05/24/2021 for non-payment.</b>
            </div>
            </Sidebar>
    </Wrapper>
    )

}

export default Map