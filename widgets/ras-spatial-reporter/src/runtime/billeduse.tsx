import { React, type AllWidgetProps } from "jimu-core";
import { useState, useEffect, useRef } from 'react'
import { Checkbox, Label, Switch, TextInput, Button, ButtonGroup, Select, Option, CollapsablePanel, Radio } from "jimu-ui";
import { DatePicker } from 'jimu-ui/basic/date-picker'

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

  function handleGrazingYear (event) {
    setGrazingYear(event.target.value)
    console.log(grazingYear)
  }

  function handleScheduleType (event) {
    setScheduleType(event.target.value)
    console.log(scheduleType)
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
  return (
    <>
    <CollapsablePanel
            label="Billed Use"
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
                <Option value="california">
                  California
                </Option>
                </Select>
              </div>
              <div className="d-flex align-items-center"
              style={{
                width: 'auto'
              }}>
                <Label style={{ width: '170px' }}>Billing Schedule Type Use: </Label>
                <Select
                onChange={handleScheduleType}>
                <Option value="california">
                  Nebraska
                </Option>
                </Select>
              </div>
            </div>
            </div>
          </CollapsablePanel>
          </>
  )
}
export default BilledUse
