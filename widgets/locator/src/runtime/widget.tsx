import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { useState } from 'react'
import './app.css'
import { type IMConfig } from '../config'
import Header from './header'
import LocatorButtons from './locatorbuttons'
import LatLonLocator from './latlonglocator'
import LocateLo from './locatelo'

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>()

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      console.log(jmv)
      // jmv.view.whenLayerView(featureLayerRef.current).then((layerView) => {
      //   jmv.view.watch('scale', (isUpdating) => {
      //     if (isUpdating) {
      //       if (appNumber && localityRecords > 0) {
      //         featureLayerRef.current.definitionExpression = defExpression
      //       }
      //     }
      //   })
      // })
      setJimuMapView(jmv)
    }
  }
  return (
    <div className="widget-demo jimu-widget m-2">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}

      <Header />
      <div className="div-body">
      {jimuMapView
        ? (
              <><LocatorButtons jmv={jimuMapView} />
              <LatLonLocator jmv={jimuMapView} />
              <LocateLo /></>
          )
        : (
            ''
          )}
      </div>
    </div>
  )
}

export default Widget
