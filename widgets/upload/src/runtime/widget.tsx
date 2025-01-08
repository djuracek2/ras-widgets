import { React, type AllWidgetProps } from 'jimu-core'
import React, { useState, useEffect } from 'react'
import { type IMConfig } from '../config'
import { Button } from 'jimu-ui'
import './app.css'
import PalDownload from './download/paldownload'
import SciDownload from './download/scidownload'
import RecDownload from './download/recdownload'
import UploadFile from './upload'

type downloadType = {
  module: string
  infile: string
}

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUpload, setIsUpload] = useState()
  const [isDownload, setIsDownload] = useState()
  const [actionType, setActionType] = useState('')
  const [taskId, setTaskId] = useState('')
  const [appType, setAppType] = useState('')
  const [appNumber, setAppNumber] = useState('')
  const [isSuccessful, setIsSuccessful] = useState('')
  const [message, setMessage] = useState('')
  const [messageClass, setMessageClass] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const action = params.get('actionType')
    const raptorType = params.get('raptorType')
    const Id = params.get('taskId')
    const appNumber = params.get('appNumber')

    if (action === 'Download') {
      setIsUpload(false)
      setIsDownload(true)
    } else {
      setIsUpload(true)
      setIsDownload(false)
    }

    setActionType(action)
    setAppType(raptorType)
    setTaskId(Id)
    setAppNumber(appNumber)
    // console.log('ActionType is:', action)
    // console.log('raptor Type is:', raptorType)
    // console.log('taskId:', Id)
    // console.log('appNumber is:', appNumber)
  }, [])

  const onDownloadTemplate = (module, infile) => {
    const xhr = new XMLHttpRequest()
    const filedownloadPath = 'https://localhost:9264/raptor/api/attachment/downloadGISTemplate?module='
    const inFileName = infile

    xhr.open('GET', filedownloadPath + module + '&fileName=' + inFileName)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const downloadUrl = URL.createObjectURL(xhr.response)
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = downloadUrl
        a.download = inFileName
        a.click()
      }
    }
    xhr.responseType = 'blob'
    xhr.setRequestHeader('X-XSRF-TOKEN', getCookie('XSRF-TOKEN'))
    xhr.send()
  }

  const onDownloadClick = (module, infile) => {
    const xhr = new XMLHttpRequest()
    const filedownloadPath = 'https://localhost:9264/raptor/api/attachment/downloadGISTemplate?module='
    const inFileName = infile

    xhr.open('GET', filedownloadPath + module + '&fileName=' + inFileName)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const downloadUrl = URL.createObjectURL(xhr.response)
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = downloadUrl
        a.download = inFileName
        a.click()
      }
    }
    xhr.responseType = 'blob'
    xhr.setRequestHeader('X-XSRF-TOKEN', getCookie('XSRF-TOKEN'))
    xhr.send()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    console.log(file)
  }

  const handleDownload = () => {
    setIsUpload(false)
    setIsDownload(true)
  }

  const handleClose = () => {
    setIsDownload(false)
    setIsUpload(true)
  }

  const renderComponent = () => {
    switch (appType) {
      case 'PAL':
        return <PalDownload onDownloadClick={ onDownloadClick } onDownloadTemplate={ onDownloadTemplate }/>
      case 'SCI':
        return <SciDownload onDownloadClick={ onDownloadClick } onDownloadTemplate={ onDownloadTemplate } />
      case 'REC':
        return <RecDownload />
    }
  }

  function getCookie (cname) {
    const name = cname + '='
    const decodedCookies = decodeURIComponent(document.cookie)
    console.log(document.cookie)
    const ca = decodedCookies.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }

  function onUploadClick () {
    // taskId = '60051'
    if (taskId == null || taskId === '') {
      alert('No Application number found in the URL, please check with Raptor Administrator.')
      return
    }
    const uploadURL = 'https://localhost:9264/raptor/api/gis/uploadDataFile'
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        const status = xhr.status
        if (status >= 200 && status < 400) {
          console.log(this.responseText)
          console.log(xhr.responseText)
          let responseValue = ''
          responseValue = xhr.response.substring(11, 16)
          if (responseValue.includes('true')) {
            setIsSuccessful('success')
          } else {
            setIsSuccessful('unsuccessful')
          }
        } else {
          setIsSuccessful('unsuccessful')
        }
      }
    }

    const formData = new FormData()
    formData.append('taskId', taskId)
    formData.append('file', selectedFile)
    xhr.open('POST', uploadURL)
    xhr.setRequestHeader('X-XSRF-TOKEN', getCookie('XSRF-TOKEN'))
    xhr.send(formData)
  }

  useEffect(() => {
    if (isSuccessful === 'success') {
      setMessage('Data was successfully uploaded. BLM staff will now review the data.')
      setMessageClass('success')
    } else if (isSuccessful === 'unsuccessful') {
      setMessage('Data upload was unsuccessful. Check email for a detailed data quality report. Resolve these data quality errors then re-initiate data upload here.')
      setMessageClass('unsuccessful')
    } else {
      setMessage('')
      setMessageClass('nothing')
    }
  }, [isSuccessful])

  return (
    <div className="widget-demo jimu-widget m-2">
      { isUpload ? <UploadFile handleFileChange={handleFileChange} message={message} messageClass={messageClass} /> : ''}
      { isDownload
        ? <div className='download-div'>
            <div>
              <div className='download-container'>
                <h5>Template Download</h5>
                <p>GIS field data can be captured and submitted to RAPTOR using one of the file types listed below. Choose one of the following options, then click the
                  button to download its template. When data collection is complete you will return to RAPTOR and select the Upload Data option.
                </p>
              </div>
              <div>
                { renderComponent() }
              </div>
            </div>
          </div>
        : '' }
      <div className='d-flex justify-content-around'>
        <div style={{ paddingTop: '10px' }}>
          { isDownload ? <Button color="primary" onClick={handleDownload}>Download</Button> : '' }
          { isUpload ? <Button color="primary" onClick={onUploadClick}>Upload</Button> : '' }
          <Button color="primary" onClick={handleClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

export default Widget
