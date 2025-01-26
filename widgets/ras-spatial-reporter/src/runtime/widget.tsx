/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */

import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { Checkbox, Label, Switch, TextInput, Button, ButtonGroup, Select, Option, CollapsablePanel, Radio, Loading } from "jimu-ui";
import { DatePicker } from 'jimu-ui/basic/date-picker'
import { useState, useEffect, useRef } from 'react'
import AcceptModal from './modals/acceptmodal'
import RejectModal from './modals/rejectmodal'
import Graphic from "@arcgis/core/Graphic"
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { JimuFeatureLayerView, JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import Main from "./main";
import Allotments from "./allotments";
import Authorizations from "./authorizations";
import BilledUse from "./billeduse";
import Inspections from "./inspections";
import Footer from "./footer"
import Header from "./header";
import config from '../configs/config.json'
import { FixedAnimationSetting } from "dist/widgets/common/controller/src/setting/fixed-layout-setting/animation-setting";

 const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [sjmv, setJimuMapView] = useState<JimuMapView>()
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [checked, isChecked] = useState(false)
  const [appCheck, isAppCheck] = useState(false)
  const [appRej, isAppRej] = useState(false)
  const [stateSel, handleStateSel] = useState('')
  const [districtOffice, handleDistrictOffice] = useState('')
  const [fieldOffice, handleFieldOffice] = useState('')
 
  const [districtOptions, setDistrictOptions] = useState([])
  const [officeOptions, setOfficeOptions] = useState([])
  const graphicLayerRef = useRef<GraphicsLayer>(null)
  const [approvedText, setApprovedText] = useState('')
  const [itemObjId, setItemObjId] = useState('')
  const [feature, setSelectedFeature] = useState({})
  const [defExpression, setDefExpression] = useState('')
  const [allotment, setAllotmentNumber] = useState('')
  const [officeId, setOfficeId] = useState('')

  const [inputValidation, setInputValidation] = useState(true)

  const [viewReady, setViewReady] = useState(false)
  const featureLayerRef = useRef<FeatureLayer>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sjmv && !graphicLayerRef.current) {
      const graphicsLayer = new GraphicsLayer()
      sjmv.view.map.add(graphicsLayer)
      graphicLayerRef.current = graphicsLayer
    }
  }, [sjmv])

  function runQuery () {
    console.log('query ran...')
  }
  function handleRefresh () {
    console.log('refresh...')
  }

  function handleCancel () {
    console.log('handle reset...')
  }

  const handleStateChange = (event) => {
    handleStateSel(event.target.value)
    console.log(stateSel)
  }

  const handleDistrictOfficeChange = (event) => {
    const district = event.target.value
    handleDistrictOffice(event.target.value)
    zoomToDistrict(district)
    // queryOffice()

    console.log(districtOffice)
  }

  const handleFieldOfficeChange = (event) => {
    const office = event.target.value
    handleFieldOffice(office)
    zoomToOffice(office)
    console.log(fieldOffice)
  }

  const sharedState = {
    stateSel,
    districtOffice,
    fieldOffice,
    handleStateChange,
    handleDistrictOfficeChange,
    handleFieldOfficeChange,
    officeOptions,
    districtOptions,
    runQuery,
    handleCancel,
    handleRefresh,
    inputValidation,
    setInputValidation
  }

  const [formData, setFormData] = useState({
    IdText: "",
    officeText: "",
    approvalMode: ""
  })

  const queryItems = [
    {
      field: 'ALLOT_GP_NM',
      alias: 'Group Allot'
    },
    {
      field: 'ALLOT_NM',
      alias: 'Allotment'
    }

  ]

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv)
      setViewReady(true)

      console.log(jmv)
      jmv.view.popupEnabled = false
      jmv.view.on("click", (event) => {
        event.stopPropagation()
      })

      if (jmv) {
        setIsLoading(false)
      }
    }
  }

  // const graphicLayerRef = useRef<GraphicsLayer>(null)
  // const featureLayerView = useRef<JimuFeatureLayerView>(null)
  // const clickHandler = useRef(null)

  const toggleSwitch = () => isChecked(!checked)

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '10px'
    },
    datetime: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    inspections: {
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      width: '100%',
      padding: '10px'
    }
  }

  function zoomToDistrict (district: string) {
    const DistrictLayerUrl = config.queryLayers.districtLayer
    const DistrictLayer = new FeatureLayer({ url: DistrictLayerUrl })

    console.log(config)
    let query
    query = DistrictLayer.createQuery()
    query.where = `PARENT_NAME = '${district}'`
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

  function zoomToOffice (office: string) {
    const OfficeLayerUrl = config.queryLayers.officeLayer
    const OfficeLayer = new FeatureLayer({ url: OfficeLayerUrl })

    console.log(config)
    let query
    query = OfficeLayer.createQuery()
    query.where = `ADMU_NAME = '${office}'`
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


  

const handleChange = (changes) => {
  setFormData({
    ...formData,
      ...changes
  })
}

  useEffect(() => {
    // ?allotmentNr=OR05105&officeId=ORB05000
    const params = new URLSearchParams(window.location.search)
    const allotmentNumber = params.get('allotmentNr')
    console.log(allotmentNumber)
    const officeId = params.get('officeId')

    setAllotmentNumber(allotmentNumber)
    setOfficeId(officeId)

    if (featureLayerRef.current && sjmv) {
      let query;
      query = featureLayerRef.current.createQuery()
      query.where = `ST_ALLOT_NR = '${allotmentNumber}'`
      query.returnGeometry = true
      query.outFields = ["*"]

      featureLayerRef.current.queryFeatures(query).then(function(result) {
        if (result.features.length > 0) {
          console.log(result.features)
          let features = result.features[0]
          // features.attributes.EMAIL_ID = 'Derek Test'
          sjmv.view.goTo({
            target: result.features[0],
            zoom: 16
          }).catch(function (error) {
            console.log('Error querying feature service.')
          })
        }
      })
    }
  }, [sjmv])
  return (
    <div className="widget-demo jimu-widget m-2" style={{ overflowY: 'scroll', height: '700px' }}>
     
       {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} >
       {/* <div
        className='query-loader'
      >
      { isLoading &&
   
        <Loading className="loader-overlay query-loader" type="SECONDARY" />
      }
      </div> */}
        </JimuMapViewComponent>
       )}
      <div className='reviewer-div' style={{ color: 'white' }}>
       <Header checked={checked} isLoading={isLoading} toggleSwitch={toggleSwitch}></Header>
      { checked
      ? <Main sharedState={sharedState}></Main>
        : ''}
      </div>
      <div
          style={{
            width: '90%'
          }}
        >
          <Allotments styles={styles} stateSel={stateSel} districtOffice={districtOffice} office={fieldOffice}></Allotments>
          <Authorizations styles={styles} stateSel={stateSel} districtOffice={districtOffice} office={fieldOffice}></Authorizations>
          <BilledUse styles={styles} stateSel={stateSel} districtOffice={districtOffice} office={fieldOffice}></BilledUse>
          <Inspections styles={styles} stateSel={stateSel} districtOffice={districtOffice} office={fieldOffice}></Inspections>
          <Footer sharedState={sharedState}></Footer>
        </div>
    </div>
  )
}

export default Widget
