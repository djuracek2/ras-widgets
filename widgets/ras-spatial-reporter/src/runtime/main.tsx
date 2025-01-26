/* eslint-disable prefer-const */
import { React, type AllWidgetProps } from 'jimu-core'
import { useState, useEffect, useRef } from 'react'
import config from '../configs/config.json'
import { Label, Button, ButtonGroup, Select, Option } from 'jimu-ui'
import { DatePicker } from 'jimu-ui/basic/date-picker'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'



const Main = ({ sharedState }) => {

  // const [inputValidation, setInputValidation] = useState(false)
  // const [stateSel, handleStateSel] = useState('')
  // const [districtOffice, handleDistrictOffice] = useState('')
  // const [fieldOffice, handleFieldOffice] = useState('')
  // const [inputValidation, setInputValidation] = useState(false)
  // const [districtOptions, setDistrictOptions] = useState([])
  // const [officeOptions, setOfficeOptions] = useState([])
  // const graphicLayerRef = useRef<GraphicsLayer>(null)

  // useEffect(() => {
  //   if (sjmv && !graphicLayerRef.current) {
  //     const graphicsLayer = new GraphicsLayer()
  //     sjmv.view.map.add(graphicsLayer)
  //     graphicLayerRef.current = graphicsLayer
  //   }
  // }, [sjmv])


  // function zoomToDistrict (district: string) {
  //   const DistrictLayerUrl = config.queryLayers.districtLayer
  //   const DistrictLayer = new FeatureLayer({ url: DistrictLayerUrl })

  //   console.log(config)
  //   let query
  //   query = DistrictLayer.createQuery()
  //   query.where = `PARENT_NAME = '${district}'`
  //   query.returnGeometry = true
  //   query.outFields = ['*']

  //   DistrictLayer.queryFeatures(query).then(function (result) {
  //     if (result.features.length > 0) {
  //       const features = result.features[0]
  //       const symbol = {
  //         type: 'simple-fill', // autocasts as new SimpleFillSymbol()
  //         color: [0, 204, 255, 0.4],
  //         style: 'solid',
  //         outline: {
  //           color: [0, 204, 255, 0.8],
  //           width: 2
  //         }
  //       }

  //       const graphic = new Graphic({
  //         geometry: features.geometry,
  //         attributes: features.attributes,
  //         symbol: symbol
  //       })

  //       if (graphicLayerRef.current) {
  //         graphicLayerRef.current.removeAll()
  //         graphicLayerRef.current.add(graphic)
  //       } else {
  //         console.error('Graphics layer not initialized.')
  //       }
  //       if (sjmv) {
  //         sjmv.view.goTo({
  //           target: result.features[0]
  //         }).catch(function (error) {
  //           console.log('Error querying feature service.')
  //         })
  //       }
  //     }
  //   })
  // }

  // function zoomToOffice (office: string) {
  //   const OfficeLayerUrl = config.queryLayers.officeLayer
  //   const OfficeLayer = new FeatureLayer({ url: OfficeLayerUrl })

  //   console.log(config)
  //   let query
  //   query = OfficeLayer.createQuery()
  //   query.where = `ADMU_NAME = '${office}'`
  //   query.returnGeometry = true
  //   query.outFields = ['*']

  //   OfficeLayer.queryFeatures(query).then(function (result) {
  //     if (result.features.length > 0) {
  //       const features = result.features[0]
  //       const symbol = {
  //         type: 'simple-fill', // autocasts as new SimpleFillSymbol()
  //         color: [0, 204, 255, 0.4],
  //         style: 'solid',
  //         outline: {
  //           color: [0, 204, 255, 0.8],
  //           width: 2
  //         }
  //       }

  //       const graphic = new Graphic({
  //         geometry: features.geometry,
  //         attributes: features.attributes,
  //         symbol: symbol
  //       })

  //       if (graphicLayerRef.current) {
  //         graphicLayerRef.current.removeAll()
  //         graphicLayerRef.current.add(graphic)
  //       } else {
  //         console.error('Graphics layer not initialized.')
  //       }
  //       if (sjmv) {
  //         sjmv.view.goTo({
  //           target: result.features[0]
  //         }).catch(function (error) {
  //           console.log('Error querying feature service.')
  //         })
  //       }
  //     }
  //   })
  // }

  // function queryOffice () {
  //   const OfficeLayerUrl = config.queryLayers.officeLayer
  //   const OfficeLayer = new FeatureLayer({ url: OfficeLayerUrl })

  //   console.log(config)
  //   let query
  //   query = OfficeLayer.createQuery()
  //   query.where = `ADMIN_ST = '${stateSel}'`
  //   query.returnGeometry = true
  //   query.outFields = ['*']

  //   OfficeLayer.queryFeatures(query).then(function (result) {
  //     if (result.features.length > 0) {
  //       console.log(result.features)
  //       const features = result.features
  //       console.log(features)
  //       setOfficeOptions(features)
  //     }
  //   })
  // }

  // function queryDistrict () {
  //   const DistrictLayerUrl = config.queryLayers.districtLayer
  //   const DistrictLayer = new FeatureLayer({ url: DistrictLayerUrl })

  //   console.log(config)
  //   let query
  //   query = DistrictLayer.createQuery()
  //   query.where = `ADMIN_ST = '${stateSel}'`
  //   query.returnGeometry = true
  //   query.outFields = ['*']

  //   DistrictLayer.queryFeatures(query).then(function (result) {
  //     if (result.features.length > 0) {
  //       console.log(result.features)
  //       const features = result.features
  //       console.log(features)
  //       setDistrictOptions(features)
  //     }
  //   })
  // }

  // useEffect(() => {
  //   const stateLayerUrl = config.queryLayers.stateLayer
  //   const stateLayer = new FeatureLayer({ url: stateLayerUrl })

  //   console.log(config)
  //   let query
  //   query = stateLayer.createQuery()
  //   query.where = `ADMIN_ST = '${stateSel}'`
  //   query.returnGeometry = true
  //   query.outFields = ['*']

  //   stateLayer.queryFeatures(query).then(function (result) {
  //     if (result.features.length > 0) {
  //       console.log(result.features)
  //       const features = result.features[0]
  //       const symbol = {
  //         type: 'simple-fill', // autocasts as new SimpleFillSymbol()
  //         color: [0, 204, 255, 0.4],
  //         style: 'solid',
  //         outline: {
  //           color: [0, 204, 255, 0.8],
  //           width: 2
  //         }
  //       }

  //       const graphic = new Graphic({
  //         geometry: features.geometry,
  //         attributes: features.attributes,
  //         symbol: symbol
  //       })

  //       if (graphicLayerRef.current) {
  //         graphicLayerRef.current.removeAll()
  //         graphicLayerRef.current.add(graphic)
  //       } else {
  //         console.error('Graphics layer not initialized.')
  //       }
  //       // features.attributes.EMAIL_ID = 'Derek Test'
  //       // if (sjmv) {
  //       sjmv.view.goTo({
  //         target: result.features[0]
  //         // zoom: 16
  //       }).catch(function (error) {
  //         console.log('Error querying feature service.')
  //       })
  //     }
  //   })
  //   queryDistrict()
  //   queryOffice()
  // }, [stateSel])

  // const handleStateChange = (event) => {
  //   handleStateSel(event.target.value)
  //   console.log(stateSel)
  // }

  // const handleDistrictOfficeChange = (event) => {
  //   const district = event.target.value
  //   handleDistrictOffice(event.target.value)
  //   zoomToDistrict(district)
  //   // queryOffice()

  //   console.log(districtOffice)
  // }

  // const handleFieldOfficeChange = (event) => {
  //   const office = event.target.value
  //   handleFieldOffice(office)
  //   zoomToOffice(office)
  //   console.log(fieldOffice)
  // }

  return (
<div>

    <div className='d-flex justify-content-center'>
    </div>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '0px',
      paddingRight: '10px'
    }}>
      <div style={{ width: '150px' }}>
    <Label>
      State:
          <Select
              direction="down"
              placeholder="Select a state..."
              style={{ width: '150px' }}
              onChange={sharedState.handleStateChange}
            >
              <Option value="AZ">
                Arizona
              </Option>
              <Option value="CA">
                California
              </Option>
              <Option value="CO">
                Colorado
              </Option>
              <Option value="ID">
                Idaho
              </Option>
              <Option value="MT">
                Montana
              </Option>
              <Option value="NV">
                Nevada
              </Option>
              <Option value="NM">
                New Mexico
              </Option>
              <Option value="OR">
                Oregon
              </Option>
              <Option value="UT">
                utah
              </Option>
              <Option value="WY">
                Wyoming
              </Option>
            </Select>
        </Label>
        </div>

        <div style={{ width: '150px' }}>
          <Label>
          District Offices:
          <Select
            direction="down"
            placeholder="Select a destination..."
            onChange={sharedState.handleDistrictOfficeChange}
          >
            <Option value={'Select a Distric'}>Select a District...</Option>
           {sharedState.districtOptions?.map(district =>
            <Option
            value={district.attributes.PARENT_NAME}>
                {district.attributes.PARENT_NAME}
            </Option>
           )}
        </Select>
      </Label>
      </div>
      <div style={{ width: '150px' }}>
      <Label>
          Field Offices:
          <Select
            direction="down"
            placeholder="Select a destination..."
            onChange={sharedState.handleFieldOfficeChange}
          >
             <Option value={'Select a Office'}>Select a Office...</Option>
           {sharedState.officeOptions?.map(district =>
            <Option
            value={district.attributes.PARENT_CD}>
                {district.attributes.ADMU_NAME}
            </Option>
           )}
          </Select>
        </Label>
        </div>
      </div>
    <div>
    </div>
    <div className='d-flex justify-content-center'>
    <ButtonGroup size="default">
      <Button
        aria-pressed="false"
        type="primary"
        disabled={!sharedState.inputValidation}
        onClick={sharedState.runQuery}
      >
        Search
      </Button>
      <Button type="primary" disabled={!sharedState.inputValidation} onClick={sharedState.handleRefresh}>
        Refresh
      </Button>
      <Button type="primary" disabled={!sharedState.inputValidation} onClick={sharedState.handleCancel}>
       Cancel
      </Button>
    </ButtonGroup>
    </div>
  </div>)
}
export default Main
