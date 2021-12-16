// import modules
import React, { useEffect, useRef } from 'react'
import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { fromJS } from 'immutable'
import { siteMetadata } from '../../../gatsby-config'
import { sources, layers } from '../../../config/map'
import styled from '../../../util/style'
import './map.css'

// wrapper component
// const Wrapper = styled.div`
//     height: 100%;
// `

// const MapContainer = styled.div`
//     position: absolute;
//     top: 500;
//     bottom: 0;
//     left: 0;
//     right: 0; 
// `
// const Sidebar = styled.div`
//     position: absolute;
//     overflow-y: auto;
//     height: 200px;
//     top: calc(47px + 30px);
//     z-index: 4000;
//     background-color: #fff;
//     width: 340px;
//     padding: 10px;
//     border-radius: 0;
//     color: #29323c;
//     right: 30px;
//     margin: auto;
//     box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 1px 1px rgba(16, 22, 26, 0.2), 0 2px 6px rgba(16, 22, 26, 0.2);
// `


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
            zoom: 10, 
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
                layers: ['polygons-fill']
            })

            const html = `
            <b>Number of Disconnections:</b> ${features[0].properties.disconnections}
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
                layers: ['polygons-fill']
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

        // Add geolocate control to the map.
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
            })
        );

        // add navigation
        map.addControl(new mapboxgl.NavigationControl());

        // clean up on unmount
        return () => map.remove();
    
    }, [])

    return (
        <div className="wrapper">
            {/* title and map */}
            <div className="main">
                {/* title */}
                <div className="title">
                    <div className='title-text'>Leon County Zip Codes with Utility Shutoffs (9/24/21 to 11/24/2021)</div>
                    <div id="floating-card" className='floating-card'>Click around the map to see disconnections per zip code</div>
                </div>
                {/* map */}
                <div className="mapContainer">
                    <div className="map" ref={mapContainer} />
                </div>
                {/* legend */}
                <div className='legend'>
                    <div className='legend-scale'>
                        <div className='legend-labels'>
                            <div><span style={{background:'#fee5d9'}}></span><b>0</b></div>
                            <div><span style={{background:'#fcbba1'}}></span><b>1-99</b> <br/> 32317</div>
                            <div><span style={{background:'#fc9272'}}></span><b>100-499</b> <br/> 32311, 32309, 32312</div>
                            <div><span style={{background:'#fb6a4a'}}></span><b>500-999</b> <br/> 32305, 32310, 32308</div>
                            <div><span style={{background:'#de2d26'}}></span><b>1,000-1,999</b> <br/> 32303, 32301</div>
                            <div><span style={{background:'#a50f15'}}></span><b>2000+</b> <br/> 32304</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    // <Wrapper>
    //     <MapContainer ref={mapContainer} style={{ width: '100%', height: '100%' }}/>
    //     <Sidebar>
    //         <div id="floating-card">
    //             <b>Almost _____ City of Tallahassee Utility customers have been disconnected for non-payment since the utility moratorium ended.</b>
    //         </div>
    //     </Sidebar>
    // </Wrapper>
    )

}

export default Map