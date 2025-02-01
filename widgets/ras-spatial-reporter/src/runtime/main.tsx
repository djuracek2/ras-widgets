/* eslint-disable prefer-const */
import { React, type AllWidgetProps } from 'jimu-core'
import { Label, Select, Option } from 'jimu-ui'
import SearchBar from './searchbar'

const Main = ({ sharedState }) => {
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
        <div style={{ width: '150px' }}>
        <Label>
          State:
              <Select
                  direction="down"
                  placeholder="Select a state..."
                  style={{ width: '150px' }}
                  onChange={sharedState.handleStateChange}
                  value={sharedState.stateSel}
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
            </Label>
          </div>
          <div style={{ width: '150px' }}>
            <Label>
              District Offices:
              <Select
                direction="down"
                placeholder="Select a destination..."
                onChange={sharedState.handleDistrictOfficeChange}
                value={sharedState.districtOffice}
              >
                <Option value={'Select a Distric'}>Select a District...</Option>
                {sharedState.districtOptions?.map(district =>
                <Option
                value={district.attributes.PARENT_NAME}>
                    {district.attributes.PARENT_NAME}
                </Option>
                )}
              </Select>
            </Label>
        </div>
        <div style={{ width: '150px' }}>
        <Label>
            Field Offices:
            <Select
              direction="down"
              placeholder="Select a destination..."
              onChange={sharedState.handleFieldOfficeChange}
              value={sharedState.fieldOffice}
            >
                <Option value={'Select a Office'}>Select a Office...</Option>
              {sharedState.officeOptions?.map(district =>
              <Option
              value={district.attributes.ADMIN_ST + '-' + district.attributes.ADMU_NAME}>
                  {district.attributes.ADMU_NAME}
              </Option>
              )}
            </Select>
          </Label>
          </div>
        </div>
      <div>
    </div>
   <SearchBar sharedState={sharedState}/>
  </div>)
}
export default Main
