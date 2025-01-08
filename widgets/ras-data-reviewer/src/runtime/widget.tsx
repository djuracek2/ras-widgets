/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */

import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import  GraphicsLayer  from "@arcgis/core/layers/GraphicsLayer";
import { Checkbox, Label, Switch, TextInput, Button, ButtonGroup } from "jimu-ui";
import { useState, useEffect, useRef } from 'react'
import AcceptModal from './modals/acceptmodal'
import RejectModal from './modals/rejectmodal'
import Graphic from "@arcgis/core/Graphic"
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { JimuFeatureLayerView, JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'

 const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [isAccept, setIsAccept] = useState(false)
  const [isReject, setIsReject] = useState(false)
  const [checked, isChecked] = useState(false)
  const [appCheck, isAppCheck] = useState(false)
  const [appRej, isAppRej] = useState(false)
  const [approve, setApprove] = useState(false)
  const [reject, setReject] = useState(false)
  const [inputValidation, setInputValidation] = useState(false)

  const [formData, setFormData] = useState({
    IdText: "",
    officeText: "",
    approvalMode: ""
  })

  const [approvedText, setApprovedText] = useState('')
  const [itemObjId, setItemObjId] = useState('')
  const [feature, setSelectedFeature] = useState({})
  const [defExpression, setDefExpression] = useState('')
  const [allotment, setAllotmentNumber] = useState('')
  const [officeId, setOfficeId] = useState('')
  const [sjmv, setJimuMapView] = useState<JimuMapView>()
  const [viewReady, setViewReady] = useState(false)
  const featureLayerRef = useRef<FeatureLayer>(null)
  const graphicLayerRef = useRef<GraphicsLayer>(null)
  const featureLayerView = useRef<JimuFeatureLayerView>(null)
  const clickHandler = useRef(null)

  const toggleSwitch = () => isChecked(!checked)
  const handleAppCheck = () => isAppCheck(!appCheck)
  const handleRejCheck = () => isAppRej(!appRej)
  const handleApprove = () => setApprove(!approve)
  const handleReject = () => setReject(!reject)
  const toggleAcceptModal = () => setIsAccept(!isAccept)
  const toggleRejectModal = () => setIsReject(!isReject)
  

useEffect(() => {
  const isformValid = Object.values(formData).every(field => field.trim() !== '')
  setInputValidation(isformValid)
}, [formData])
  

const handleChange = (changes) => {
  setFormData({
    ...formData,
      ...changes
  })
}
  
  const handleReset = () => {
    setFormData({
      IdText: "",
      officeText: "",
      approvalMode: "",

    })
    setApprovedText('')
    setSuccess(false)
    setFailure(false)
    graphicLayerRef.current.removeAll()
  }

  const handleApproveRejectReset = () => {
    setApprove(false)
    setReject(false)
  }

  const acceptWorkflow = () => {
    setIsAccept(false)
    editFeature('Y')
  }

  const rejectWorkflow = () => {
      console.log('reject feature')
      editFeature('N')
      setIsReject(false)
  }

  const callbackSuccess = () => {
    console.log('edits successful')
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
      // const layer = jmv.jimuLayerViews['widget_20-dataSource_1-BLM_Natl_Grazing_Allot_2252'].layer
      // const layer = jmv.jimuLayerViews['widget_20-dataSource_1-BLM_Natl_RAS_Approvals_3896'].layer
      const layer = jmv.jimuLayerViews['widget_11-dataSource_1-BLM_Natl_RAS_Approvals_4905'].layer
      featureLayerRef.current = layer  

      if (jmv && featureLayerRef.current) {
        // jmv.view.whenLayerView(featureLayerRef.current).then((layerView) => {
        //   layerView.watch("updating", (isUpdating) => {
        //     if (!isUpdating) {
        //       console.log('triggered layer view')
        //     }
        //   })
        // })
      }
    }
  }

  const editFeature = (confirmation: string) => {
    var curDatetime = new Date(Date.now()).getTime();
    let approvedStatus = confirmation

    if (featureLayerRef.current) {
      let updatedFeature = feature
      updatedFeature.attributes.APPROVAL_FLAG = approvedStatus

      featureLayerRef.current.applyEdits({
        updateFeatures: [updatedFeature]
      }).then((editsResult) => {
        if (editsResult.updateFeatureResults.length > 0) {
          setSuccess(true)
          setFailure(false)
        }
      })
        .catch((error) => {
          console.log("error = ", error)
          setSuccess(false)
          setFailure(true)
        })

      handleApproveRejectReset()
    }
  }

  useEffect(() => {
    const yesExpression = `APPROVAL_FLAG = 'Y'`
    const noExpression = `APPROVAL_FLAG = 'N'`
    const bothExpression = `APPROVAL_FLAG = 'Y' OR APPROVAL_FLAG = 'N'`
    if (featureLayerRef.current) {
      if (appCheck && !appRej) {
        featureLayerRef.current.definitionExpression = yesExpression
        setDefExpression(yesExpression)
      } else if(appRej && !appCheck) {
        featureLayerRef.current.definitionExpression = noExpression
        setDefExpression(noExpression)
      } else if (appRej && appCheck) {
        featureLayerRef.current.definitionExpression = bothExpression
        setDefExpression(bothExpression)
      } else {
        featureLayerRef.current.definitionExpression = ""
        setDefExpression('')
      }
    }
  }, [appCheck, appRej])

  useEffect(() => {
    if (sjmv && checked) {
      clickHandler.current = sjmv.view.on("click", getPoint)
    } else {
      clickHandler.current?.remove()
      clickHandler.current = null;
    }
  }, [checked])

  useEffect(() => {
    if (sjmv && !graphicLayerRef.current) {
      const graphicsLayer = new GraphicsLayer()
      sjmv.view.map.add(graphicsLayer)
      graphicLayerRef.current = graphicsLayer
    }
  }, [sjmv])

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

      featureLayerRef.current.queryFeatures(query).then( function(result) {
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
  const checkApprovalText = (text) => {
    let flagVal;
    if (text == "Y") {
      flagVal = "Yes"
    } else if (text == "N") {
      flagVal = "No"
    } else {
      flagVal = ""
    }

    setApprovedText(flagVal)
  }

const getPoint = (event) => {
  if (sjmv) {
      const currentDefExpression = featureLayerRef.current.definitionExpression || defExpression

      let query
      query = featureLayerRef.current.createQuery()
      query.geometry = event.mapPoint
      query.distance = 1
      query.units = "feet"
      query.spatialRelationship = "within"
      query.returnGeometry = true
      query.outFields = ["*"]
      query.where = currentDefExpression

      featureLayerRef.current.definitionExpression = currentDefExpression;
      featureLayerRef.current.queryFeatures(query).then( function(result) {
        if (result.features.length > 0) {
          let features = result.features[0]

          let symbol = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [0, 204, 255, 0.4],
            style: "solid",
            outline: {
              color: [0, 204, 255, 0.8],
              width: 2
            }
          };

          const graphic = new Graphic ({
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
          const changes = {
            approvalMode: 'Allotment',
            IdText: features.attributes.ST_ALLOT_NR,
            officeText: features.attributes.ADMIN_OFC_CD,
          }
          let approvalText = features.attributes.APPROVAL_FLAG

          handleChange(changes)
          checkApprovalText(approvalText)
          setItemObjId(features.attributes.OBJECTID)
          setSuccess(false)
          setFailure(false)
          setSelectedFeature(features)

          sjmv.view.goTo({
            target: result.features[0],
            // zoom: 16
          }).catch(function (error) {
            console.log('Error querying feature service.')
          })
          featureLayerRef.current.definitionExpression = currentDefExpression
          featureLayerRef.current.refresh()
        }
      })
  }
}

  return (
    <div className="widget-demo jimu-widget m-2">
       {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
       )}
      <div className='reviewer-div' style={{ color: 'white' }}>
      <h5>View Approved or Rejected Allotments</h5>
      <div>
        <Label centric className="d-flex">
          <Checkbox checked={appCheck} onChange={handleAppCheck} disabled={!viewReady}></Checkbox>
          Approved Allotments
        </Label>
        <Label centric className="d-flex">
          <Checkbox checked={appRej} onChange={handleRejCheck} disabled={!viewReady} ></Checkbox>
          Rejected Allotments
        </Label>
      </div>
      <br></br>
      <Label>
        <Switch aria-label="Switch" onChange={toggleSwitch} checked={checked}/>
          Allotments
      </Label>
      { checked ? <div>
        <div className='d-flex justify-content-center'>
          <label style={{textAlign: 'center', paddingRight: '10px'}}>
            Pan & Zoom to any grazing area that you're interested in.
            When you Click on the Allotment you can Approve/Reject the
            Allotments geospatial information.
          </label>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '0px',
          paddingRight: '10px'
        }}>
        <label>
          Approval Mode:
          <TextInput
            className=""
            size="sm"
            name= "approvalMode"
            value={formData.approvalMode ? formData.approvalMode : ""}
            readOnly
            // onChange={(e) => setApprovalText(e.target.value)}
          />
        </label>
        <label>
          ID:{' '}
          <TextInput
            className=""
            size="sm"
            name="IdText"
            value={formData.IdText ? formData.IdText : ""}
            readOnly
            // onChange={handleChange}
          />
        </label>
        <label>
          Office:{' '}
          <TextInput
            className=""
            size="sm"
            name="officeText"
            value={formData.officeText ? formData.officeText : ""}
            readOnly
            // onChange={(e) => setOfficeText(e.target.value)}
          />
        </label>
        <label>
          Approved:{' '}
          <TextInput
            className=""
            size="sm"
            name="approvedText"
            value={approvedText ? approvedText : ""}
            readOnly
            onChange={(e) => setApprovedText(e.target.value)}
          />
        </label>
        </div>
        <div>
          { success ? <Label className="success">Feature successfully updated!</Label> : ''}
          { failure ? <Label className="unsuccessful">Feature was unable to updated.</Label> : ''}
        </div>
        <div className='d-flex justify-content-center'>
        <ButtonGroup size="default">
          <Button
            aria-pressed="false"
            type="primary"
            disabled={!inputValidation}
            onClick={toggleAcceptModal}
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
        <AcceptModal isOpen={isAccept} toggle={toggleAcceptModal}  acceptWorkflow={acceptWorkflow} />
        <RejectModal isOpen={isReject} toggle= {toggleRejectModal} rejectWorkflow={rejectWorkflow} />
      </div>
        : ''}
      </div>
    </div>
  )
}

export default Widget;