import React from "react"
import { Button, ButtonGroup } from "jimu-ui"

const Footer = ({ sharedState }) => {
  return (
    <div className='d-flex justify-content-center'>
    <ButtonGroup size="default">
      <Button
        aria-pressed="false"
        type="primary"
        disabled={!sharedState.inputValidation}
        onClick={sharedState.onSearch}
      >
        Search
      </Button>
      <Button type="primary" disabled={!sharedState.inputValidation} onClick={sharedState.handleRefresh}>
        Refresh
      </Button>
      <Button type="primary" disabled={!sharedState.inputValidation} onClick={sharedState.handleCancel}>
       Cancel
      </Button>
    </ButtonGroup>
    </div>
    
)
}
export default Footer
