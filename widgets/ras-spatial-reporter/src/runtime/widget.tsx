/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */

import { React, type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
import  GraphicsLayer  from "@arcgis/core/layers/GraphicsLayer";
import { Checkbox, Label, Switch, TextInput, Button, ButtonGroup, Select, Option, CollapsablePanel, Radio } from "jimu-ui";
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
import Header from "./header";

 const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [checked, isChecked] = useState(false)
  const [appCheck, isAppCheck] = useState(false)
  const [appRej, isAppRej] = useState(false)
 
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

  

const handleChange = (changes) => {
  setFormData({
    ...formData,
      ...changes
  })
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

  async function generateFields (field) {
    let query;
    query = featureLayerRef.current.createQuery()
    query.where = `1=1 AND ${field} IS NOT NULL'`
    query.returnGeometry = false;
    query.returnDistinctValues = true;
    query.orderByFields = [`${field} ASC`]
    query.outFields = [field]

    featureLayerRef.current.queryFeatures(query).then(function (result) {
        console.log(result)
    })
  }
// useEffect(() => {
//   async function triggerFilterBuilder () {
//     for (const fields of queryItems) {
//       await generateFields(fields.field)
//     }
//   }
//   triggerFilterBuilder()
// })


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
  return (
    <div className="widget-demo jimu-widget m-2" style={{ overflowY: 'scroll', height: '700px' }}>
       {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
       )}
      <div className='reviewer-div' style={{ color: 'white' }}>
        <Header checked={checked} toggleSwitch={toggleSwitch}></Header>
      { checked
      ? <Main success={success} failure={failure} sjmv={sjmv}></Main>
        : ''}
      </div>
      <div
          style={{
            width: '90%'
          }}
        >
          <Allotments styles={styles}></Allotments>
          <Authorizations styles={styles}></Authorizations>
          <BilledUse styles={styles}></BilledUse>
          <Inspections styles={styles}></Inspections>
        </div>
    </div>
  )
}

export default Widget
