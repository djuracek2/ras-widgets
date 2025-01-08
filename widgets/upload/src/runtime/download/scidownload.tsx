// import { React, type AllWidgetProps } from 'jimu-core'
import React from 'react'
import { Button, Row, Container, Col } from 'jimu-ui'
import '../app.css'
import survey123Image from '../images/appicon.png'
import accessImage from '../images/microsoft-access-2019.png'
import gdbImage from '../images/fileGDB.png'
import configs from '../../../config.json'

const app = 'SCI'

const SciDownload = ({ onDownloadClick, onDownloadTemplate }) => {
  return (
    <Container>
      <Col className="bg-light border download-cols">
        <div className='content'>
            <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.ScienceLinks.ScienceGISDataDic) }}>Science GIS Data Dictionary</span>
        </div>
        <Row>
          <Col>
            <div className='content'>
              <img src={gdbImage} alt="file gdb download" width="60px" height="60px"></img>
              <br></br>
              <Button size='sm' onClick={() => { onDownloadClick(app, configs.ScienceLinks.FileGDBDownload) }}>GDB Download</Button>
              <br></br>
              <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.ScienceLinks.FileGDBInst) }}>GDB Workflow Guide</span>
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
              <Button size='sm' onClick={() => { onDownloadClick(app, configs.ScienceLinks.Survey123Download) }}>Survey123 Download</Button>
              <br></br>
              <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.ScienceLinks.Survey123WorkflowGuide) }}>Survey123 Workflow Guide</span>
              <br></br>
              <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.ScienceLinks.Survey123GetStarted) }}>Getting Started woth DOI GeoPlatform</span>
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
              <Button size='sm' onClick={() => { onDownloadClick(app, configs.ScienceLinks.ShapefileDownload) }}>Shapefile Download</Button>
              <br></br>
              <span className={ 'clickable-span' } onClick={() => { onDownloadTemplate(app, configs.ScienceLinks.ShapeFileInst) }}>Microsoft Access Workflow</span>
            </div>
          </Col>
        </Row>
      </Col>
    </Container>
  )
}

export default SciDownload
