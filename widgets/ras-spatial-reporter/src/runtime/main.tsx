import { React, type AllWidgetProps } from "jimu-core";
import { useState, useEffect, useRef } from 'react'
import { Checkbox, Label, Switch, TextInput, Button, ButtonGroup, Select, Option, CollapsablePanel, Radio } from "jimu-ui";
import { DatePicker } from 'jimu-ui/basic/date-picker'

import AcceptModal from './modals/acceptmodal'
import RejectModal from './modals/rejectmodal'

const Main = (success, failure) => {
  const [approve, setApprove] = useState(false)
  const [reject, setReject] = useState(false)
  const [isAccept, setIsAccept] = useState(false)
  const [isReject, setIsReject] = useState(false)
  const [state, handleState] = useState(false)
  const [districtOffice, handleDistrictOffice] = useState(false)
  const [fieldOffice, handleFieldOffice] = useState(false)
  const [inputValidation, setInputValidation] = useState(false)


  const toggleAcceptModal = () => setIsAccept(!isAccept)
  const toggleRejectModal = () => setIsReject(!isReject)
  const handleApproveRejectReset = () => {
    setApprove(false)
    setReject(false)
  }

  const acceptWorkflow = () => {
    setIsAccept(false)
  }

  const rejectWorkflow = () => {
    console.log('reject feature')

    setIsReject(false)
  }

  const runQuery = () => {

  }

  const handleReset = () => {
    // setFormData({
    //   IdText: "",
    //   officeText: "",
    //   approvalMode: "",

    // })
    // setApprovedText('')
    // setSuccess(false)
    // setFailure(false)
    // graphicLayerRef.current.removeAll()
  }

  const handleStateChange = (event) => {
    handleState(event.target.value)
    console.log(state)
  }

  const handleDistrictOfficeChange = (event) => {
    handleDistrictOffice(event.target.value)
    console.log(districtOffice)
  }

  const handleFieldOfficeChange = (event) => {
    handleFieldOffice(event.target.value)
    console.log(fieldOffice)
  }

  return (
<div>
    <div className='d-flex justify-content-center'>
    </div>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: '0px',
      paddingRight: '10px'
    }}>
      <div style={{ width: '150px'}}>
    <Label>
      State:
          <Select
              direction="down"
              placeholder="Select a state..."
              style={{ width: '150px' }}
              onChange={handleStateChange}
            >
              <Option value="arizona">
                Arizona
              </Option>
              <Option value="california">
                California
              </Option>
              <Option value="colorado">
                Colorado
              </Option>
              <Option value="idaho">
                Idaho
              </Option>
              <Option value="montana">
                Montana
              </Option>
              <Option value="nevada">
                Nevada
              </Option>
              <Option value="new mexico">
                New Mexico
              </Option>
              <Option value="oregon">
                Oregon
              </Option>
              <Option value="utah">
                utah
              </Option>
              <Option value="wyoming">
                Wyoming
              </Option>
            </Select>
        </Label>
        </div>

        <div style={{ width: '150px'}}>
          <Label>
          District Offices:
          <Select
            direction="down"
            placeholder="Select a destination..."
            onChange={handleDistrictOfficeChange}
          >
            <Option value="arizona">
              Arizona
            </Option>
            <Option value="california">
              California
            </Option>
            <Option value="colorado">
              Colorado
            </Option>
        </Select>
      </Label>
      </div>
      <div style={{ width: '150px'}}>
      <Label>
          Field Offices:
          <Select
            direction="down"
            placeholder="Select a destination..."
            onChange={handleFieldOfficeChange}
          >
            <Option value="butte">
              Butte
            </Option>
            <Option value="dillon">
              Dillon
            </Option>
            <Option value="colorado">
              Colorado
            </Option>
          </Select>
        </Label>
        </div>
      </div>
    <div>
      {/* { success ? <Label className="success">Feature successfully updated!</Label> : ''}
      { failure ? <Label className="unsuccessful">Feature was unable to updated.</Label> : ''} */}
    </div>
    <div className='d-flex justify-content-center'>
    <ButtonGroup size="default">
      <Button
        aria-pressed="false"
        type="primary"
        disabled={!inputValidation}
        onClick={runQuery}
      >
        Approve
      </Button>
      <Button type="primary" disabled={!inputValidation} onClick={toggleRejectModal}>
        Reject
      </Button>
      <Button type="primary" disabled={!inputValidation} onClick={handleReset}>
        Reset
      </Button>
    </ButtonGroup>
    </div>
    <AcceptModal isOpen={isAccept} toggle={toggleAcceptModal} acceptWorkflow={acceptWorkflow} />
    <RejectModal isOpen={isReject} toggle= {toggleRejectModal} rejectWorkflow={rejectWorkflow} />
  </div>)
}
export default Main
