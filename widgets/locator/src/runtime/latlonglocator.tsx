import React, { useState } from 'react'
import { Label, Switch } from 'jimu-ui'
import LatLong from './latlong'
import PlssDivision from './plssdivsion'

const LatLonLocator = ({ jmv }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [checked, isChecked] = useState(false)
  const [plssChecked, isPlssChecked] = useState(false)
  

  const toggleSwitch = () => { isChecked(!checked) }
  const togglePlss = () => { isPlssChecked(!plssChecked) }

  return (
    <div style={{ fontSize: '14px' }}>
        <label><strong>Locate your project boundary (required)</strong></label>
        <div style= {{ display: 'left', justifyContent: 'left', gap: '20px', padding: '20px' }}>
          <div>
          <Label>
            <Switch aria-label="Switch" disabled={isLoading} checked={checked} onChange={toggleSwitch}/>
                Locate by Latitude/Longitude
            </Label>
           {checked && <div>
            <LatLong jmv={jmv}></LatLong>
            </div>
          }
          </div>
          <div>
          <Label>
            <Switch aria-label="Switch" disabled={isLoading} checked={plssChecked} onChange={togglePlss}/>
                Locate by PLSS Division
            </Label>
            {plssChecked && <div>
            <PlssDivision></PlssDivision>
            </div>
          }
          </div>
        </div>
    </div>
  )
}
export default LatLonLocator
