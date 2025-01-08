import { React, type AllWidgetProps } from "jimu-core";
import { useState, useEffect, useRef } from 'react'
import { Checkbox, Label, Switch, TextInput, Button, ButtonGroup, Select, Option, CollapsablePanel, Radio } from "jimu-ui";
import { DatePicker } from 'jimu-ui/basic/date-picker'

const Inspections = (styles) => {
  const [yes, setYes] = useState(false)
  const [no, setNo] = useState(false)
  const [beginTime, setBeginTime] = useState('')
  const [endTime, setEndTime] = useState('')

  function handleTimeBegin (event) {
    setBeginTime(event.target.value)
  }

  function handleTimeEnd (event) {
    setEndTime(event.target.value)
  }

  function handleRadio (val) {
    if (val === 'yes') {
      setYes(true)
      setNo(false)
    } else {
      setNo(true)
      setYes(false)
    }
  }
  return (
    <>
<CollapsablePanel
            label="Inspections"
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
              <Label>Compliance Inspection Date:</Label>
                    <div style={ styles.styles.datetime}>
                    <div
                      style={{
                        width: 150
                      }}
                    >
                      <DatePicker
                        aria-describedby="date-picker-desc-id"
                        aria-label="DateTime picker label"
                        format="shortDateLongTime"
                        onChange={handleTimeBegin}
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
                          onChange={handleTimeEnd}
                          // selectedDate={new Date("2022-07-30T06:00:00.000Z")}
                          showDoneButton
                          strategy="absolute"
                          virtualDateList={[
                            'NOW',
                            'YESTERDAY'
                          ]}
                        />
                    </div>
                  </div>
                  <div>
                    <Label>Out of Compliance?:</Label>
                    <div style={styles.styles.inspections}>
                        <div style={{ paddingRight: '30px' }}>
                          <Label style={{ paddingRight: '10px' }}>YES</Label>
                          <Radio
                            aria-label="Radio"
                            checked = {yes}
                            onBlur={() => {}}
                            onChange={(e) => { handleRadio('yes') }}
                            onClick={() => {}}
                            onFocus={() => {}}
                          />
                      </div>
                      <div style={{ paddingRight: '10px' }}>
                        <Label style={{ paddingRight: '10px' }}>NO</Label>
                        <Radio
                          aria-label="Radio"
                          checked = {no}
                          onBlur={() => {}}
                          onChange={() => {}}
                          onClick={(e) => { handleRadio('no') }}
                          onFocus={() => {}}
                        />
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </CollapsablePanel>
    </>
  )
}

export default Inspections
