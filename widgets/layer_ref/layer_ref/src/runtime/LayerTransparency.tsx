import React from "react";

import { Icon } from "jimu-ui";
import { Button } from "jimu-ui";


const transparencyControlStyles = {
    display: "inline-block",
    position: "absolute",
    right: "10px",
  };
  
  const buttonStyles = {
    width: "24px",
    height: "24px",
    fontSize: "12px",
    cursor: "pointer",
    padding: "0px",
    lineHeight: "0px",
    paddingLeft: "3px"
  };

const LayerTransparency = ({ layer, handleIncreaseTransparency, handleDecreaseTransparency }) => (
    <div
    className="transparency-control"
    style={transparencyControlStyles}
  >
    <Button
      style={buttonStyles}
      onClick={() => handleDecreaseTransparency(layer.id)}
      size="default"
    >
      <Icon
        icon='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12H21V13H3V12Z" fill="#6A6A6A"/>
        </svg>
        '
        size="m"
      />
    </Button>

    <Button
      style={buttonStyles}
      onClick={() => handleIncreaseTransparency(layer.id)}
    >
      <Icon
        icon='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 12H12V6H13V12H19V13H13V19H12V13H6V12Z" fill="#6A6A6A"/>
        </svg>
        '
        size="m"
      />
    </Button>
  </div>
)

export default LayerTransparency;