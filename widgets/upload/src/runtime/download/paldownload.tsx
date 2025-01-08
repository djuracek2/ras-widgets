import { React, type AllWidgetProps } from 'jimu-core'
import React, { useState } from 'react'
import { Button, Row, Container, Col } from 'jimu-ui'
import '../app.css'
import survey123Image from '../images/appicon.png'
import accessImage from '../images/microsoft-access-2019.png'
import gdbImage from '../images/fileGDB.png'
import configs from '../../../config.json'
import { activePagePartChanged } from 'jimu-core/lib/app-actions'

const app = 'PAL'

const PalDownload = ({ onDownloadClick, onDownloadTemplate }) => {
  return (
  <Container>
      <Col className="bg-light border download-cols">
        <Row>
            <Col>
                <div className='content'>
                <img src={gdbImage} alt="file gdb download" width="60px" height="60px"></img>
                <br></br>
                    <Button size='sm' onClick={() => { onDownloadClick(app, configs.PalLinks.FileGDBDownload) }}>File Geodatabase</Button>
                    <br></br>
                    <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.PalLinks.FileGDBWorkflowGuide) }}>GeoDatabase Workflow Guide</span>
                    <br></br>
                    <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.PalLinks.FileGDBDataDic) }}>Geodatabase Data Dictionary</span>
                </div>
            </Col>
        </Row>
      </Col>
      <Col className="bg-light border download-cols">
        <Row>
            <Col>
              <div className='content'>
              <img src={survey123Image} alt="survey 123 download" width="60px" height="60px"></img>
              <br></br>
                  <Button size='sm' onClick={() => { onDownloadClick(app, configs.PalLinks.Survey123Download) }}>Survey123 Download</Button>
                  <br></br>
                  <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.PalLinks.Survey123WorkflowGuide) }}>Survey123 Workflow Guide</span>
                  <br></br>
                  <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.PalLinks.Survey123GetStarted) }}>Getting Started with DOI GeoPlatform</span>
              </div>
            </Col>
          </Row>
      </Col>
      <Col className="bg-light border download-cols">
        <Row>
            <Col>
              <div className='content'>
              <img src={accessImage} alt="microsoft access download" width="60px" height="60px"></img>
              <br></br>
                <Button size='sm' onClick={() => { onDownloadClick(app, configs.PalLinks.MSAccessDownload) }} >Microsoft Access Download</Button>
                <br></br>
                <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.PalLinks.MSAccessWorkflowGuide) }}>Paleo MS Access Workflow Guide</span>
              </div>
            </Col>
          </Row>
        </Col>
    </Container>
  )
}

export default PalDownload
