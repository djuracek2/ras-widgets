import React, { useState, useEffect } from "react";
import {
  CalciteAccordion,
  CalciteAccordionItem,
  CalciteAction,
  CalcitePickListItem,
  CalciteDropdown,
  CalciteDropdownGroup,
  CalciteDropdownItem
} from "@esri/calcite-components-react";

import LayerDetails from "./LayerDetails";
import LayerLabels from './LayerLabels';
import LayerTransparency from './LayerTransparency'

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

const ProcessLayers = ({
  layers,
  jimuMapView,
  toggleLayerVisibility,
  toggleAllInGroup,
  visibility
}) => {
  const [groupVisibility, setGroupVisibility] = useState({});
  const [transparency, setTransparency] = useState(1);

  const handleOpacity = (layerid, value) => {
    const layer = layers.find(
      (layer) => layer.id === layerid
    )

    if (layer) {
      layer.opacity = value;
      layer.refresh();
    }
  };

  const handleDecreaseTransparency = (layerid) => {
    setTransparency((prevTransparency) => {
      const newTransparency = prevTransparency - 0.1;
      handleOpacity(layerid, newTransparency); 
      return newTransparency >= 0 ? newTransparency : 0;
    });
  };

  const handleIncreaseTransparency = (layerid) => {
    setTransparency((prevTransparency) => {
      const newTransparency = prevTransparency + 0.1;
      handleOpacity(layerid, newTransparency); 
      return newTransparency <= 1 ? newTransparency : 1;
    });
  };

  const handleLabelsClick = (id: string) => {
    const layer = layers.find(
      (layer) => layer.id === id
    )
    if (layer) {
      layer.labelsVisible = !layer.labelsVisible;
    }
    const actionElement = document.getElementById(`action-vis-${id}`);
    if (actionElement) {
      actionElement.setAttribute(
        "icon",
        layer.labelsVisible ? "view-visible" : "view-hide"
      );
    }
  };


    const updateGroupVisibility = (groupId, newVisibility) => {
    setGroupVisibility((prev) => ({ ...prev, [groupId]: newVisibility }));

    const parentLayer = jimuMapView.view.map.findLayerById(groupId)?.parent;
    if (parentLayer) {
      const parentLayerId = parentLayer.id;
      const allSublayersVisible = parentLayer.layers.every((sublayer) => visibility[sublayer.id]);
      setGroupVisibility((prev) => ({ ...prev, [parentLayerId]: allSublayersVisible }));

      // Update the main group (grandparent) visibility
      const grandparentLayer = parentLayer.parent;
      if (grandparentLayer) {
        const grandparentLayerId = grandparentLayer.id;
        const allParentSublayersVisible = grandparentLayer.layers.every((sublayer) => visibility[sublayer.id]);
        setGroupVisibility((prev) => ({ ...prev, [grandparentLayerId]: allParentSublayersVisible }));
      }
    }
  };

  const toggleLayer = (layerId, visibility) => {
    toggleLayerVisibility(layerId, visibility);

    // Update immediate parent and main group visibility
    const updateParentAndMainGroupVisibility = (layerId) => {
      const layer = jimuMapView.view.map.findLayerById(layerId);
      const parentLayer = layer?.parent;
      if (parentLayer) {
        const parentLayerId = parentLayer.id;
        const allSublayersVisible = parentLayer.layers.every((sublayer) => visibility[sublayer.id]);
        setGroupVisibility((prev) => ({ ...prev, [parentLayerId]: allSublayersVisible }));

        // Update the main group (grandparent) visibility
        const grandparentLayer = parentLayer.parent;
        if (grandparentLayer) {
          const grandparentLayerId = grandparentLayer.id;
          const allParentSublayersVisible = grandparentLayer.layers.every((sublayer) => visibility[sublayer.id]);
          setGroupVisibility((prev) => ({ ...prev, [grandparentLayerId]: allParentSublayersVisible }));
        }
      }
    };

    updateParentAndMainGroupVisibility(layerId);
  };



  // const updateGroupVisibility = (groupId, newVisibility) => {
  //   setGroupVisibility((prev) => ({ ...prev, [groupId]: newVisibility }));
  //   // Update parent group visibility if applicable
  //   const parentLayer = jimuMapView?.view?.map.findLayerById(groupId)?.parent;
  //   if (parentLayer) {
  //     const parentLayerId = parentLayer.id
  //     const allSublayersVisible = parentLayer.layers.every((sublayer) => visibility[sublayer.id]);
  //     setGroupVisibility((prev) => ({ ...prev, [parentLayerId]: allSublayersVisible}));
  //     updateGroupVisibility(parentLayerId);
  //   }
  // };

  // const toggleLayer = (layerId, visibility) => {
  //   toggleLayerVisibility(layerId, visibility);

  //   const updateParentVisibility = (layerId, depth = 0) => {

  //     const layer = jimuMapView?.view?.map.findLayerById(layerId);
  //     const parentLayer = layer?.parent
  //     // const parentLayerId = layers.find((layer) => layer.id === layerId)?.parent?.id

  //     if (parentLayer) {
  //       const parentLayerId = parentLayer?.id
  //       const allSublayersVisible = parentLayer.layers.every((sublayer) => visibility[sublayer.id]);
  //       updateGroupVisibility(parentLayerId, allSublayersVisible);
  //       updateParentVisibility(parentLayerId)
  //     }
  //   };
  //   updateParentVisibility(layerId)
   
  //   // Update group visibility based on the updated layer visibility
  // };

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
                  jimuMapView={jimuMapView}
                  toggleLayerVisibility={toggleLayerVisibility}
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
              <CalciteDropdown
              slot="actions-end"
              width-scale="l"
              closeOnSelectDisabled="true"
            >
              <CalciteAction
                id={`action-${layer.id}`}
                icon="ellipsis"
                slot="trigger"
                text={layer.title}
              />
              <CalciteDropdownGroup>
              <CalciteDropdownItem label={"Toggle Transparency"}>
                  Layer Transparency
                <LayerTransparency layer={layer} handleIncreaseTransparency={handleIncreaseTransparency} handleDecreaseTransparency={handleDecreaseTransparency}/>
                </CalciteDropdownItem>
              <CalciteDropdownItem
                label={"Layer Details"}
                href={layer.url}
                target={"_blank"}
                >
                Layer Details
                <LayerDetails layer={layer} />
                </CalciteDropdownItem>
                <CalciteDropdownItem label={"Toggle Labels"}>
                  Toggle Labels
                <LayerLabels layer={layer} handleLabelsClick={handleLabelsClick}/>
                </CalciteDropdownItem>
              </CalciteDropdownGroup>
              </CalciteDropdown>
            </CalcitePickListItem>
          );
        }
      })}
    </div>
  );
};

export default ProcessLayers;
