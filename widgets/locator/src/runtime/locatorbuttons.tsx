import React, { useRef, useEffect, useState } from 'react'
import { Button, Label } from 'jimu-ui'
import GraphicsLayer from "esri/layers/GraphicsLayer"
import Graphic from '@arcgis/core/Graphic'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Draw from '@arcgis/core/views/draw/Draw'
import PointDrawAction from '@arcgis/core/views/draw/PointDrawAction'
import { PinEsriOutlined } from 'jimu-icons/outlined/gis/pin-esri'
import { PolylineOutlined } from 'jimu-icons/outlined/gis/polyline'
import { DataPolygonOutlined } from 'jimu-icons/outlined/gis/data-polygon'

const LocatorButtons = ({ jmv }) => {
    console.log(GraphicsLayer)
//   const pointGraphics = useRef<GraphicsLayer | null>(null)
//   const lineGraphics = useRef<GraphicsLayer | null>(null)
//   const polygonGraphics = useRef<GraphicsLayer | null>(null)

  const [tempView, setTempView] = useState(null)

  function triggerPoint () {
    console.log('trigger point...')

//     const action = Draw.create('point')

//     // PointDrawAction.cursor-update
//     // Give a visual feedback to users as they move the pointer over the view
//     action.on('cursor-update', function (evt) {
//       createPointGraphic(evt.coordinates)
//     })

//     // PointDrawAction.draw-complete
//     // Create a point when user clicks on the view or presses the "Enter" key.
//     action.on('draw-complete', function (evt) {
//       createPointGraphic(evt.coordinates)
//     })
//   }

//   function createPointGraphic (coordinates) {
//     jmv.view.graphics.removeAll()
//     const point = {
//       type: 'point', // autocasts as /Point
//       x: coordinates[0],
//       y: coordinates[1],
//       spatialReference: jmv.view.spatialReference
//     }

//     const graphic = new Graphic({
//       geometry: point,
//       symbol: {
//         type: 'simple-marker', // autocasts as SimpleMarkerSymbol
//         style: 'square',
//         color: 'red',
//         size: '16px',
//         outline: { // autocasts as SimpleLineSymbol
//           color: [255, 255, 0],
//           width: 3
//         }
//       }
//     })
//     jmv.view.graphics.add(graphic)
  }

  function triggerLine () {

  }

  function triggerPolygon () {

  }

  useEffect(() => {
    setTempView(jmv)
    console.log(jmv)
    addGraphicLayers(jmv)
  }, [jmv])

  //   console.log(jmv)

  function addGraphicLayers (jmv) {
    if (jmv) {
        // console.log(GraphicsLayer)
    //   pointGraphics.current = new GraphicsLayer({})
    //   lineGraphics.current = new GraphicsLayer({})
    //   polygonGraphics.current = new GraphicsLayer({})

    //   jmv.view.map.add(pointGraphics.current)
    //   jmv.view.map.add(polygonGraphics.current)
    //   jmv.view.map.add(lineGraphics.current)
    }
  }

  //   tempView.view.map.add(pointGraphics.current)
  //   tempView.view.map.add(pointGraphics.current)
  //   tempView.view.map.add(lineGraphics.current)
  //     }
  //   }, [tempView])

  return (
    <div style={{ fontSize: '14px' }}>
        <label><strong>Locate your project boundary (required)</strong></label>
        <div><Label>Draw your project boundary*</Label></div>
        <div style= {{ display: 'flex', justifyContent: 'left', gap: '20px', paddingBottom: '20px' }}>
            <Button
                aria-label="Button"
                icon
                onClick={triggerPoint}
                size="lg">
            <PinEsriOutlined
                size={20}/>
            </Button>
            <Button
                aria-label="Button"
                icon
                onClick={triggerLine}
                size="lg">
            <PolylineOutlined
                size={20}/>
            </Button>
            <Button
                aria-label="Button"
                icon
                onClick={triggerPolygon}
                size="lg">
            <DataPolygonOutlined
                size={20}/>
            </Button>
        </div>
        <div>
        <h6>OR</h6>
        <label><strong>Need Help Locating</strong></label>
        </div>
    </div>
  )
}
export default LocatorButtons
