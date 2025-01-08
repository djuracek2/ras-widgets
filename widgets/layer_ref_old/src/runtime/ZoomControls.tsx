import React from "react";
import { Button, Icon } from "jimu-ui";

const ZoomControls = ({ onZoomIn, onZoomOut, zoom }) => (
  <div style={{ marginLeft: "auto" }}>
    <Button
      style={{ width: "24px", height: "24px" }}
      onClick={onZoomOut}
      className="btn"
      id="decrease-Btn"
    >
      <Icon icon="<svg ... /svg>" size="s" />
    </Button>
    <Button
      style={{ width: "24px", height: "24px" }}
      onClick={onZoomIn}
      className="btn"
      id="increase-Btn"
    >
      <Icon icon="<svg ... /svg>" size="m" />
    </Button>
    <span>Zoom Level: {zoom}</span>
  </div>
);

export default ZoomControls;
