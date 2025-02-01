import { React, type AllWidgetProps } from 'jimu-core'
import { useState, useEffect } from 'react'
import { Checkbox, Label, Select, Option, CollapsablePanel } from 'jimu-ui'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import config from '../configs/config.json'

const BilledUse = ({ sharedState, setFeatureForInspection, setStartInspection, styles, startBilled, featuresForBilled }) => {
  const [burro, setBurro] = useState(false)
  const [cattle, setCattle] = useState(false)
  const [goat, setGoat] = useState(false)
  const [horse, setHorse] = useState(false)
  const [sheep, setSheep] = useState(false)
  const [yCattle, setYCattle] = useState(false)
  const [ind, setInd] = useState(false)
  const [grazingYear, setGrazingYear] = useState('')
  const [scheduleType, setScheduleType] = useState('')
  const [billYearOptions, setBillYearOptions] = useState([])
  const [billScheduleOptions, setBillScheduleOptions] = useState([])
  const [billedUseString, setBilledUseString] = useState('')
  const [billedUseFinalQuery, setBilledUseFinalQuery] = useState('')

  useEffect(() => {
    if (sharedState.isRefreshing) {
      setBurro(false)
      setCattle(false)
      setGoat(false)
      setHorse(false)
      setSheep(false)
      setYCattle(false)
      setInd(false)
      setGrazingYear('')
      setScheduleType('')

      sharedState.handleChildRefresh()
    }
  }, [sharedState.isRefreshing])


  function handleGrazingYear (event) {
    setGrazingYear(event.target.value)
  }

  function handleScheduleType (event) {
    setScheduleType(event.target.value)
  }

  useEffect(() => {
    queryBillYear()
    queryBillScheduleType()
  }, [])

  function queryBillYear () {
    const BillLayerUrl = config.queryLayers.authUseTable
    const BillLayer = new FeatureLayer({ url: BillLayerUrl })

    let query
    query = BillLayer.createQuery()
    query.where = '1=1'
    query.returnGeometry = false
    query.outFields = ['GRAZING_FEE_YEAR_TX']
    query.returnDistinctValues = true

    BillLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        const features = result.features
        setBillYearOptions(features)
      }
    })
  }

  function queryBillScheduleType () {
    const BillSchedLayerUrl = config.queryLayers.authUseTable
    const BillSchedLayer = new FeatureLayer({ url: BillSchedLayerUrl })

    let query
    query = BillSchedLayer.createQuery()
    query.where = '1=1'
    query.returnGeometry = false
    query.returnDistinctValues = true
    query.outFields = ['USE_TYPE_NM']

    BillSchedLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        const features = result.features
        console.log(features)
        setBillScheduleOptions(features)
        console.log(features)
      }
    })
  }

  function queryAllBillUsedRecords () {
    const features = featuresForBilled
    let queryAuthString
    if (features !== undefined) {
      if (features.length > 0) {
        const resultAuthFeatures = features
        queryAuthString = 'ST_ALLOT_NR in ('

        resultAuthFeatures.forEach((feature) => {
          queryAuthString += "'" + feature.attributes.ST_ALLOT_NR + "',"
        })

        //remove the last comma
        queryAuthString = queryAuthString.substring(0, queryAuthString.length - 1) + ')'
      }
      let billUseAllQuery = getAllBillUsedQueryString()

      if (billUseAllQuery !== '' && queryAuthString !== '' && queryAuthString !== undefined) {
        billUseAllQuery = billUseAllQuery + ' AND ' + queryAuthString
      } else {
        if (queryAuthString !== '' && queryAuthString !== undefined) {
          billUseAllQuery = queryAuthString
        }
      }
      console.log(billUseAllQuery)
      if (billUseAllQuery !== '') {
        const BillQueryLayerUrl = config.queryLayers.RasReportBillUsedVW
        const BillQueryLayer = new FeatureLayer({ url: BillQueryLayerUrl })

        let query
        query = BillQueryLayer.createQuery()
        query.where = billUseAllQuery
        query.returnGeometry = false
        query.returnDistinctValues = true
        query.outSpatialReference = new SpatialReference({ wkid: 3857 })
        query.outFields = ['ST_ALLOT_NR']
        console.log(query)

        BillQueryLayer.queryFeatures(query).then(function (result) {
          if (result.features.length > 0) {
            const features = result.features
            console.log('billed use features:', features)
            setFeatureForInspection(features)
            setStartInspection(true)
          }
        })
      }
    }
  }

  useEffect(() => {
    queryAllBillUsedRecords()
  }, [startBilled])

  // useEffect(() => {
  //   getAllBillUsedQueryString()
  // }, [burro, cattle, goat, horse, sheep, yCattle, ind, grazingYear, scheduleType])

  function handleCheckBoxChange (checkboxid, checked) {
    if (checkboxid === 'burro') {
      setBurro(!burro)
    } else if (checkboxid === 'cattle') {
      setCattle(!cattle)
    } else if (checkboxid === 'goat') {
      setGoat(!goat)
    } else if (checkboxid === 'horse') {
      setHorse(!horse)
    } else if (checkboxid === 'sheep') {
      setSheep(!sheep)
    } else if (checkboxid === 'yCattle') {
      setYCattle(!yCattle)
    } else if (checkboxid === 'ind') {
      setInd(!ind)
    }
  }

  function getQueryChkBoxForBillUse () {
    let outString = ''
    if (burro) {
      outString = " ( LIVESTOCK_KIND_NM = 'B - BURRO'"
    }

    if (cattle) {
      if (outString === '') {
        outString = " ( LIVESTOCK_KIND_NM = 'C - CATTLE'"
      } else {
        outString = outString + ' OR ' + " LIVESTOCK_KIND_NM = 'C - CATTLE'"
      }
    }

    if (goat) {
      if (outString === '') {
        outString = " ( LIVESTOCK_KIND_NM = 'G - GOAT'"
      } else {
        outString = outString + ' OR ' + "LIVESTOCK_KIND_NM = 'G - GOAT'"
      }
    }

    if (sheep) {
      if (outString === '') {
        outString = " ( LIVESTOCK_KIND_NM = 'S - SHEEP'"
      } else {
        outString = outString + ' OR ' + "LIVESTOCK_KIND_NM = 'S - SHEEP'"
      }
    }

    if (horse) {
      if (outString === '') {
        outString = " ( LIVESTOCK_KIND_NM = 'H - HORSE'"
      } else {
        outString = outString + ' OR ' + "LIVESTOCK_KIND_NM = 'H - HORSE'"
      }
    }

    if (yCattle) {
      if (outString === '') {
        outString = " ( LIVESTOCK_KIND_NM = 'Y - YRLING CATTLE'"
      } else {
        outString = outString + ' OR ' + "LIVESTOCK_KIND_NM = 'Y - YRLING CATTLE'"
      }
    }

    if (ind) {
      if (outString === '') {
        outString = "( LIVESTOCK_KIND_NM = 'I - INDIGENOUS'"
      } else {
        outString = outString + ' OR ' + "LIVESTOCK_KIND_NM = 'I - INDIGENOUS'"
      }
    }

    if (outString !== '') {
      outString = outString + ' ) '
    }
    setBilledUseString(outString)

    console.log('billed use query string is:', outString)
    return outString
  }
  // reaplce with grazing year value selection
  function getQueryGrazingYearDD () {
    if (grazingYear !== '' && grazingYear !== 'undefined') {
      if (grazingYear !== '0') {
        return " ( GRAZING_FEE_YEAR_TX = '" + grazingYear + "' ) "
      } else {
        return ''
      }
    } return ''
  }

  // reaplce with grazing schedule type value selection
  function getQueryScheduleTypeDD () {
    if (scheduleType !== '' && scheduleType !== 'undefined') {
      if (scheduleType !== '0') {
        return " ( USE_TYPE_NM  = '" + scheduleType + "' ) "
      } else {
        return ''
      }
    } return ''
  }

  function getAllBillUsedQueryString () {
    let queryStringforBillUsedLiveStock = getQueryChkBoxForBillUse()
    let billUseAllQuery = queryStringforBillUsedLiveStock

    let queryStringforBillUsedGrazingYear = getQueryGrazingYearDD()

    if (billUseAllQuery !== '' && queryStringforBillUsedGrazingYear !== '') {
      billUseAllQuery = billUseAllQuery + '  AND ' + queryStringforBillUsedGrazingYear
    } else {
      if (queryStringforBillUsedGrazingYear !== '') {
        billUseAllQuery = queryStringforBillUsedGrazingYear
      }
    }

    let queryStringforBillUsedTypeUse = getQueryScheduleTypeDD()
    if (billUseAllQuery !== '' && queryStringforBillUsedTypeUse !== '') {
      billUseAllQuery = billUseAllQuery + '  AND ' + queryStringforBillUsedTypeUse
    } else {
      if (queryStringforBillUsedTypeUse !== '') {
        billUseAllQuery = queryStringforBillUsedTypeUse
      }
    }
    setBilledUseFinalQuery(billUseAllQuery)
    console.log(billUseAllQuery)
    return billUseAllQuery
  }

  return (
    <>
    <CollapsablePanel
            label="Billed Use"
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
                <label>Livestock Kind:</label>
                <div style={styles.container}>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="BURRO"
                  aria-label="BURRO"
                  checked={burro}
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('burro', e.target.checked) }}
                  onClick={() => {}}
                />
                BURRO
                </Label>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="CATTLE"
                  aria-label="CATTLE"
                  checked={cattle}
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('cattle', e.target.checked) }}
                  onClick={() => {}}
                />
                CATTLE
                </Label>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="GOAT"
                  aria-label="GOAT"
                  checked={goat}
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('goat', e.target.checked) }}
                  onClick={() => {}}
                />
                GOAT
                </Label>
              </div>
              <div style={styles.container}>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="HORSE"
                  aria-label="HORSE"
                  checked={horse}
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('horse', e.target.checked) }}
                  onClick={() => {}}
                />
                HORSE
                </Label>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="SHEEP"
                  aria-label="SHEEP"
                  checked={sheep}
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('sheep', e.target.checked) }}
                  onClick={() => {}}
                />
                SHEEP
                </Label>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="YRLING CATTLE"
                  aria-label="YRLING CATTLE"
                  checked={yCattle}
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('yCattle', e.target.checked) }}
                  onClick={() => {}}
                />
                YRLING CATTLE
                </Label>
              </div>
              <div style={{ paddingLeft: '10px' }}>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="INDIGENOUS"
                  aria-label="INDIGENOUS"
                  checked={ind}
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('ind', e.target.checked) }}
                  onClick={() => {}}
                />
                INDIGENOUS
                </Label>
                </div>
                <br></br>
                <div className="d-flex align-items-center"
                  style={{
                    width: 'auto'
                  }}>
                    <Label style={{ width: '170px' }}>Grazing Fee Year:</Label>
                <Select
                onChange={handleGrazingYear}
                value={grazingYear}>
              {billYearOptions?.map(year =>
                          <Option
                          value={year.attributes.GRAZING_FEE_YEAR_TX
                          }>
                              {year.attributes.GRAZING_FEE_YEAR_TX
                              }
                          </Option>
              )}
                </Select>
              </div>
              <div className="d-flex align-items-center"
              style={{
                width: 'auto'
              }}>
                <Label style={{ width: '170px' }}>Billing Schedule Type Use: </Label>
                <Select
                onChange={handleScheduleType}
                value={scheduleType}>
                  {billScheduleOptions?.map(year =>
                          <Option
                          value={year.attributes.USE_TYPE_NM
                          }>
                              {year.attributes.USE_TYPE_NM
                              }
                          </Option>
                  )}
                </Select>
              </div>
            </div>
            </div>
          </CollapsablePanel>
          </>
  )
}
export default BilledUse
