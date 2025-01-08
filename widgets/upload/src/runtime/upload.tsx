import { React, type AllWidgetProps } from 'jimu-core'
import React from 'react'
import { FormGroup, Input } from 'jimu-ui'

const UploadFile = ({ handleFileChange, message, messageClass }) => {
  return (
        <div className='upload-div'>
        <div className='d-flex justify-content-center'>
          <h5>Template Download / Data Upload</h5>
        </div>
        <div className='d-flex justify-content-center'>
          <a href="#" target="_blank">GIS Data Upload Instructions</a>
        </div>
        <div className='d-flex justify-content-center' style={{ paddingTop: '10px' }}>
          <label className="file-upload">
            <span><strong>Upload Data (.Zip files only*) </strong></span>
          </label>
        </div>
        <div className='d-flex justify-content-center' style={{ paddingLeft: '60px' }}>
          <FormGroup>
            <Input type="file" name="file" id="inFile" onChange={handleFileChange}/>
          </FormGroup>
        </div>
        <div className="d-flex">
          <label className={ messageClass } style={{ textAlign: 'center', paddingRight: '10px' }}>
            {message}
          </label>
        </div>
      </div>
  )
}

export default UploadFile
