const toggleLayerVisibility = (layerId: any, Id: any, toggleVal: any) => {
    let allGroupLayers = [];
    let groupLayersVis = [];
    let groupLayerHid = [];
    // Find the layer in the webmap
    const layer = jimuMapView?.view?.map?.findLayerById(layerId);

    // if (!toggleVal) 

    const groupLayers = document.querySelectorAll(`[data-id="${Id}"]`);

    groupLayers.forEach((layer) => {
      const layerId = layer.getAttribute("value");
      const layerV = jimuMapView?.view?.map?.findLayerById(layerId);

      if (layerV) {
        if (layerV.visible) {
          groupLayersVis.push(layerId)
        } else {
          groupLayerHid.push(layerId)
        }
        allGroupLayers.push(layerId)
      }
      // toggleLayerVisibility(layerId, groupId, toggleVal);
    });

    if (groupLayersVis.length !== allGroupLayers.length) {
      const groupIcon = document.querySelector(`.group-${Id}`);
      // set icons on group
      if (groupIcon) {
        groupIcon.setAttribute("icon", "square");
      }
    } else {
      const groupIcon = document.querySelector(`.group-${Id}`);
      // set icons on group
      if (groupIcon) {
        groupIcon.setAttribute("icon", "check-square");
      }
    }



    

    if (toggleVal && toggleVal !== "undefined" && layer) {
      // Toggle the layer's visibility
      layer.visible = true;
    } else if(toggleVal == false && layer) {
      layer.visible = false;

      // setLabels(prevState => {
      //   const newState = [...prevState];
      //   newState[Id] = !newState[Id];
      //   toggleVal = newState[Id];
      //   return newState;
      // })

    } else {
      if (layer) {
        // Toggle the layer's visibility
        layer.visible = !layer.visible;

        const actionElement = document.getElementById(`action-${layerId}`);

        if (actionElement) {
            actionElement.setAttribute(
            "icon",
            layer.visible ? "check-square" : "square"
          );
        }
      }
    }

    // if (layer) {
    //   const actionElement = document.getElementById(`action-${layerId}`);
    //   const groupLayers = document.getElementById(`[data-id="${Id}"]`);
    //   const groupIcon = document.querySelector(`.group-${Id}`);

    //   if (actionElement) {
    //     actionElement.setAttribute(
    //       "icon",
    //       layer.visible ? "check-square" : "square"
    //     );
    //   }
    //   // set icons on group
    //   if (groupIcon) {
    //     groupIcon.setAttribute(
    //       "icon",
    //       layer.visible  ? "check-square" : "square"
    //     );
    //   }

    //   if (groupLayers) {
    //     groupLayers.setAttribute(
    //       "icon",
    //       layer.visible ? "check-square" : "square"
    //     );
    //   }
    // }
  };