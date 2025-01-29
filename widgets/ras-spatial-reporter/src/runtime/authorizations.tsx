import { React, type AllWidgetProps } from 'jimu-core'
import { useState, useEffect } from 'react'
import { Checkbox, Label, CollapsablePanel } from 'jimu-ui'
import { DatePicker } from 'jimu-ui/basic/date-picker'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import config from '../configs/config.json'

const Authorizations = ({ setNoDatesTrigger, setStartBilled, setFeaturesForBilled, sharedState, styles, qryReportViewAuthAllotmentString, setQueryDates, setQueryAuthLiveStockString, setQueryStringAuthorizationAuth }) => {
  const [burro, setBurro] = useState(false)
  const [cattle, setCattle] = useState(false)
  const [goat, setGoat] = useState(false)
  const [horse, setHorse] = useState(false)
  const [sheep, setSheep] = useState(false)
  const [yCattle, setYCattle] = useState(false)
  const [ind, setInd] = useState(false)
  const [_402, set402] = useState(false)
  const [fullyPro, setfullyPro] = useState(false)
  const [decStayed, setDecStayed] = useState(false)
  const [effBegin, setEffBegin] = useState()
  const [effBeginTimeConverter, setEffTimeBeginConverter] = useState()
  const [effEnd, setEffEnd] = useState()
  const [effTimeEndConverter, setEffTimeEndConverter] = useState()
  const [expBegin, setExpBegin] = useState()
  const [expTimeBeginConverter, setExpTimeBeginConverter] = useState()
  const [expEnd, setExpEnd] = useState()
  const [expTimeEndConverter, setExpTimeEndConverter] = useState()
  const [issBegin, setIssBegin] = useState('')
  const [issEnd, setIssEnd] = useState('')

  function transformDate(val) {
    const date = new Date(val)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const convertedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return convertedTime
  }

  function handleEffectiveDate (type, val) {
    if (type === 'begin') {
      setEffBegin(val)
      setEffTimeBeginConverter(transformDate(val))
    } else {
      setEffEnd(val)
      setEffTimeEndConverter(transformDate(val))
    }
  }

  function handleExpirationDate (type, val) {
    if (type === 'begin') {
      setExpBegin(val)
      setExpTimeBeginConverter(transformDate(val))
    } else {
      setExpEnd(val)
      setExpTimeEndConverter(transformDate(val))
      console.log(expEnd)
    }
  }

  function handleIssueDate (type, val) {
    if (type === 'begin') {
      setIssBegin(val)
      console.log(issBegin)
    } else {
      setIssEnd(val)
      console.log(issEnd)
    }
  }

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
    } else if (checkboxid === '402') {
      set402(!_402)
    } else if (checkboxid === 'fully-pro') {
      setfullyPro(!fullyPro)
    } else if (checkboxid === 'dec-stayed') {
      setDecStayed(!decStayed)
    }
  }

  function getAuthLiveStockQuery () {
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

    if (outString !== '') { outString = outString + ' ) ' }
    setQueryAuthLiveStockString(outString)
    console.log('1st part of query string is:', outString)
  }

  useEffect(() => {
    if (sharedState.isSearching) {
      getAuthLiveStockQuery()
      getAuthAuthorityQuery()
      getAuthorityDatesQuery()
      setNoDatesTrigger('2')
    }
  }, [sharedState.isSearching])

  useEffect(() => {
    if (qryReportViewAuthAllotmentString !== '') {
      console.log(qryReportViewAuthAllotmentString)
      queryAuthAuthority(qryReportViewAuthAllotmentString)
    }
  }, [qryReportViewAuthAllotmentString])

  function getAuthAuthorityQuery () {
    let queryStringAuthorizationAuth = ''

    if (_402) {
      if (queryStringAuthorizationAuth === '') {
        queryStringAuthorizationAuth = " ( AUTH_AUTHORITY_CD = 'P'"
      }
    }

    if (fullyPro) {
      if (queryStringAuthorizationAuth === '') {
        queryStringAuthorizationAuth = " ( AUTH_AUTHORITY_CD = 'F'"
      } else {
        queryStringAuthorizationAuth = queryStringAuthorizationAuth + ' OR ' + "AUTH_AUTHORITY_CD = 'F'"
      }
    }
    if (decStayed) {
      if (queryStringAuthorizationAuth === '') {
        queryStringAuthorizationAuth = " ( AUTH_AUTHORITY_CD = 'A'"
      } else {
        queryStringAuthorizationAuth = queryStringAuthorizationAuth + ' OR ' + "AUTH_AUTHORITY_CD = 'A'"
      }
    }
    if (queryStringAuthorizationAuth !== '') {
      queryStringAuthorizationAuth = queryStringAuthorizationAuth + ' ) '
    }
    setQueryStringAuthorizationAuth(queryStringAuthorizationAuth)
    console.log('2nd part of query string is:', queryStringAuthorizationAuth)
  }

  function getAuthorityDatesQuery () {
    let queryDates = ''
    // Not adding issue mng for now as its coded out
    // check if still needed in ui
    if (effBeginTimeConverter !== '' && effTimeEndConverter !== '') {
      queryDates = " (AUTH_EFT_DT >= TIMESTAMP '" + effBeginTimeConverter + "' AND AUTH_EFT_DT <= TIMESTAMP '" + effTimeEndConverter + "') "
    }

    //DONT SEE THESE FIELDS IN CODE!!!
    if (expTimeBeginConverter !== '' && expTimeEndConverter !== '') {
      if (queryDates === '') {
        queryDates = " (AUTH_EXP_DT >= TIMESTAMP '" + expTimeBeginConverter + "' AND AUTH_EXP_DT <= TIMESTAMP '" + expTimeEndConverter + "') "
      } else {
        queryDates = queryDates + ' AND ' + " ( AUTH_EXP_DT >= TIMESTAMP '" + expTimeBeginConverter + "' AND AUTH_EXP_DT <= TIMESTAMP '" + expTimeEndConverter + "' )"
      }
    }
    setQueryDates(queryDates)
   
    console.log('3rd part of query string is:', queryDates)
  }

  function queryAuthAuthority (qryReportViewAuthAllotmentString: string) {
    const RasAuthAllot = config.queryLayers.RasReportAuthAllotmentVW
    const RasAuthLayer = new FeatureLayer({ url: RasAuthAllot })

    let query
    query = RasAuthLayer.createQuery()
    query.where = qryReportViewAuthAllotmentString
    query.returnGeometry = false
    query.outFields = ['ST_ALLOT_NR']
    if (qryReportViewAuthAllotmentString !== '') {
      RasAuthLayer.queryFeatures(query).then(function (result) {
        if (result) {
          const features = result.features
          console.log(features)
          setFeaturesForBilled(features)
        }
      })
    } else {
      setFeaturesForBilled('')
    }
    sharedState.setIsSearching(false)
    setStartBilled(true)
  }

  return (
    <>
       <CollapsablePanel
            label="Authorizations"

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
            </div>
            <div
              style={{
                width: '100%'
              }}
            >
              <label>Authorization Authority:</label>
              <div>
                <Label
                  centric
                  check
                  style={{ paddingLeft: '10px' }}
                  >
                <Checkbox
                  title="FLPMA 402(c)(2) APPROP ACT"
                  aria-label="FLPMA 402(c)(2) APPROP ACT"
                  onChange={(e) => { handleCheckBoxChange('402', e.target.checked) }}
                  checked={_402}
                />
                FLPMA 402(c)(2) APPROP ACT
                </Label>
                </div>
                <div style={styles.container}>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="FULLY PROCESSED"
                  aria-label="FULLY PROCESSED"
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('fully-pro', e.target.checked) }}
                  checked={fullyPro}
                  onClick={() => {}}
                />
                FULLY PROCESSED
                </Label>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="DECISION STAYED"
                  aria-label="DECISION STAYED"
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('dec-stayed', e.target.checked) }}
                  checked={decStayed}
                  onClick={() => {}}
                />
                DECISION STAYED
                </Label>
                </div>
                <div>
                <Label>Effective Date:</Label>
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
                        onChange={(val) => { handleEffectiveDate('begin', val) }}
                        selectedDate={effBegin}
                        strategy="absolute"
                        virtualDateList={[
                          'NOW',
                          'YESTERDAY'
                        ]}
                      />

                      <div
                        id="date-picker-desc-id"
                        style={{
                          display: 'none'
                        }}
                      >
                        This is desc
                      </div>
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
                          onChange={(val) => { handleEffectiveDate('end', val) }}
                          selectedDate={effEnd}
                          strategy="absolute"
                          showQuickNavToToday
                          virtualDateList={[
                            'NOW',
                            'YESTERDAY'
                          ]}
                        />
                    </div>
                  </div>
                </div>
                <div>
                <Label>Expiration Date:</Label>
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
                        selectedDate={expBegin}
                        onChange={(val) => { handleExpirationDate('begin', val) }}
                        strategy="absolute"
                        showQuickNavToToday
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
                          selectedDate={expEnd}
                          onChange={(val) => { handleExpirationDate('end', val) }}
                          strategy="absolute"
                          showQuickNavToToday
                          virtualDateList={[
                            'NOW',
                            'YESTERDAY'
                          ]}
                        />
                    </div>
                  </div>
                </div>

                {/* <div>
                <Label>Issue/Mgr. Signature Date::</Label>
                    <div style={ styles.datetime}>
                    <div
                      style={{
                        width: 150
                      }}
                    >
                      <DatePicker
                        aria-describedby="date-picker-desc-id"
                        aria-label="DateTime picker label"
                        format="shortDateLongTime"
                        onChange={(val) => { handleIssueDate('begin', val) }}
                        // selectedDate={new Date("2022-07-30T06:00:00.000Z")}
                        showDoneButton
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
                          width: 150
                        }}
                      >
                        <DatePicker
                          aria-describedby="date-picker-desc-id"
                          aria-label="DateTime picker label"
                          format="shortDateLongTime"
                          onChange={(val) => { handleIssueDate('end', val) }}
                          showDoneButton
                          strategy="absolute"
                          virtualDateList={[
                            'NOW',
                            'YESTERDAY'
                          ]}
                        />
                    </div>
                  </div>
                </div> */}

            </div>
          </CollapsablePanel>
          </>
  )
}

export default Authorizations
