/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */

import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useState, useEffect, useRef, useCallback } from 'react'
import Graphic from "@arcgis/core/Graphic"
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { JimuFeatureLayerView, JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import Main from "./main";
import Header from "./header";
import config from '../configs/config.json'
import QueryAll from "./queryall";
import SearchBar from "./searchbar";

 const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [sjmv, setJimuMapView] = useState<JimuMapView>()
  const [checked, isChecked] = useState(false)
  const [stateSel, handleStateSel] = useState('')
  const [districtOffice, handleDistrictOffice] = useState('')
  const [fieldOffice, handleFieldOffice] = useState('')
  const [stateOfficeQuery, setStateOfficeQuery] = useState('')
  const [districtOptions, setDistrictOptions] = useState([])
  const [officeOptions, setOfficeOptions] = useState([])
  const [stateDisOffice, setStateDisOffice] = useState([])
  const graphicLayerRef = useRef<GraphicsLayer>(null)
  const allotPolyLayer = useRef<GraphicsLayer>(null)
  const allotGraphicsLayer = useRef<GraphicsLayer>(null)
  const authGraphicsLayer = useRef<GraphicsLayer>(null)
  const billedGraphicsLayer = useRef<GraphicsLayer>(null)
  const inspGraphicsLayer = useRef<GraphicsLayer>(null)

  const [allotment, setAllotmentNumber] = useState('')
  const [allotGroupList, setAllotGroupList] = useState([])
  const [allotList, setAllotList] = useState([])
  const [officeId, setOfficeId] = useState('')
  const [inputValidation, setInputValidation] = useState(true)
  const [viewReady, setViewReady] = useState(false)
  const featureLayerRef = useRef<FeatureLayer>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [triggerFeatureQuery, setTriggerFeatureQuery] = useState(false)
  const [inspectionFeatures, setInspectionFeatures] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const totalChildren = 4

  useEffect(() => {
    if (sjmv && !graphicLayerRef.current) {
      const graphicsLayer = new GraphicsLayer()
      allotPolyLayer.current = new GraphicsLayer()
      allotGraphicsLayer.current = new GraphicsLayer()
      authGraphicsLayer.current = new GraphicsLayer()
      billedGraphicsLayer.current = new GraphicsLayer()
      inspGraphicsLayer.current = new GraphicsLayer()

      sjmv.view.map.add(graphicsLayer)
      sjmv.view.map.add(allotPolyLayer.current)
      sjmv.view.map.add(allotGraphicsLayer.current)
      sjmv.view.map.add(authGraphicsLayer.current)
      sjmv.view.map.add(billedGraphicsLayer.current)
      sjmv.view.map.add(inspGraphicsLayer.current)
      graphicLayerRef.current = graphicsLayer
    }
  }, [sjmv])

  useEffect(() => {
    if (triggerFeatureQuery) {
      queryAllotmentFeatures()
    }
  }, [triggerFeatureQuery])

// params type and results
 function queryAllotmentFeatures () {
  setTriggerFeatureQuery(false)
  let type = "AuthAuthority"
  let results = inspectionFeatures
    if (results.features.length > 0) {
        let resultFeatures = results.features;
        let graphic;

        let queryString = "ST_ALLOT_NR in (";

        if (type === "Livestock" || type === "AuthAuthority" || type === "Compliance" || type === "BilledUse") {
          resultFeatures.forEach((feature) => {
            queryString += "'" + feature.attributes.ST_ALLOT_NR + "',"
          })
        } else {
          resultFeatures.forEach((feature) => {
            queryString += "'" + feature.attributes.ST_ALLOT_NO + "',"
          })
        }

        queryString = queryString.substring(0, queryString.length - 1) + ")";

    const allotLayerUrl = config.queryLayers.allotmentPolyLayer
    const allotLayer = new FeatureLayer({ url: allotLayerUrl })

    let query
    query = allotLayer.createQuery()
    query.where = queryString
    query.returnGeometry = true
    query.outFields = ["ST_ALLOT_NR"];

    allotLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        console.log(result.features)
        // const features = result.features[0]
        const symbol = {
          type: 'simple-fill', // autocasts as new SimpleFillSymbol()
          color: [0, 204, 255, 0.1],
          style: 'solid',
          outline: {
            color: [0, 204, 255, 0.8],
            width: 1
          }
        }

        if (graphicLayerRef.current) {
          graphicLayerRef.current.removeAll()
        } else {
          console.error('Graphics layer not initialized.')
        }

      let graphic
      result.features.forEach((feature) => {
        graphic = new Graphic({
          geometry: feature.geometry,
          attributes: feature.attributes,
          symbol: symbol
        })
        graphicLayerRef.current.add(graphic)
      })

      setTotalRecords(result.features.length)

        // features.attributes.EMAIL_ID = 'Derek Test'
        // if (sjmv) {
        // sjmv.view.goTo({
        //   target: result.features[0]
        
        // }).catch(function (error) {
        //   console.log('Error querying feature service.')
        // })
      }
    })
  }
}

  function runQuery () {
    console.log('query ran...')
  }

  const handleChildRefresh = useCallback(() => {
    setRefreshCount((prevCount) => {
      const newCount = prevCount + 1
      if (newCount === totalChildren) {
        setIsRefreshing(false)
      }
      return newCount
    })
  }, [])

  function handleRefresh () {
    handleStateSel('')
    handleDistrictOffice('')
    setDistrictOptions([])
    handleFieldOffice('')
    setOfficeOptions([])
    setAllotGroupList([])
    setAllotList([])
    setRefreshCount(0)
    setIsRefreshing(true)
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
    allotList,
    allotGroupList,
    handleStateChange,
    handleDistrictOfficeChange,
    handleFieldOfficeChange,
    officeOptions,
    districtOptions,
    runQuery,
    handleCancel,
    handleRefresh,
    inputValidation,
    setInputValidation,
    stateOfficeQuery,
    onSearch,
    isSearching,
    setIsSearching,
    setIsRefreshing,
    isRefreshing,
    handleChildRefresh,
    setTriggerFeatureQuery,
    setInspectionFeatures

  }


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

  const toggleSwitch = () => { isChecked(!checked); }

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

  function populateAllotment (office: string) {
    const allotPolyLayer = new FeatureLayer({
      url: config.queryLayers.allotmentPolyLayer
    })

    let query = allotPolyLayer.createQuery()
    query.returnGeometry = false
    query.returnDistinctValues = true
    query.outFields = ['*']
    query.where = `ADMIN_UNIT_CD = '${office}'`

    allotPolyLayer.queryFeatures(query).then(function (response) {
      const features = response.features
      setAllotList(features)
    })
  }

  function populateAllotmentGroup (office: string) {
    console.log(office)
    const allotTable = new FeatureLayer({
      url: config.queryLayers.allotmentGroupTable
    })
    console.log(allotTable)

    let query = allotTable.createQuery()
    //ADMIN_OFC_CD = 'LLCOS00000'
    query.returnGeometry = false
    query.returnDistinctValues = true
    query.outFields = ['*']
    query.where = "ADMIN_OFC_CD = 'LL" + office + "'"

    allotTable.queryFeatures(query).then(function (response) {
      const features = response.features
      setAllotGroupList(features)
    })
  }

  function zoomToOffice (office: string) {
    const OfficeLayerUrl = config.queryLayers.officeLayer
    const OfficeLayer = new FeatureLayer({ url: OfficeLayerUrl })

    console.log(config)
    let query
    query = OfficeLayer.createQuery()
    query.where = `ADM_UNIT_CD = '${office}'`
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

    populateAllotment(office)
    populateAllotmentGroup(office)
  }

  function queryOffice () {
    const OfficeLayerUrl = config.queryLayers.officeLayer
    const OfficeLayer = new FeatureLayer({ url: OfficeLayerUrl })

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

  function onSearch () {
    getStateOfficeQuery()
    setIsSearching(true)
  }

  function getStateOfficeQuery () {
 //regional query
 let stateOfficeQuery = "";
    if (stateSel !== "Select State") {
        stateOfficeQuery = " ( ST_ALLOT_NR LIKE '" + stateSel + "%' )"
    }
    if (fieldOffice !== "0" && fieldOffice !== "") {
        stateOfficeQuery = stateOfficeQuery + " And ( ADMIN_UNIT_CD = '" + fieldOffice + "' ) "
    }
    setStateOfficeQuery(stateOfficeQuery)
    queryStateDisOffice(stateOfficeQuery)
    console.log(stateOfficeQuery)
  }

  function queryStateDisOffice (stateQuery) {
    const AllotPolyLayerUrl = config.queryLayers.allotmentPolyLayer
    const AllotPolyLayer = new FeatureLayer({ url: AllotPolyLayerUrl })

    let query
    query = AllotPolyLayer.createQuery()
    query.where = stateQuery
    query.returnGeometry = true
    query.outFields = ['*']

    AllotPolyLayer.queryFeatures(query).then(function (result) {
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

        let graphic

        if (allotPolyLayer.current) {
          graphicLayerRef.current.removeAll()
          allotPolyLayer.current.removeAll()
          result.features.forEach((feature) => {
            graphic = new Graphic({
              geometry: feature.geometry,
              attributes: feature.attributes,
              symbol: symbol
            })
            graphicLayerRef.current.add(graphic)
          })
          // allotPolyLayer.current.add(graphic)
        } else {
          console.error('Graphics layer not initialized.')
        }
        if (sjmv) {
          sjmv.view.goTo({
            target: result.features
          }).catch(function (error) {
            console.log('Error querying feature service.')
          })
        }
      }
      // if (result.features.length > 0) {
      //   console.log(result.features)
      //   const features = result.features
      //   console.log(features)
      //   setStateDisOffice(features)
      // }
    })
  }

  function queryDistrict () {
    const DistrictLayerUrl = config.queryLayers.districtLayer
    const DistrictLayer = new FeatureLayer({ url: DistrictLayerUrl })

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

      featureLayerRef.current.queryFeatures(query).then(function (result) {
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
          <QueryAll sharedState={sharedState} styles={styles} stateSel={stateSel} districtOffice={districtOffice} office={fieldOffice}>
          </QueryAll>
        </div>
        <SearchBar sharedState={sharedState}/>
    </div>
  )
}

export default Widget
