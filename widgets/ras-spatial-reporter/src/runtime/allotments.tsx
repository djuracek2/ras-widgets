import { React, type AllWidgetProps } from "jimu-core";
import { useState, useEffect, useRef } from 'react'
import { Checkbox, Label, Switch, TextInput, Button, ButtonGroup, Select, Option, CollapsablePanel, Radio } from "jimu-ui";
import { DatePicker } from 'jimu-ui/basic/date-picker'

const Allotments = (styles) => {
  const [allotmentValue, setAllotmentValue] = useState('')
  const [allotGroupValue, setAllotGroupValue] = useState('')
  const [allotAccept, setAllotAccept] = useState(false)
  const [allotReject, setAllotReject] = useState(false)
  const [allotReview, setAllotReview] = useState(false)

  function handleCheckBoxChange (checkboxid, checked) {
    console.log(checkboxid, checked)
    if (checkboxid === 'allot-accept') {
      setAllotAccept(!allotAccept)
    } else if (checkboxid === 'allot-reject') {
      setAllotReject(!allotReject)
    } else {
      setAllotReview(!allotReview)
    }
  }

  function handleAllotmentSelect (event) {
    setAllotmentValue(event.target.value)
    console.log(allotmentValue)
  }

  function handleAllotGroupSelect (event) {
    setAllotGroupValue(event.target.value)
    console.log(allotGroupValue)
  }
  return (
    <>
    <CollapsablePanel
            label="Allotments"
            defaultIsOpen="true"
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
              <div style={styles.styles.container}>
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
                onChange={handleAllotGroupSelect}>
                <Option value="california">
                  California
                </Option>
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
                >
                <Option value="california">
                  California
                </Option>
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
export default Allotments;