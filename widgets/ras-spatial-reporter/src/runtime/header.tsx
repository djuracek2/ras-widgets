import { React, type AllWidgetProps } from "jimu-core";
import { useState, useEffect, useRef } from 'react'
import { Label, Switch } from 'jimu-ui'

const Header = ({ toggleSwitch, isLoading, checked }) => {
  return (
    <>
        <Label centric className="d-flex">
            Total Allotments Selected: 0
        </Label>
        <h5>Please Select RAS Data Reports</h5>
        <div>
        </div>
        <br></br>
        <Label>
        <Switch aria-label="Switch" disabled={isLoading} checked={checked} onChange={toggleSwitch}/>
            Filter by State/District/Field Offices
        </Label> 
    </>)
}

export default Header
