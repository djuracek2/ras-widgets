import { React, type AllWidgetProps } from 'jimu-core'
import { useState, useEffect } from 'react'
import { Label, CollapsablePanel, Radio } from 'jimu-ui'
import { DatePicker } from 'jimu-ui/basic/date-picker'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import config from '../configs/config.json'
import { set } from 'seamless-immutable'

const Inspections = ({ sharedState, featureForInspection, startInspection, styles }) => {
  const [yes, setYes] = useState(false)
  const [no, setNo] = useState(false)
  const [beginTime, setBeginTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [endTimeConverter, setEndTimeConverter] = useState('')
  const [beginTimeConverter, setBeginTimeConverter] = useState('')

  useEffect(() => {
    if (sharedState.isRefreshing) {
      setYes(false)
      setNo(false)
      setBeginTime('')
      setEndTime('')
      sharedState.handleChildRefresh()
    }
  }, [sharedState.isRefreshing])

  // useEffect(() => {
  //   queryAllComplianceRecords()
  // }, [sharedState.isSearching])

  useEffect(() => {
    if (startInspection) {
      queryAllComplianceRecords()
    }
  }, [startInspection])

  function handleTime (type, val) {
    if (type === 'begin') {
      setBeginTime(val)
      const date = new Date(val)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const convertedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

      setBeginTimeConverter(convertedTime)
    } else {
      setEndTime(val)

      const date = new Date(val)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const convertedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

      setEndTimeConverter(convertedTime)
    }
  }

  function handleRadio (val) {
    if (val === 'yes') {
      setYes(true)
      setNo(false)
    } else {
      setNo(true)
      setYes(false)
    }
  }

  // get date values
  function getQueryComplianceDate () {
    if ((beginTimeConverter !== '' && endTimeConverter !== '') && (beginTimeConverter !== undefined && endTimeConverter !== undefined)) {
      return " ( INSPECTION_DT >= TIMESTAMP '" + beginTimeConverter + "' AND INSPECTION_DT <= TIMESTAMP '" + endTimeConverter + "' ) "
    }
  }

  function queryAllComplianceRecords () {
    const results = featureForInspection
    let queryAuthAndBillString = ''

    if (results !== undefined) {
      if (results.length > 0) {
        const resultAuthFeatures = results
        queryAuthAndBillString = 'ST_ALLOT_NR in ('

        resultAuthFeatures.forEach((feature) => {
          queryAuthAndBillString += "'" + feature.attributes.ST_ALLOT_NR + "',"
        })

        //remove the last comma
        queryAuthAndBillString = queryAuthAndBillString.substring(0, queryAuthAndBillString.length - 1) + ')'
      }
    }

    let allComplainceQuery = getQueryComplianceDate()
    let queryStringCompYesNo = ''
    if (yes) {
      queryStringCompYesNo = "( OOC_CD = 'Y' "
      if (allComplainceQuery !== '' && allComplainceQuery !== undefined) {
        allComplainceQuery = allComplainceQuery + ' AND ' + queryStringCompYesNo + ' )'
      } else {
        allComplainceQuery = queryStringCompYesNo + ' ) '
      }
    }
    if (no) {
      queryStringCompYesNo = " ( OOC_CD = 'N' "
      if (allComplainceQuery !== '' && allComplainceQuery !== undefined) {
        allComplainceQuery = allComplainceQuery + ' AND ' + queryStringCompYesNo + ' ) '
      } else {
        allComplainceQuery = queryStringCompYesNo
      }
    }
    // queryAuthAndBillString looks like this comes from billed use query
    // it passes the results into this query and if its not == ''
    // then it adds to the query
    if (allComplainceQuery !== '' && queryAuthAndBillString !== '' && allComplainceQuery !== undefined) {
      allComplainceQuery = allComplainceQuery + ' AND ' + queryAuthAndBillString
    } else {
      if (queryAuthAndBillString !== '') {
        allComplainceQuery = queryAuthAndBillString
      }
    }

    if (allComplainceQuery !== '' && allComplainceQuery !== undefined) {
      const InspectionQueryLayerUrl = config.queryLayers.inspectionUseTable
      const InspectionQueryLayer = new FeatureLayer({ url: InspectionQueryLayerUrl })

      // ( INSPECTION_DT >= 1421910000000 AND INSPECTION_DT <= 1738134000000 )  AND ( OOC_CD = 'Y'  ) AND ST_ALLOT_NR in ('AZ06005','CA04329','CA04379','CO04213','CO04215','CO04542','WY10524','WY10613','WY10620')

      let query
      query = InspectionQueryLayer.createQuery()
      query.where = allComplainceQuery
      query.returnGeometry = true

      query.outSpatialReference = new SpatialReference({ wkid: 3857 })
      query.outFields = ['*']

      InspectionQueryLayer.queryFeatures(query).then(function (result) {
        if (result.features.length > 0) {
          const features = result

          console.log('Inspection features:', features)
          sharedState.setInspectionFeatures(features)
          sharedState.setTriggerFeatureQuery(true)
        }
      })
    }
  }

  return (
    <>
<CollapsablePanel
            label="Inspections"
            // defaultIsOpen="true"
            level={0}
            type="default"
            style={{
              width: '100%'
            }}
          >
          <div
              style={{
                width: '100%'
              }}
            >
              <div>
              <Label>Compliance Inspection Date:</Label>
                    <div style={ styles.datetime}>
                    <div
                      style={{
                        width: 200
                      }}
                    >
                      <DatePicker
                        aria-describedby="date-picker-desc-id"
                        aria-label="DateTime picker label"
                        format="shortDateLongTime"
                        isTimeLong
                        showTimeInput
                        onChange={(val) => { handleTime('begin', val) }}
                        selectedDate={beginTime}
                        strategy="absolute"
                        virtualDateList={[
                          'NOW',
                          'YESTERDAY'
                        ]}
                      />
                    </div>
                    <Label style={{ display: 'flex', alignItems: 'center', padding: '5px', paddingTop: '10px' }}>between:</Label>
                  <div
                        style={{
                          width: 200
                        }}
                      >
                        <DatePicker
                          aria-describedby="date-picker-desc-id"
                          aria-label="DateTime picker label"
                          format="shortDateLongTime"
                          isTimeLong
                          showTimeInput
                          onChange={(val) => { handleTime('end', val) }}
                          selectedDate={endTime}
                          strategy="absolute"
                          virtualDateList={[
                            'NOW',
                            'YESTERDAY'
                          ]}
                        />
                    </div>
                  </div>
                  <div>
                    <Label>Out of Compliance?:</Label>
                    <div style={styles.inspections}>
                        <div style={{ paddingRight: '30px' }}>
                          <Label style={{ paddingRight: '10px' }}>YES</Label>
                          <Radio
                            aria-label="Radio"
                            checked = {yes}
                            onBlur={() => {}}
                            onChange={(e) => { handleRadio('yes') }}
                            onClick={() => {}}
                            onFocus={() => {}}
                          />
                      </div>
                      <div style={{ paddingRight: '10px' }}>
                        <Label style={{ paddingRight: '10px' }}>NO</Label>
                        <Radio
                          aria-label="Radio"
                          checked = {no}
                          onBlur={() => {}}
                          onChange={() => {}}
                          onClick={(e) => { handleRadio('no') }}
                          onFocus={() => {}}
                        />
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </CollapsablePanel>
    </>
  )
}

export default Inspections
