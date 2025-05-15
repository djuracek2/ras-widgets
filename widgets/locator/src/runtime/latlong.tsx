import React, { useState } from 'react'

import { Button, Icon, TextInput } from 'jimu-ui'
import { useRef, useEffect } from 'react'
// import Point from '@arcgis/core/geometry/Point'
// import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'

const LatLong = ({ jmv }) => {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const graphicLayerRef = useRef(null)

//   useEffect(() => {
//     if (jmv && !graphicLayerRef.current) {
//       const graphicsLayer = new GraphicsLayer({
//         title: 'Point'
//       })
//       graphicLayerRef.current = graphicsLayer
//     }
//   }, [jmv])

  function Search () {
    console.log('search triggered...')
  }

  function handleLat (event) {
    setLatitude(event.target.value)
  }

  function handleLong (event) {
    setLongitude(event.target.value)
  }
  return (
    <div style={{ fontSize: '14px' }}>
        <div style= {{ display: 'flex', justifyContent: 'left', gap: '20px', padding: '20px' }}>
          <div>
            <div>
                <label>Enter Latitude, ex. 34.8954</label>
            </div>
            <div>
            <TextInput
                onAcceptValue={handleLat}
                value={latitude}
                type="text"
                />
            </div>
            <div>
                <label>Enter Longitude, ex. -104.4573</label>
            </div>
            <div>
            <TextInput
                onAcceptValue={handleLong}
                value={longitude}
                type="text"
                />
            </div>
            <br></br>
            <div>
            <Button
                aria-label="Button"
                icon
                onClick={Search}
                size="lg">
                    Search
            </Button>
            </div>
          </div>
        </div>
        <div>
        </div>
    </div>
  )
}
export default LatLong
