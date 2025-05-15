import React, { useState } from 'react'

import { Label, Select, Option } from 'jimu-ui'

const PlssDivision = () => {
  const [stateSel, setStateSel] = useState(null)
  const [meridian, setMeridian] = useState(null)
  const [township, setTownship] = useState(null)
  const [section, setSection] = useState(null)
  const [meridianOptions, setMeridianOptions] = useState(null)
  const [townshipOptions, setTownshipOptions] = useState(null)
  const [sectionOptions, setSectionOptions] = useState(null)

  function handleSectionChange(event) {
    setSection(event.target.value)
  }

  function handleTownshipChange(event) {
    setTownship(event.target.value)
  }

  function handleMeridianChange (event) {
    setMeridian(event.target.value)
  }

  function handleStateChange (event) {
    setStateSel(event.target.value)
  }
  return (
    <div style={{ fontSize: '14px' }}>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '250px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label>
          State:
          </Label>
              <Select
                  direction="down"
                  placeholder="Select a state..."
                  style={{ width: '150px' }}
                  onChange={handleStateChange}
                  value={stateSel}
                >
                  <Option value="AZ">
                    Arizona
                  </Option>
                  <Option value="CA">
                    California
                  </Option>
                  <Option value="CO">
                    Colorado
                  </Option>
                  <Option value="ID">
                    Idaho
                  </Option>
                  <Option value="MT">
                    Montana
                  </Option>
                  <Option value="NV">
                    Nevada
                  </Option>
                  <Option value="NM">
                    New Mexico
                  </Option>
                  <Option value="OR">
                    Oregon
                  </Option>
                  <Option value="UT">
                    utah
                  </Option>
                  <Option value="WY">
                    Wyoming
                  </Option>
                </Select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Label>
              Meridian
            </ Label>
              <Select
               style={{ width: '150px' }}
                direction="down"
                placeholder="Select a meridian..."
                onChange={handleMeridianChange}
                value={meridian}
              >
                <Option value={'Select a Distric'}>Select a District...</Option>
                {meridianOptions?.map(meridian=>
                <Option
                value={meridian.attributes.PARENT_NAME}>
                    {meridian.attributes.PARENT_NAME}
                </Option>
                )}
              </Select>
    
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label>
            Township
        </Label>
            <Select
            style={{ width: '150px' }}
                direction="down"
                placeholder="Select a township..."
                onChange={handleTownshipChange}
                value={township}
            >
                <Option value={'Select a Office'}>Select a Office...</Option>
                {townshipOptions?.map(township =>
                <Option

                value={township.attributes.ADM_UNIT_CD}>
                    {township.attributes.ADMU_NAME}
                </Option>
                )}
            </Select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label>
            Section
          </Label>
          <Select
              style={{ width: '150px' }}
              direction="down"
              placeholder="Select a section..."
              onChange={handleSectionChange}
              value={section}
            >
                <Option value={'Select a Office'}>Select a Section...</Option>
              {sectionOptions?.map(section =>
              <Option

              value={section.attributes.ADM_UNIT_CD}>
                  {section.attributes.ADMU_NAME}
              </Option>
              )}
            </Select>
          </div>
        </div>
        <div>
        </div>
    </div>
  )
}
export default PlssDivision
