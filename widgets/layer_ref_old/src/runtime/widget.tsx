import React, { useState, useEffect } from "react";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";

import {
  CalcitePickListGroup,
  CalcitePickListItem,
  CalciteAction,
  CalciteAccordion,
  CalciteAccordionItem,
  CalciteDropdown,
  CalciteDropdownGroup,
  CalciteDropdownItem,
  CalciteFab,
} from "calcite-components";
import { fontValue } from "jimu-ui/advanced/rich-text-editor";
import { FontSizeType } from "dist/widgets/arcgis/feature-info/src/config";
import { html } from "jimu-theme";
import { string } from "prop-types";
import { Icon } from "jimu-ui";
import { Button } from "jimu-ui";
import { UpCircleOutlined } from "jimu-icons/outlined/directional/up-circle";
import reactiveUtils from "@arcgis/core/core/reactiveUtils";
import ProcessLayers from "./ProcessLayers";

const Widget = ({ useMapWidgetIds }) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [visibility, setVisibility] = useState({});

  const onActiveViewChange = (jmv: JimuMapView) => {
    if (!jmv) {
      console.error("MapView did not initialize correctly.");
      return;
    }
    setJimuMapView(jmv);
    initializeVisibility(jmv);
    console.log("MapView initialized:", jmv);
  };

  // const toggleLayerVisibility = (layerId, visibility) => {
  //   const layer = jimuMapView?.view?.map.findLayerById(layerId);
  //   if (layer) {
  //     layer.visible = visibility;
  //     // Optionally update state or perform other actions
  //   }
  // };

  const initializeVisibility = (jmv) => {
    const initialVisibility = {};
    jmv.view.map.layers.forEach((layer) => {
      initialVisibility[layer.id] = layer.visible;
    });
    setVisibility(initialVisibility);
  };

  const toggleLayerVisibility = (layerId, visibilityOverride) => {
    const layer = jimuMapView?.view?.map.findLayerById(layerId);
    if (layer) {
      const newVisibility =
        visibilityOverride !== undefined ? visibilityOverride : !layer.visible;
      layer.visible = newVisibility;
      setVisibility((prev) => ({ ...prev, [layerId]: newVisibility }));
    }
  };
  const toggleAllInGroup = (groupId, visibilityStatus) => {
    const groupLayer = jimuMapView?.view?.map.findLayerById(groupId);
    if (groupLayer && groupLayer.layers) {
      // Recursively toggle visibility for all sublayers and nested groups
      const toggleVisibilityRecursive = (layer) => {
        layer.visible = visibilityStatus;
        setVisibility((prev) => ({ ...prev, [layer.id]: visibilityStatus }));
        if (layer.layers && layer.layers.length > 0) {
          layer.layers.forEach((subLayer) =>
            toggleVisibilityRecursive(subLayer)
          );
        }
      };

      // Start recursion from the group layer
      toggleVisibilityRecursive(groupLayer);
    }
  };

  // const toggleAllInGroup = (groupId, visibilityStatus) => {
  //   const groupLayer = jimuMapView?.view?.map.findLayerById(groupId);
  //   if (groupLayer && groupLayer.layers) {
  //     groupLayer.layers.forEach((subLayer) => {
  //       subLayer.visible = visibilityStatus;
  //       setVisibility((prev) => ({ ...prev, [subLayer.id]: visibilityStatus }));
  //     });
  //   }
  // };

  useEffect(() => {
    if (jimuMapView) {
      console.log("Layers available:", jimuMapView.view.map.layers);
    }
  }, [jimuMapView]);

  return (
    <div className="widget-starter jimu-widget" style={{ overflowX: "hidden" }}>
      <calcite-panel>
        <CalciteAccordion icon-position="start" icon-type="caret" scale="m">
          <div className="accordion-container">
            <div
              id="layerlist-header-container"
              className="accordion-header"
              style={{ height: "50px" }}
            >
              <h5>Layer List</h5>
            </div>
          </div>
          {useMapWidgetIds && useMapWidgetIds.length === 1 && (
            <JimuMapViewComponent
              useMapWidgetId={useMapWidgetIds[0]}
              onActiveViewChange={onActiveViewChange}
            />
          )}
          {jimuMapView ? (
            <div>
              <ProcessLayers
                layers={jimuMapView.view.map.layers}
                toggleLayerVisibility={toggleLayerVisibility}
                toggleAllInGroup={toggleAllInGroup}
                visibility={visibility}
              />
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </CalciteAccordion>
      </calcite-panel>
    </div>
  );
};

export default Widget;
