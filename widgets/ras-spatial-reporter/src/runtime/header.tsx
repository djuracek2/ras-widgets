import { React } from 'jimu-core'
import { Label, Switch } from 'jimu-ui'

const Header = ({ toggleSwitch, isLoading, checked, totalRecords }) => {
  return (
    <>
        <Label centric className="d-flex">
            Total Allotments Selected: {totalRecords || 0}
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
