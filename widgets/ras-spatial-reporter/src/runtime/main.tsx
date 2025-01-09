import { React, type AllWidgetProps } from 'jimu-core'
import { useState, useEffect, useRef } from 'react'
import config from '../configs/config.json'
import { Checkbox, Label, Switch, TextInput, Button, ButtonGroup, Select, Option, CollapsablePanel, Radio } from 'jimu-ui'
import { DatePicker } from 'jimu-ui/basic/date-picker'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Graphic from '@arcgis/core/Graphic'

import AcceptModal from './modals/acceptmodal'
import RejectModal from './modals/rejectmodal'
import { array } from 'prop-types'

const Main = ({ success, failure, sjmv }) => {
  const [approve, setApprove] = useState(false)
  const [reject, setReject] = useState(false)
  const [isAccept, setIsAccept] = useState(false)
  const [isReject, setIsReject] = useState(false)
  const [stateSel, handleStateSel] = useState(false)
  const [districtOffice, handleDistrictOffice] = useState(false)
  const [fieldOffice, handleFieldOffice] = useState(false)
  const [inputValidation, setInputValidation] = useState(false)
  const [districtOptions, setDistrictOptions] = useState([])
  const [officeOptions, setOfficeOptions] = useState([])
  const graphicLayerRef = useRef<GraphicsLayer>(null)

  const toggleAcceptModal = () => { setIsAccept(!isAccept) }
  const toggleRejectModal = () => { setIsReject(!isReject) }
  const handleApproveRejectReset = () => {
    setApprove(false)
    setReject(false)
  }

  const acceptWorkflow = () => {
    setIsAccept(false)
  }

  const rejectWorkflow = () => {
    console.log('reject feature')

    setIsReject(false)
  }

  const runQuery = () => {

  }

  useEffect(() => {
    if (sjmv && !graphicLayerRef.current) {
      const graphicsLayer = new GraphicsLayer()
      sjmv.view.map.add(graphicsLayer)
      graphicLayerRef.current = graphicsLayer
    }
  }, [sjmv])

  const handleReset = () => {
    // setFormData({
    //   IdText: "",
    //   officeText: "",
    //   approvalMode: "",

    // })
    // setApprovedText('')
    // setSuccess(false)
    // setFailure(false)
    // graphicLayerRef.current.removeAll()
  }

  //   function zoomToState(stateVal) {
  //     if(stateVal != "Select State")
  //     {
  //         var zoomStateTask = new QueryTask(widgetContext.appConfig.queryLayers.stateLayer)
  //         var zoomQuery = new Query;
  //         zoomQuery.outFields = ["*"];
  //         zoomQuery.returnGeometry = true;
  //         var queryString = "ADMIN_ST = '" + stateVal + "'";
  //         zoomQuery.where  =   queryString;
  //         zoomStateTask.execute(zoomQuery, this.zoomSectionResults);
  //     }
  //     else{
  //         widgetContext.shelter.hide();
  //         widgetContext.map.graphics.clear();
  //         widgetContext.map.setExtent(widgetContext.map.extent);
  //     }
  // }

  function zoomToDistrict () {
    const DistrictLayerUrl = config.queryLayers.districtLayer
    const DistrictLayer = new FeatureLayer({ url: DistrictLayerUrl })

    console.log(config)
    let query
    query = DistrictLayer.createQuery()
    query.where = `PARENT_NAME = '${districtOffice}'`
    query.returnGeometry = true
    query.outFields = ['*']

    DistrictLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        const features = result.features[0]
        const symbol = {
          type: 'simple-fill', // autocasts as new SimpleFillSymbol()
          color: [0, 204, 255, 0.4],
          style: 'solid',
          outline: {
            color: [0, 204, 255, 0.8],
            width: 2
          }
        }

        const graphic = new Graphic({
          geometry: features.geometry,
          attributes: features.attributes,
          symbol: symbol
        })

        if (graphicLayerRef.current) {
          graphicLayerRef.current.removeAll()
          graphicLayerRef.current.add(graphic)
        } else {
          console.error('Graphics layer not initialized.')
        }
        if (sjmv) {
          sjmv.view.goTo({
            target: result.features[0]
          }).catch(function (error) {
            console.log('Error querying feature service.')
          })
        }
      }
    })
  }

  function zoomToOffice () {
    const OfficeLayerUrl = config.queryLayers.officeLayer
    const OfficeLayer = new FeatureLayer({ url: OfficeLayerUrl })

    console.log(config)
    let query
    query = OfficeLayer.createQuery()
    query.where = `ADMU_NAME = '${fieldOffice}'`
    query.returnGeometry = true
    query.outFields = ['*']

    OfficeLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        const features = result.features[0]
        const symbol = {
          type: 'simple-fill', // autocasts as new SimpleFillSymbol()
          color: [0, 204, 255, 0.4],
          style: 'solid',
          outline: {
            color: [0, 204, 255, 0.8],
            width: 2
          }
        }

        const graphic = new Graphic({
          geometry: features.geometry,
          attributes: features.attributes,
          symbol: symbol
        })

        if (graphicLayerRef.current) {
          graphicLayerRef.current.removeAll()
          graphicLayerRef.current.add(graphic)
        } else {
          console.error('Graphics layer not initialized.')
        }
        if (sjmv) {
          sjmv.view.goTo({
            target: result.features[0]
          }).catch(function (error) {
            console.log('Error querying feature service.')
          })
        }
      }
    })
  }

  function queryOffice () {
    const OfficeLayerUrl = config.queryLayers.officeLayer
    const OfficeLayer = new FeatureLayer({ url: OfficeLayerUrl })

    console.log(config)
    let query
    query = OfficeLayer.createQuery()
    query.where = `ADMIN_ST = '${stateSel}'`
    query.returnGeometry = true
    query.outFields = ['*']

    OfficeLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        console.log(result.features)
        const features = result.features
        console.log(features)
        setOfficeOptions(features)
        // if (sjmv) {
        //   sjmv.view.goTo({
        //     target: result.features[0],
        //     zoom: 16
        //   }).catch(function (error) {
        //     console.log('Error querying feature service.')
        //   })
        // }
      }
    })
  }

  function queryDistrict () {
    const DistrictLayerUrl = config.queryLayers.districtLayer
    const DistrictLayer = new FeatureLayer({ url: DistrictLayerUrl })

    console.log(config)
    let query
    query = DistrictLayer.createQuery()
    query.where = `ADMIN_ST = '${stateSel}'`
    query.returnGeometry = true
    query.outFields = ['*']

    DistrictLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        console.log(result.features)
        const features = result.features
        console.log(features)
        setDistrictOptions(features)
      }
    })
  }

  useEffect(() => {
    const stateLayerUrl = config.queryLayers.stateLayer
    const stateLayer = new FeatureLayer({ url: stateLayerUrl })

    console.log(config)
    let query
    query = stateLayer.createQuery()
    query.where = `ADMIN_ST = '${stateSel}'`
    query.returnGeometry = true
    query.outFields = ['*']

    stateLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        console.log(result.features)
        const features = result.features[0]
        console.log(features)
        // features.attributes.EMAIL_ID = 'Derek Test'
        // if (sjmv) {
        sjmv.view.goTo({
          target: result.features[0]
          // zoom: 16
        }).catch(function (error) {
          console.log('Error querying feature service.')
        })
      }
    })
    queryDistrict()
    queryOffice()
  }, [stateSel])

  //zooms to plss search results
  //  zoomSectionResults: function (results) {

  //     if (results.features.length > 0) {
  //         widgetContext.map.graphics.clear();

  //         var symbol =  new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
  //                 new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([55, 0, 200]), 2),
  //                 new esri.Color([255, 255, 0, 0.25]));

  //         //Geometry Display

  //         var geometry = results.features[0].geometry;
  //         var graphic = new Graphic(geometry, symbol);
  //         widgetContext.map.graphics.add(graphic);
  //         widgetContext.map.setExtent(graphic._extent.expand(2));
  //         widgetContext.shelter.hide();
  //     } else {
  //         window.alert("Sorry, but the application did not find valid State/district/Field Offices. Please try again.\n");
  //     }
  // },

  // function zoomToDistrict(districtVal) {
  //     if(districtVal != "Select District Office" &&  districtVal != "0")
  //     {
  //         var zoomdistrictTask = new QueryTask(widgetContext.appConfig.queryLayers.districtLayer)
  //         var zoomQuery = new Query;
  //         zoomQuery.outFields = ["*"];
  //         zoomQuery.returnGeometry = true;
  //         var queryString = "PARENT_CD = '" + districtVal + "'";
  //         zoomQuery.where  =   queryString;
  //         zoomdistrictTask.execute(zoomQuery, this.zoomSectionResults);
  //     }
  // }
  // function zoomToOffice (officeVal) {
  //     if(officeVal != "Select Field Office" && officeVal != "0")
  //     {
  //         var zoomOfficeTask = new QueryTask(widgetContext.appConfig.queryLayers.officeLayer)
  //         var zoomQuery = new Query;
  //         zoomQuery.outFields = ["*"];
  //         zoomQuery.returnGeometry = true;
  //         var queryString = "ADM_UNIT_CD = '" + officeVal + "'";
  //         zoomQuery.where  =   queryString;
  //         zoomOfficeTask.execute(zoomQuery, this.zoomSectionResults);
  //         this._populateAllotmentGroup(officeVal);
  //         this._populateAllotments(officeVal);
  //     }
  // }

  const handleStateChange = (event) => {
    handleStateSel(event.target.value)
    console.log(stateSel)
  }

  const handleDistrictOfficeChange = (event) => {
    handleDistrictOffice(event.target.value)
    zoomToDistrict()
    // queryOffice()

    console.log(districtOffice)
  }

  const handleFieldOfficeChange = (event) => {
    handleFieldOffice(event.target.value)
    zoomToOffice()
    console.log(fieldOffice)
  }

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
              onChange={handleStateChange}
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
            onChange={handleDistrictOfficeChange}
          >
            <Option value={'Select a Distric'}>Select a District...</Option>
           {districtOptions?.map(district =>
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
            onChange={handleFieldOfficeChange}
          >
             <Option value={'Select a Office'}>Select a Office...</Option>
           {officeOptions?.map(district =>
            <Option
            value={district.attributes.ADMU_NAME}>
                {district.attributes.ADMU_NAME}
            </Option>
           )}
          </Select>
        </Label>
        </div>
      </div>
    <div>
      {/* { success ? <Label className="success">Feature successfully updated!</Label> : ''}
      { failure ? <Label className="unsuccessful">Feature was unable to updated.</Label> : ''} */}
    </div>
    <div className='d-flex justify-content-center'>
    <ButtonGroup size="default">
      <Button
        aria-pressed="false"
        type="primary"
        disabled={!inputValidation}
        onClick={runQuery}
      >
        Approve
      </Button>
      <Button type="primary" disabled={!inputValidation} onClick={toggleRejectModal}>
        Reject
      </Button>
      <Button type="primary" disabled={!inputValidation} onClick={handleReset}>
        Reset
      </Button>
    </ButtonGroup>
    </div>
    <AcceptModal isOpen={isAccept} toggle={toggleAcceptModal} acceptWorkflow={acceptWorkflow} />
    <RejectModal isOpen={isReject} toggle= {toggleRejectModal} rejectWorkflow={rejectWorkflow} />
  </div>)
}
export default Main
