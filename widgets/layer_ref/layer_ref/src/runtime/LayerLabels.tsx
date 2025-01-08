import React from "react";
import { CalciteAction } from "@esri/calcite-components-react";

const transparencyControlStyles2 = {
    display: "inline-block",
    position: "absolute",
    right: "10px",
    bottom: "2px"
  };

const LayerLabels = ({ layer, handleLabelsClick }) => (
<div
    className="transparency-control"
    style={transparencyControlStyles2}
    >
    <CalciteAction
        id={`action-vis-${layer.id}`}
        slot="actions-end"
        icon={layer.labelsVisible ? "view-visible" : "view-hide"}
        text={layer.title}
        scale="s"
        className="labels-button"
        onClick={() => handleLabelsClick(layer.id)}
    />
</div>
)

export default LayerLabels;