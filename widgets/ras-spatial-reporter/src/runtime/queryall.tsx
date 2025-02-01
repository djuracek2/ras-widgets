import React, { useState, useEffect } from 'react'

import Allotments from './allotments'
import Authorizations from './authorizations'
import BilledUse from './billeduse'
import Inspections from './inspections'
const QueryAll = ({ sharedState, styles, stateSel, districtOffice, fieldOffice }) => {
  const [qryReport, setAllotAuthQuery] = useState('')
  const [qryReportViewAuthAllotmentString, setQryReportViewAuthAllotmentString] = useState('')
  const [queryAuthLiveStockString, setQueryAuthLiveStockString] = useState('')
  const [queryStringAuthorizationAuth, setQueryStringAuthorizationAuth] = useState('')
  const [queryDates, setQueryDates] = useState('')
  const [noDatesTrigger, setNoDatesTrigger] = useState('1')
  const [featuresForBilled, setFeaturesForBilled] = useState([])
  const [featuresForInspection, setFeatureForInspection] = useState([])
  const [startBilled, setStartBilled] = useState(false)
  const [startInspection, setStartInspection] = useState(false)

  //   var queryAuthLiveStockString = "";
  //   var queryStringAuthorizationAuth="";
  //   var qryReportViewAuthAllotmentString;

  //   qryReportViewAuthAllotmentString = this._getAllotmentReviewStatus();
  //   queryAuthLiveStockString =  this._getAuthLiveStockQuery();
  //   queryStringAuthorizationAuth = this._getAuthAuthorityQuery();
  //   var queryDates = this._getAuthorityDatesQuery();
  useEffect(() => {
    let reportViewString = sharedState.stateOfficeQuery

    if (queryAuthLiveStockString !== '') {
      if (reportViewString !== '') {
        reportViewString = reportViewString + ' AND ' + queryAuthLiveStockString
      } else {
        reportViewString = queryAuthLiveStockString
      }
    }

    if (queryStringAuthorizationAuth !== '') {
      if (reportViewString !== '') {
        reportViewString = reportViewString + ' AND ' + queryStringAuthorizationAuth
      } else {
        reportViewString = queryStringAuthorizationAuth
      }
    }
    if (queryDates !== '') {
      if (reportViewString !== '') {
        reportViewString = reportViewString + ' AND ' + queryDates
      } else {
        reportViewString = queryDates
      }
    }
    if (sharedState.stateOfficeQuery !== '') {
      if (reportViewString !== '') {
        reportViewString = reportViewString + ' AND ' + sharedState.stateOfficeQuery
      } else {
        reportViewString = sharedState.stateOfficeQuery
      }
    }

    setQryReportViewAuthAllotmentString(reportViewString)
}, [noDatesTrigger])
//   }, [queryDates])

  return (
  <>
    <Allotments sharedState={sharedState} styles={styles} stateSel={stateSel} setQuery={setAllotAuthQuery} districtOffice={districtOffice} office={fieldOffice}></Allotments>
    <Authorizations setNoDatesTrigger={setNoDatesTrigger} setFeaturesForBilled={setFeaturesForBilled} setStartBilled={setStartBilled} sharedState={sharedState} qryReportViewAuthAllotmentString={qryReportViewAuthAllotmentString} setQueryDates={setQueryDates} setQueryStringAuthorizationAuth={setQueryStringAuthorizationAuth} setQueryAuthLiveStockString={setQueryAuthLiveStockString} styles={styles} stateSel={stateSel} districtOffice={districtOffice} office={fieldOffice}></Authorizations>
    <BilledUse sharedState={sharedState} setFeatureForInspection={setFeatureForInspection} setStartInspection={setStartInspection} featuresForBilled={featuresForBilled} startBilled={startBilled} styles={styles} stateSel={stateSel} districtOffice={districtOffice} office={fieldOffice}></BilledUse>
    <Inspections sharedState={sharedState} featureForInspection={featuresForInspection} startInspection={startInspection} styles={styles} stateSel={stateSel} districtOffice={districtOffice} office={fieldOffice}></Inspections>
 </>
  )
}

export default QueryAll
