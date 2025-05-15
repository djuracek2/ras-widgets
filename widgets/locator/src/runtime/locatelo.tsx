import React from 'react'
import { useState } from 'react'
import { Button, Icon } from 'jimu-ui'

const LocateLo = () => {
    // use this state when drawing geometry has begun
const [onDraw, setOnDraw] = useState(false)

  function LocateLo () {
    console.log('locate lo...')
  }

  function updateLocation () {
    console.log('updating Location...')
  }

  function CancelLocation () {
    console.log('canceling location...')
  }
  return (
    <div style={{ fontSize: '14px' }}>
        <div style= {{ display: 'flex', justifyContent: 'left', gap: '10px', padding: '20px' }}>
            <Button
                aria-label="Button"
                icon
                onClick={LocateLo}
                size="lg">
                    Locate LO
            </Button>
         {onDraw && <><Button
                  aria-label="Button"
                  icon
                  onClick={updateLocation}
                  size="lg">
                  Update Location
              </Button><Button
                  aria-label="Button"
                  icon
                  onClick={CancelLocation}
                  size="lg">
                      Cancel
                  </Button></>
        }
        </div>
        <div>
        </div>
    </div>
  )
}
export default LocateLo
