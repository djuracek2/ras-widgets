/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
import { React } from 'jimu-core'
import config from '../configs/config.json'
import { useState, useEffect } from 'react'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { Checkbox, Label, Select, Option, CollapsablePanel } from 'jimu-ui'

const Allotments = ({ sharedState, styles }) => {
  const [allotmentValue, setAllotmentValue] = useState('')
  const [allotGroupValue, setAllotGroupValue] = useState('')
  const [allotAccept, setAllotAccept] = useState(false)
  const [allotReject, setAllotReject] = useState(false)
  const [allotReview, setAllotReview] = useState(false)
  const [outQueryStringAllotment, setOutQueryStringAllotment] = useState('')

  useEffect(() => {
    if (sharedState.isRefreshing) {
      setAllotAccept(false)
      setAllotReject(false)
      setAllotReview(false)
      setAllotGroupValue('')
      setAllotmentValue('')
      sharedState.handleChildRefresh()
    }
  }, [sharedState.isRefreshing])

  function handleCheckBoxChange (checkboxid) {
    if (checkboxid === 'allot-accept') {
      setAllotAccept(!allotAccept)
    } else if (checkboxid === 'allot-reject') {
      setAllotReject(!allotReject)
    } else {
      setAllotReview(!allotReview)
    }
  }

  useEffect(() => {
    let outQueryStringAllotmentApp = ''
    if (allotAccept && !allotReject && !allotReview) {
      outQueryStringAllotmentApp = " ( APPROVAL_FLAG='Y' "
    }

    if (!allotAccept && allotReject && !allotReview) {
      outQueryStringAllotmentApp = " ( APPROVAL_FLAG='N' "
    }

    if (!allotAccept && !allotReject && allotReview) {
      outQueryStringAllotmentApp = ' ( APPROVAL_FLAG is null '
    }

    if (allotAccept && allotReject && !allotReview) {
      outQueryStringAllotmentApp = "( APPROVAL_FLAG='Y' OR APPROVAL_FLAG='Y' "
    }

    if (!allotAccept && allotReject && allotReview) {
      outQueryStringAllotmentApp = "( APPROVAL_FLAG='N' OR APPROVAL_FLAG is null "
    }

    if (allotAccept && !allotReject && allotReview) {
      outQueryStringAllotmentApp = "( APPROVAL_FLAG='Y' OR APPROVAL_FLAG is null "
    }

    if (allotAccept && allotReject && allotReview) {
      outQueryStringAllotmentApp = '( ' + " APPROVAL_FLAG='Y' OR APPROVAL_FLAG='Y' OR APPROVAL_FLAG is null  "
    }

    if (allotmentValue) {
      if (!allotAccept && !allotReject && !allotReview && allotmentValue) {
        outQueryStringAllotmentApp += `( ALLOT_GRP_ID = '${allotmentValue}'`
      } else {
        outQueryStringAllotmentApp += ` AND ALLOT_GRP_ID = '${allotmentValue}'`
      }
    }

    if (allotGroupValue) {
      if (!allotAccept && !allotReject && !allotReview && !allotmentValue && allotGroupValue) {
        outQueryStringAllotmentApp += `( ALLOT_GRP_NUM = '${allotmentValue}'`
      } else {
        outQueryStringAllotmentApp += ` AND ALLOT_GRP_NUM = '${allotmentValue}'`
      }
    }

    outQueryStringAllotmentApp += ' )'

    setOutQueryStringAllotment(outQueryStringAllotmentApp)
  }, [allotAccept, allotReject, allotReview, allotmentValue, allotGroupValue])

  useEffect(() => {
    if (sharedState.isSearching) {
      if (outQueryStringAllotment.length > 0) {
        populateAllotmentFeatures(outQueryStringAllotment)
      }
    }
  }, [sharedState.isSearching])

  function populateAllotmentFeatures (queryString) {
    const allotLayerUrl = config.queryLayers.allotmentPolyLayer
    const allotLayer = new FeatureLayer({ url: allotLayerUrl })

    let query
    query = allotLayer.createQuery()
    console.log(queryString)
    query.where = queryString
    query.returnGeometry = true
    query.outFields = ['*']

    allotLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        console.log('allotment features', result.features)
        sharedState.setAllotmentFeatures(result.features)
      }
    })
  }

  function handleAllotmentSelect (event) {
    setAllotmentValue(event.target.value)
  }

  function handleAllotGroupSelect (event) {
    setAllotGroupValue(event.target.value)
  }
  return (
    <>
    <CollapsablePanel
            label="Allotments"
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
              <label>Review Status:</label>
              <div style={styles.container}>
                <br></br>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="ACCEPT"
                  aria-label="ACCEPT"
                  key="allot-accept"
                  checked={allotAccept}
                  onChange={(e) => { handleCheckBoxChange('allot-accept', e.target.checked) }}
                  onClick={() => {}}
                />
                ACCEPT
                </Label>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="REJECT"
                  key="allot-reject"
                  checked={allotReject}
                  aria-label="REJECT"
                  onChange={(e) => { handleCheckBoxChange('allot-reject', e.target.checked) }}
                  onClick={() => {}}
                />
                REJECT
                </Label>
                <Label
                  centric
                  check
                  >
                <Checkbox
                  title="NOT REVIEWED"
                  key="not-reviewed"
                  checked={allotReview}
                  aria-label="NOT REVIEWED"
                  defaultChecked
                  onChange={(e) => { handleCheckBoxChange('not-reviewed', e.target.checked) }}
                  onClick={() => {}}
                />
                NOT REVIEWED
                </Label>
              </div>
              <div className="d-flex align-items-center" id="allot-group"
                  style={{
                    width: 'auto'
                  }}>
                    <Label style={{ width: '140px' }}>Allot Group:</Label>
                <Select
                onChange={handleAllotGroupSelect}
                value={allotGroupValue}>
                 {sharedState.allotGroupList?.map(year =>
                    <Option
                    value={year.attributes.ALLOT_GRP_ID}>
                        {year.attributes.ALLOT_GRP_ID + '-' + year.attributes.ALLOT_GRP_NM}
                    </Option>
                 )}
                </Select>
              </div>
              <div className="d-flex align-items-center" id="Allotments"
                  style={{
                    width: 'auto',
                    paddingTop: '5px'
                  }}>
                    <Label style={{ width: '140px' }}>Allotments:</Label>
                <Select
                  onChange={handleAllotmentSelect}
                  value={allotmentValue}>
                  {sharedState.allotList?.map(year =>
                    <Option
                    value={year.attributes.ST_ALLOT_NR}>
                        {year.attributes.ST_ALLOT_NR + '-' + year.attributes.ALLOT_NM}
                    </Option>
                  )}
                </Select>
              </div>
              <div className="d-flex align-items-center" style={{ paddingTop: '5px' }}>
              <Label
                size="default"
                style={{ textAlign: 'center' }}
                >
                  (Allotment Group and Allotments would populated upon applying Filters for State/District/Field Offices)
              </Label>
              </div>
            </div>
          </CollapsablePanel>
    </>)
}
export default Allotments
