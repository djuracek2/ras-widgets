import React, { useState, useEffect } from "react";
import {
  CalciteAccordion,
  CalciteAccordionItem,
  CalciteAction,
  CalcitePickListItem,
} from "@esri/calcite-components-react";

const ProcessLayers = ({
  layers,
  toggleLayerVisibility,
  toggleAllInGroup,
  visibility,
}) => {
  const [groupVisibility, setGroupVisibility] = useState({});

  const updateGroupVisibility = (groupId, newVisibility) => {
    setGroupVisibility((prev) => ({ ...prev, [groupId]: newVisibility }));
    // Update parent group visibility if applicable
    const parentLayerId = layers.find(
      (layer) => layer.id === groupId
    ).parentLayerId;
    if (parentLayerId) {
      updateGroupVisibility(parentLayerId, newVisibility);
    }
  };

  const toggleLayer = (layerId, visibility) => {
    toggleLayerVisibility(layerId, visibility);
    // Update group visibility based on the updated layer visibility
    updateGroupVisibility(
      layers.find((layer) => layer.id === layerId).parentLayerId,
      visibility
    );
  };

  const toggleAll = (groupId, groupVisibility) => {
    toggleAllInGroup(groupId, !groupVisibility);
    updateGroupVisibility(groupId, !groupVisibility);
  };

  useEffect(() => {
    // Update group visibility when the component mounts
    layers.forEach((layer) => {
      if (layer.type === "group") {
        updateGroupVisibility(layer.id, groupVisibility[layer.id]);
      }
    });
  }, [layers]);

  // Calculate subgroup visibility based on sublayers visibility
  const calculateSubgroupVisibility = (sublayers) => {
    const visibleSublayers = sublayers.filter(
      (sublayer) => visibility[sublayer.id]
    );
    return visibleSublayers.length === sublayers.length;
  };

  return (
    <div>
      {layers.map((layer) => {
        const isGroup = layer.type === "group";
        const layerVisibility = visibility[layer.id];
        const isGroupVisible = groupVisibility[layer.id];

        if (isGroup) {
          const subgroupVisibility = calculateSubgroupVisibility(layer.layers);
          return (
            <CalciteAccordion key={layer.id} scale="m">
              <CalciteAccordionItem
                key={layer.id}
                item-title={layer.title}
                heading={layer.title}
              >
                <CalciteAction
                  slot="actions-end"
                  icon={subgroupVisibility ? "check-square" : "square"}
                  onClick={() => toggleAll(layer.id, subgroupVisibility)}
                  scale="m"
                  text="Toggle All"
                />
                <ProcessLayers
                  layers={layer.layers}
                  toggleLayerVisibility={toggleLayer}
                  toggleAllInGroup={toggleAllInGroup}
                  visibility={visibility}
                />
              </CalciteAccordionItem>
            </CalciteAccordion>
          );
        } else {
          return (
            <CalcitePickListItem
              key={layer.id}
              label={layer.title}
              description={layer.type}
              selected={layerVisibility}
            >
              <CalciteAction
                slot="actions-end"
                icon={layerVisibility ? "check-square" : "square"}
                onClick={() => toggleLayer(layer.id, !layerVisibility)}
                text={layer.title}
              />
            </CalcitePickListItem>
          );
        }
      })}
    </div>
  );
};

export default ProcessLayers;
