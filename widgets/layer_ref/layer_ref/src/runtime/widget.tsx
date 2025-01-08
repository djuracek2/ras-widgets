import React, { useState, useEffect } from "react";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import "./app.css";
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
import reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { UpCircleOutlined } from "jimu-icons/outlined/directional/up-circle";
import ProcessLayers from "./ProcessLayers";
import { group } from "console";
import { subtle } from "crypto";

const buttonStyles = {
  width: "24px",
  height: "24px",
  fontSize: "12px",
  cursor: "pointer",
  padding: "0px",
  lineHeight: "0px",
  paddingLeft: "3px"
};

const buttonStyles2 = {
  width: "24px",
  height: "24px",
  fontSize: "12px",
  cursor: "pointer",
  padding: "0px",
  lineHeight: "0px",
  paddingLeft: "2px",
};

const Widget = ({ useMapWidgetIds }) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [visibility, setVisibility] = useState({});
  const [zoom, setZoom] = useState();


  const onActiveViewChange = (jmv: JimuMapView) => {
    if (!jmv) {
      console.error("MapView did not initialize correctly.");
      return;
    }
    setJimuMapView(jmv);
    initializeVisibility(jmv);
    setZoom(jmv.view.zoom)
    console.log("MapView initialized:", jmv);
  };



  const handleZoomEvent = () => {
    if (jimuMapView && jimuMapView.view) {
      const newZoom = jimuMapView.view.zoom;
      setZoom(newZoom);
    }
  }

  useEffect(() => {
    if (!jimuMapView || !jimuMapView.view) return;

    const zoomStartListener = jimuMapView.view.on('zoom-start', handleZoomEvent)
    const zoomEndListener = jimuMapView.view.on('zoom-end', handleZoomEvent)

    return () => {
      zoomStartListener.remove();
      zoomEndListener.remove();
    }
  }, [jimuMapView])

  const handleDecreaseZoom = () => {
    if (jimuMapView && jimuMapView.view) {
      jimuMapView.view.zoom -= 1;
      setZoom(jimuMapView.view.zoom)
    }
  }

  const handleIncreaseZoom = () => {
    if (jimuMapView && jimuMapView.view) {
      jimuMapView.view.zoom += 1;
      setZoom(jimuMapView.view.zoom)
    }
  }

  reactiveUtils.watch(()=> [jimuMapView?.view.zoom], (zoom) => {
    setZoom(zoom)
  })

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
      const parentLayerId = layer.parent?.id;
      const parentLayer = jimuMapView?.view?.map.findLayerById(parentLayerId);

      const newVisibility =
        visibilityOverride !== undefined ? visibilityOverride : !layer.visible;
        if (parentLayer) {
          parentLayer.visible = true
        }

        layer.visible = newVisibility;
        setVisibility((prev) => ({ ...prev, [layerId]: newVisibility}))

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
              <h5 style={{ paddingTop: "10px" }}>Layer List</h5>
              <div style={{ marginLeft: 'auto' }}>
                    <Button
                      style={buttonStyles}
                      onClick={handleDecreaseZoom}
                      className="btn"
                      id="decrease-Btn"
                    >
                      <Icon
                        icon='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12H21V13H3V12Z" fill="#6A6A6A"/>
                        </svg>
                        '
                        size="s"
                      />
                    </Button>
                    <Button
                      style={buttonStyles2}
                      onClick={handleIncreaseZoom}
                      className="btn"
                      id="increase-Btn"
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
                jimuMapView={jimuMapView}
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
