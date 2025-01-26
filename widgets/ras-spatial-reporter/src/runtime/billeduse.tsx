import { React, type AllWidgetProps } from 'jimu-core'
import { useState, useEffect } from 'react'
import { Checkbox, Label, Select, Option, CollapsablePanel } from 'jimu-ui'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import config from '../configs/config.json'

const BilledUse = (styles) => {
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

  function handleGrazingYear (event) {
    setGrazingYear(event.target.value)
    console.log(grazingYear)
  }

  function handleScheduleType (event) {
    setScheduleType(event.target.value)
    console.log(scheduleType)
  }

  useEffect(() => {
    queryBillYear()
    queryBillScheduleType()
  }, [])

  function queryBillYear () {
    const BillLayerUrl = config.queryLayers.authUseTable
    const BillLayer = new FeatureLayer({ url: BillLayerUrl })

    console.log(config)
    let query
    query = BillLayer.createQuery()
    query.where = '1=1'
    query.returnGeometry = false
    query.outFields = ['GRAZING_FEE_YEAR_TX']
    query.returnDistinctValues = true

    BillLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        console.log(result.features)
        const features = result.features
        console.log(features)
        setBillYearOptions(features)
        console.log(features)
      }
    })
  }

  function queryBillScheduleType () {
    const BillSchedLayerUrl = config.queryLayers.authUseTable
    const BillSchedLayer = new FeatureLayer({ url: BillSchedLayerUrl })

    console.log(config)
    let query
    query = BillSchedLayer.createQuery()
    query.where = '1=1'
    query.returnGeometry = false
    query.returnDistinctValues = true
    query.outFields = ['USE_TYPE_NM']

    BillSchedLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        console.log(result.features)
        const features = result.features
        console.log(features)
        setBillScheduleOptions(features)
        console.log(features)
      }
    })
  }

  function handleCheckBoxChange (checkboxid, checked) {
    console.log(checkboxid, checked)
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

  useEffect(() => {
    let outString = ''
    if (burro) {
      outString = " ( LIVESTOCK_KIND_NM = 'B - BURRO'"
    }

    if (cattle) {
      if (outString === "") {
        outString = " ( LIVESTOCK_KIND_NM = 'C - CATTLE'";
      } else {
        outString = outString + " OR " + " LIVESTOCK_KIND_NM = 'C - CATTLE'";
      }
    }

    if (goat) {
      if (outString === "") {
        outString = " ( LIVESTOCK_KIND_NM = 'G - GOAT'";
      } else {
        outString = outString + " OR " + "LIVESTOCK_KIND_NM = 'G - GOAT'";
      }
    }

    if (sheep) {
      if (outString === "") {
        outString = " ( LIVESTOCK_KIND_NM = 'S - SHEEP'";
      } else {
        outString = outString + " OR " + "LIVESTOCK_KIND_NM = 'S - SHEEP'";
      }
    }

    if (horse) {
      if (outString === "") {
        outString = " ( LIVESTOCK_KIND_NM = 'H - HORSE'";
      } else {
        outString = outString + " OR " + "LIVESTOCK_KIND_NM = 'H - HORSE'";
      }
    }

    if (yCattle) {
      if (outString === "") {
        outString = " ( LIVESTOCK_KIND_NM = 'Y - YRLING CATTLE'";
      } else {
        outString = outString + " OR " + "LIVESTOCK_KIND_NM = 'Y - YRLING CATTLE'";
      }
    }

    if (ind) {
      if (outString === '') {
        outString = "( LIVESTOCK_KIND_NM = 'I - INDIGENOUS'";
      } else {
        outString = outString + ' OR ' + "LIVESTOCK_KIND_NM = 'I - INDIGENOUS'";
      }
    }

    if (outString !== '') { outString = outString + " ) "}
    setBilledUseString(outString)
    console.log('billed use query string is:', outString)
  }, [burro, goat, ind, sheep, cattle, horse, yCattle])
// reaplce with grazing year value selection
  getQueryGrazingYearDD function(){

    if(widgetContext.selectGrazingYear.value != "" && widgetContext.selectGrazingYear.value != "undefined")
    {   
        if(widgetContext.selectGrazingYear.value !== "0")
        {
            return  " ( GRAZING_FEE_YEAR_TX = '" +  widgetContext.selectGrazingYear.value + "' ) ";
        }return "";
    }return "";
},

// reaplce with grazing schedule type value selection
getQueryScheduleTypeDD function(){
    if(widgetContext.selectBSTU.value != "" && widgetContext.selectBSTU.value != "undefined")
    {
        if(widgetContext.selectBSTU.value !== "0")
        {
            return  " ( USE_TYPE_NM  = '" +  widgetContext.selectBSTU.value + "' ) ";
        }return "";
    }return "";
},

// this combines the queries for billed use
//
getAllBillUsedQueryString function() {
    var queryStringforBillUsedLiveStock = this._getQueryChkBoxForBillUse();
    var billUseAllQuery = queryStringforBillUsedLiveStock;

    var queryStringforBillUsedGrazingYear = this._getQueryGrazingYearDD();
    if (billUseAllQuery !== "" && queryStringforBillUsedGrazingYear !== "") {
        billUseAllQuery = billUseAllQuery + "  AND " + queryStringforBillUsedGrazingYear;
    }
    else {
        if (queryStringforBillUsedGrazingYear !== "") {
            billUseAllQuery = queryStringforBillUsedGrazingYear;
        }
    }

    var queryStringforBillUsedTypeUse = this._getQueryScheduleTypeDD();
    if (billUseAllQuery !== "" && queryStringforBillUsedTypeUse !== "") {
        billUseAllQuery = billUseAllQuery + "  AND " + queryStringforBillUsedTypeUse;
    }
    else {
        if (queryStringforBillUsedTypeUse !== "") {
            billUseAllQuery = queryStringforBillUsedTypeUse;
        }
    }
    return billUseAllQuery;
},

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
                <div style={styles.styles.container}>
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
              <div style={styles.styles.container}>
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
                onChange={handleGrazingYear}>
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
                onChange={handleScheduleType}>
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
