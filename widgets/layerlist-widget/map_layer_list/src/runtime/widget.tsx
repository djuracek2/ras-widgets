import { React, type AllWidgetProps } from "jimu-core";
import { useState, useEffect } from "react";
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
import { UpCircleOutlined } from "jimu-icons/outlined/directional/up-circle";
import reactiveUtils from "@arcgis/core/core/reactiveUtils";

export default function Map(props: AllWidgetProps<any>) {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [layerList, setLayerList] = useState<JSX.Element[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(true);
  const [groupIconVisible, setGroupIconVisible] = useState(false);
  const [labels, setLabels] = useState([false, false, false, false, false, false, false]);
  const [subLabels, setSubLabels] = useState([false, false])
  const [transparency, setTransparency] = useState(1);
  const [zoom, setZoom] = useState();
  const [groupTitles, setGroupTitles] = useState([])
  const [groupBool, setGroupBool] = useState([
    {
      groupId: 0,
      isVisible: false
    },
    {
      groupId: 1,
      isVisible: false
    },
    {
      groupId: 2,
      isVisible: false
    },
    {
      groupId: 3,
      isVisible: false
    },
    {
      groupId: 4,
      isVisible: false
    },
    {
      groupId: 5,
      isVisible: false
    },
    {
      groupId: 6,
      isVisible: false
    },
    {
      groupId: 7,
      isVisible: false
    }

  ])
  const [subGroup, setSubGroups] = useState([
    {
      groupId: 'sub-3',
      isVisible: false
    },
    {
      groupId: 'sub-6',
      isVisible: false
    }
  ])

  const transparencyControlStyles = {
    display: "inline-block",
    position: "absolute",
    right: "10px",
  };

  const transparencyControlStyles2 = {
    display: "inline-block",
    position: "absolute",
    right: "10px",
    bottom: "2px"
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

  const buttonStyles2 = {
    width: "24px",
    height: "24px",
    fontSize: "12px",
    cursor: "pointer",
    padding: "0px",
    lineHeight: "0px",
    paddingLeft: '2px'
  };

  const handleGroup = (groupId) => {
    const updateGroups = [...groupBool]
    updateGroups.forEach(G => {
      if (G.groupId === groupId) {
        G.isVisible = !G.isVisible
      }
    })

    setGroupBool(updateGroups)
    console.log(updateGroups)
  }

  const handleSubGroup = (groupId) => {
    const updateSubGroups = [...subGroup]
    updateSubGroups.forEach(subG => {
      if (subG.groupId === groupId) {
        subG.isVisible = !subG.isVisible
      }
    })

    setSubGroups(updateSubGroups)

    console.log(subGroup)
  }

  const handleSubGroupIconVisible = (groupId, SubGroupId) => {
    handleSubGroup(groupId)

    const SubIsVisible = subGroup.filter(item => item.groupId === groupId)
    const SubV = SubIsVisible[0].isVisible

    let str = groupId.toString()
    // let togVal = toggleVal;
    let layerID = groupId

    if (str.includes('sub')) {
      str = str.substring(4)
    }

    checkSubGroupClick(groupId, SubV)
    toggleSubGroupIcon(groupId)
    toggleAllIcon(str)
    // checkGroupClick(layerID, groupId, SubV)
  }

  const toggleSubGroupIcon = (groupId, SubGroupId, bool) => {
    const allGroupLayers = []
    const groupLayersVis = []
    const groupLayerHid = []

    const subGroupLayers = document.querySelectorAll(`[data-id="${groupId}"]`)

    subGroupLayers.forEach((layer) => {
      const layerId = layer.getAttribute('value')
      const layerV = jimuMapView?.view?.map?.findLayerById(layerId)

      if (layerV) {
        if (layerV.visible) {
          groupLayersVis.push(layerId)
        } else {
          groupLayerHid.push(layerId)
        }
        if (layerV) {
          allGroupLayers.push(layerId)
        }
      }
    })

    // add logic for subgroup columns here?

    let actionElementSub

    if (groupLayersVis.length !== allGroupLayers.length) {
      if (bool !== 'undefined' && bool) {
        actionElementSub = document.querySelector(`[data-layer-id="${bool}"]`)
      } else {
        actionElementSub = document.querySelector(`[group-id="${groupId}"]`)
      }
      // set icons on group
      if (actionElementSub) {
        actionElementSub.setAttribute('icon', 'square')
      }
    } else {
      if (bool !== 'undefined' && bool) {
        actionElementSub = document.querySelector(`[data-layer-id="${SubGroupId}"]`)
      } else {
        actionElementSub = document.querySelector(`[group-id="${groupId}"]`)
      }
      // set icons on group
      if (actionElementSub) {
        actionElementSub.setAttribute('icon', 'check-square')
      }
    }
  }

  const handleGroupIconVisible = (groupId, layerid, subgroupid) => {
    let subId
    if (subgroupid != 'undefined' && subgroupid != null) {
      subId = subgroupid
    }
    console.log(groupId)
    let toggleVal

    handleGroup(groupId)

    const GroupIsVisible = groupBool.filter(item => item.groupId === groupId)
    const GroupV = GroupIsVisible[0].isVisible;

    toggleAllLayerVisibility(groupId, layerid, GroupV)
    //UNCOMMENT THIS FOR PREVIOUS FUNCTIONALITY
    // setLabels(prevState => {
    //   const newState = [...prevState];
    //   newState[groupId] = !newState[groupId];
    //   toggleVal = newState[groupId];
    //   toggleAllLayerVisibility(groupId, layerid, toggleVal, subId);
    //   return newState;
    // })

    // console.log(groupIconVisible);
  }

  const handleLabelsClick = (id: string) => {
    const layer = jimuMapView?.view?.map?.findLayerById(id);

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

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const handleOpacity = (layerid, value) => {
    const layer = jimuMapView?.view?.map?.findLayerById(layerid);

    if (layer) {
      layer.opacity = value;
      layer.refresh();
    }
  };
  const handleDecreaseTransparency = (layerid) => {
    console.log("Decrease transparency clicked");
    setTransparency((prevTransparency) => {
      const newTransparency = prevTransparency - 0.1;
      console.log("New transparency:", newTransparency);
      const opacity = 1 - newTransparency; // Calculate opacity from transparency
      handleOpacity(layerid, newTransparency); // Call handleOpacity with updated opacity
      return newTransparency >= 0 ? newTransparency : 0;
    });
  };

  const handleIncreaseTransparency = (layerid) => {
    console.log("Increase transparency clicked");
    setTransparency((prevTransparency) => {
      const newTransparency = prevTransparency + 0.1;
      console.log("New transparency:", newTransparency);
      const opacity = 1 - newTransparency; // Calculate opacity from transparency
      handleOpacity(layerid, newTransparency); // Call handleOpacity with updated opacity
      return newTransparency <= 1 ? newTransparency : 1;
    });
  };

  const handleDecreaseZoom = () => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom - 1;
      if (jimuMapView && jimuMapView.view) {
        jimuMapView.view.zoom = newZoom;
      }
      return newZoom;
    });
  };

  const handleIncreaseZoom = () => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom + 1
      if (jimuMapView && jimuMapView.view) {
        jimuMapView.view.zoom = newZoom
      }
      return newZoom
    })
  }

  let groupIdCounter = 0

  const processLayers = (layers: any[], groupId: number | string = '', subGroupId: string) => {
    const layerListItems: JSX.Element[] = []
    let Sub = subGroupId;

    let groupTitles = []
    let subGroupTitles = []
    const layers2 = jimuMapView.view.map.layers.items
    console.log(layers)

    layers2.forEach((layerG) => groupTitles.push(layerG.title))
    console.log('group titles are: ', groupTitles)
    console.log('subgroup titles are: ', subGroupTitles)
    // setGroupTitles(groupTitles)

    layers.forEach((layer, i) => {
      const currentGroupId = groupId !== "" ? groupId : groupIdCounter++;
      if (layer.type === "group") {
        const groupTitle = layer.title || "Group";
        if (!groupTitles.includes(layer.title)) {
          let subGroupId = `sub-${currentGroupId}`
          console.log(layer.title)
          subGroupTitles.push(layer.title)
          console.log(subGroupTitles)

          // let newSubGroup = {
          //   groupId: groupId,
          //   isVisible: false
          // }
          // setSubGroups(prevState => [...prevState, newSubGroup]);


          layerListItems.push(
            <CalciteAccordionItem
              data-id={currentGroupId}
              sub-id={`sub-${currentGroupId}`}
              key={layer.id}
              className={`accordion-item sub-group-${currentGroupId}`}
              description={`sub-${groupTitle}`}
            >
              <CalciteAction
                data-id={`sub-${currentGroupId}`}
                id={`action-${layer.id}`}
                className={`sub-group-${currentGroupId}`}
                data-layer-id={layer.id}
                group-id={`sub-${currentGroupId}`}
                slot="actions-end"
                icon="square"
                text={layer.title}
                onClick={() => handleSubGroupIconVisible(subGroupId, layer.id)}
              />
              <div>{processLayers(layer.layers.items, subGroupId)}</div>
            </CalciteAccordionItem>
          )
          // figure out this logic to add another sub-group
        } else { // Default title or layer title
          layerListItems.push(
          <CalciteAccordionItem
            data-id={currentGroupId}
            key={layer.id}
            className="accordion-item"
            description={groupTitle}
          >
            <CalciteAction
              data-id={currentGroupId}
              id={`action-${layer.id}`}
              group-id={currentGroupId}
              //sub-id={subGroupId ? `sub-group-${currentGroupId}` : `group-${currentGroupId}`}
              className={`group-${currentGroupId}`}
              slot="actions-end"
              icon="square"
              text={layer.title}
              onClick={() => handleGroupIconVisible(currentGroupId, layer.id)}
            />

            <div>{processLayers(layer.layers.items, currentGroupId)}</div>
          </CalciteAccordionItem>
          );
        }
      } else {
        // Add CalcitePickListItem with CalciteAction for individual layers
        layerListItems.push(
          <CalcitePickListItem
            key={layer.id}
            label={layer.title}
            value={layer.id}
            description={layer.type}
            data-id={groupId}
          >
            <CalciteAction
              id={`action-${layer.id}`}
              slot="actions-end"
              data-id={`${currentGroupId}`}
              className={Sub ? `sub-group-${currentGroupId}` : `group-${currentGroupId}`}
              icon={layer.visible ? "check-square" : "square"}
              text={layer.title}
              onClick={() => toggleLayerVisibility(layer.id, groupId)}
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
                <CalciteDropdownItem>
                  Transparency
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
                </CalciteDropdownItem>
                <CalciteDropdownItem label={"Toggle Labels"}>
                  Toggle Labels
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
                </CalciteDropdownItem>
                <CalciteDropdownItem
                  label={"Layer Details"}
                  href={layer.url}
                  target={"_blank"}
                >
                  Layer Details
                  <div
                    className="transparency-control"
                    style={transparencyControlStyles}
                  >
                    <Button
                      style={buttonStyles}
                      href={layer.url}
                      type="tertiary"
                      target={"_blank"}
                    >
                      <Icon
                        icon='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99991 14C6.99991 14.025 7.00291 14.05 7.00391 14.075L3.46391 10.535C1.52614 8.57967 1.53349 5.42577 3.48035 3.47947C5.4272 1.53316 8.5811 1.52671 10.5359 3.46503L14.5359 7.46502C15.731 8.65643 16.2432 10.3709 15.8976 12.0227C15.552 13.6744 14.3954 15.0397 12.8229 15.652L12.5859 15.415C12.4117 15.2393 12.2717 15.0328 12.1729 14.806C13.5137 14.3989 14.5422 13.3175 14.8816 11.9579C15.2209 10.5983 14.8212 9.16045 13.8289 8.17103L9.82891 4.17103C8.37283 2.71559 6.04981 2.6031 4.45991 3.91103L4.14191 3.52403L4.45991 3.91003C3.58739 4.62642 3.05823 5.67817 3.003 6.80576C2.94776 7.93335 3.37159 9.03178 4.16991 9.83003L7.10991 12.77C7.03714 13.176 7.00033 13.5876 6.99991 14ZM22.9999 18C23.0035 16.6732 22.4763 15.4 21.5359 14.464L17.9959 10.925C17.9959 10.95 17.9999 10.975 17.9999 11C17.9981 11.4125 17.9603 11.8241 17.8869 12.23L20.8289 15.171C21.601 15.9429 22.024 16.9969 21.9999 18.0884C21.9757 19.1799 21.5064 20.2141 20.7009 20.951C19.1219 22.3968 16.6846 22.343 15.1709 20.829L11.1709 16.829C10.1694 15.8439 9.7638 14.4025 10.1046 13.0396C10.4453 11.6768 11.4816 10.5959 12.8289 10.198C12.73 9.96963 12.5892 9.76172 12.4139 9.58503L12.1799 9.35103C11.4501 9.63417 10.797 10.0846 10.2729 10.666C8.50323 12.6438 8.58708 15.6596 10.4639 17.536L14.4639 21.536C15.8939 22.9664 18.0448 23.3944 19.9135 22.6203C21.7821 21.8462 23.0003 20.0226 22.9999 18Z" fill="#6A6A6A"/>
                        </svg>'
                        size="m"
                      />
                    </Button>
                  </div>
                </CalciteDropdownItem>
              </CalciteDropdownGroup>
            </CalciteDropdown>
          </CalcitePickListItem>
        );
      }
    });

    return layerListItems;
  };

  // Function to toggle layer visibility and changes icon
  // add logic to check group icon
  const toggleLayerVisibility = (layerId: any, Id: any, toggleVal: any) => {
    // Find the layer in the webmap
    const layer = jimuMapView?.view?.map?.findLayerById(layerId);

    if (layer) {
      // Toggle the layer's visibility
      layer.visible = !layer.visible;
    }

    if (layer) {
      // Update the action icon based on the new visibility state
      const actionElement = document.getElementById(`action-${layerId}`);
      // const groupLayers = document.getElementById(`[data-id="${Id}"]`);
      // const groupIcon = document.querySelector(`.group-${Id}`);

      if (actionElement) {
        actionElement.setAttribute(
          "icon",
          layer.visible ? "check-square" : "square"
        );
      }
    }

    let str = Id.toString()
    console.log( typeof str)

    if (str.includes("sub")) {
      toggleSubGroupIcon(Id)
    } else {
      toggleGroupIcon(layerId, Id, toggleVal)
    }

    if (str.includes("sub")) {
      Id = str.substring(4)
    }

    toggleAllIcon(Id)

    // toggleSubGroupIcon(layerId, Id, toggleVal)

    // if (subId) {
    //   if (subId.includes("sub")) {
    //     toggleSubGroupIcon(Id, layerId, toggleVal)
    //   }
    // }

    // const subBool = true;
   
    // THIS NEEDED FOR GROUP LAYER CHECKS
    // TOGGLE SUB FOR SUB GROUPS
    
    // toggleGroupIcon(layerId, Id, toggleVal)

  };


  const checkSubGroupClick = (Id, toggleVal) => {
    if (toggleVal) {
      const groupIcon = document.querySelector(`.group-${Id}`);
      // set icons on group
      if (groupIcon) {
        groupIcon.setAttribute("icon", "check-square");
      }

      const groupLayers = document.querySelectorAll(`[data-id="${Id}"]`);

      groupLayers.forEach((layer) => {
        const layerId = layer.getAttribute("value");

      const layerV = jimuMapView?.view?.map?.findLayerById(layerId);

        if (layerV) {
          layerV.visible = true;

          const actionElement = document.getElementById(`action-${layerId}`);
    
          if (actionElement) {
            actionElement.setAttribute(
              "icon", "check-square"
            );
          }
        }
      })
   } else {
      const groupIcon = document.querySelector(`.group-${Id}`);
      // set icons on group
      if (groupIcon) {
        groupIcon.setAttribute("icon", "square");
      }

      const groupLayers = document.querySelectorAll(`[data-id="${Id}"]`);

      groupLayers.forEach((layer) => {
        const layerId = layer.getAttribute("value");

      const layerV = jimuMapView?.view?.map?.findLayerById(layerId);

        if (layerV) {
          layerV.visible = false;

          const actionElement = document.getElementById(`action-${layerId}`);
    
          if (actionElement) {
            actionElement.setAttribute(
              "icon", "square"
            );
          }
        }
      })
    }
}

  const checkGroupClick = (layerId, Id, toggleVal) => {
    if (toggleVal) {
      const groupIcon = document.querySelector(`.group-${Id}`);
      // set icons on group
      if (groupIcon) {
        groupIcon.setAttribute("icon", "check-square");
      }

      const groupLayers = document.querySelectorAll(`[data-id="${Id}"]`);

      groupLayers.forEach((layer) => {
        const layerId = layer.getAttribute("value");

      const layerV = jimuMapView?.view?.map?.findLayerById(layerId);

        if (layerV) {
          layerV.visible = true;

          const actionElement = document.getElementById(`action-${layerId}`);
    
          if (actionElement) {
            actionElement.setAttribute(
              "icon", "check-square"
            );
          }
        }
      })
   } else {
      const groupIcon = document.querySelector(`.group-${Id}`);
      // set icons on group
      if (groupIcon) {
        groupIcon.setAttribute("icon", "square");
      }

      const groupLayers = document.querySelectorAll(`[data-id="${Id}"]`);

      groupLayers.forEach((layer) => {
        const layerId = layer.getAttribute("value");

      const layerV = jimuMapView?.view?.map?.findLayerById(layerId);

        if (layerV) {
          layerV.visible = false;

          const actionElement = document.getElementById(`action-${layerId}`);
    
          if (actionElement) {
            actionElement.setAttribute(
              "icon", "square"
            );
          }
        }
      })
    }
}


  // function just to toggle group icon
  const toggleGroupIcon = (layerId, Id,toggleVal, subBool) => {

    if (subBool) {
      return
    } else {

       //checks group icon and if all layers are visible or not
    const allGroupLayers = [];
    const groupLayersVis = [];
    const groupLayerHid = [];

    const groupLayers = document.querySelectorAll(`[data-id="${Id}"]`);
    // const subGroupLayers = document.querySelectorAll(`[data-id="sub-${Id}"]`);

    // const allLayers = [...groupLayers, ...subGroupLayers]
    // console.log(allLayers)

    groupLayers.forEach((layer) => {
      const layerId = layer.getAttribute("value");
      const layerV = jimuMapView?.view?.map?.findLayerById(layerId);

      if (layerV) {
        if (layerV.visible) {
          groupLayersVis.push(layerId)
        } else {
          groupLayerHid.push(layerId)
        }
        if (layerV) {
          allGroupLayers.push(layerId)
        }
      }
    });

    // add logic for subgroup columns here?

    if (groupLayersVis.length !== allGroupLayers.length) {
      const groupIcon = document.querySelector(`.group-${Id}`);
      // set icons on group
      if (groupIcon) {
        groupIcon.setAttribute("icon", "square");
      }
    } else {
      const groupIcon = document.querySelector(`.group-${Id}`);
      // handleGroup(Id)
      // set icons on group
      if (groupIcon) {
        groupIcon.setAttribute("icon", "check-square");
      }
    }

    }
  
   
  //}
  }

  const toggleAllIcon = (Id) => {
    console.log('toggle all icon')

         //checks group icon and if all layers are visible or not
         const allGroupLayers = [];
         const groupLayersVis = [];
         const groupLayerHid = [];
     
         const groupLayers = document.querySelectorAll(`[data-id="${Id}"]`);
         const subGroupLayers = document.querySelectorAll(`[data-id="sub-${Id}"]`);
     
         const allLayers = [...groupLayers, ...subGroupLayers]
         // console.log(allLayers)
     
         allLayers.forEach((layer) => {
           const layerId = layer.getAttribute("value");
           const layerV = jimuMapView?.view?.map?.findLayerById(layerId);
     
           if (layerV) {
             if (layerV.visible) {
               groupLayersVis.push(layerId)
             } else {
               groupLayerHid.push(layerId)
             }
             if (layerV) {
               allGroupLayers.push(layerId)
             }
           }
         });
     
         // add logic for subgroup columns here?
     
         if (groupLayersVis.length !== allGroupLayers.length) {
           const groupIcon = document.querySelector(`[group-id="${Id}"]`);
           // set icons on group
           if (groupIcon) {
             groupIcon.setAttribute("icon", "square");
           }
         } else {
          const groupIcon = document.querySelector(`[group-id="${Id}"]`);
           // handleGroup(Id)
           // set icons on group
           if (groupIcon) {
             groupIcon.setAttribute("icon", "check-square");
           }
         }
     
         }
        
  

  const toggleAllLayerVisibility = (groupId, id, toggleVal, subId) => {
    let togVal = toggleVal;
    let layerID;


    // const actionElement = document.querySelector(`.group-${groupId}`);
    // if (actionElement) {
    //   actionElement.setAttribute(
    //     "icon",
    //     groupIconVisible ? "check-square" : "square"
    //   );
    // }
    // const groupLayers = document.querySelectorAll(`[data-id="${groupId}"]`);

    // groupLayers.forEach((layer) => {
    //   const layerId = layer.getAttribute("value");
    //   // console.log(layer)
    //   layerID = layerId
    //   // console.log(layerId)
    //   toggleLayerVisibility(layerId, groupId, togVal);
    // });

    // const subGroupLayers = document.querySelectorAll(`[data-id="sub-${groupId}"]`);

    // subGroupLayers.forEach((layer) => {
    //   const layerId = layer.getAttribute("value");
    //   layerID = layerId
    //   toggleLayerVisibility(layerId, groupId, togVal);
    // });

    const subGId = `sub-${groupId}`

    
    // gets sublayer group main one

    const subGroupLayers = document.querySelectorAll(`[data-id="sub-${groupId}"]`);
    let elementID;
    let SubV;


    if (subGroupLayers.length > 0) {
      subGroupLayers.forEach(item => {
        if (item.getAttribute('data-layer-id') !== null) {
          elementID = item;
        }
      })
  
      const SubGroupId = elementID.getAttribute("data-layer-id")
      console.log(elementID)
      handleSubGroup(groupId)
  
      const SubIsVisible = subGroup.filter(item => item.groupId === subGId)
      // let SubV = SubIsVisible[0].isVisible

      SubV = toggleVal

      checkSubGroupClick(subGId, toggleVal)
      toggleSubGroupIcon(subGId, SubGroupId, SubV)
      
    }
  
    
    checkGroupClick(layerID, groupId, toggleVal)
    toggleGroupIcon(layerID, groupId)
   
  };

  useEffect(() => {
    if (jimuMapView) {
      let groupTitles = [];
      const layers = jimuMapView.view.map.layers.items;
      console.log(layers)
      layers.forEach((layerG) => groupTitles.push(layerG.title))
      console.log(groupTitles)
      setGroupTitles(groupTitles)
     
      const processedLayerList = processLayers(layers);
      setZoom(jimuMapView.view.zoom) // Process layers
      setLayerList(processedLayerList); // Update layer list state
    }
  }, [jimuMapView]);

  return (
    <div className="widget-starter jimu-widget" style={{ overflowX: "hidden" }}>
      <calcite-panel>
        <CalciteAccordion icon-position="start" icon-type="caret" scale="m">
          <div className="accordion-container">
          <div id="layerlist-header-container" className="accordion-header" style={{height: "50px"}}>
          <h5>Layer List</h5>
                 <div style={{marginLeft: 'auto' }}>
                    <Button
                      style={buttonStyles}
                      onClick={() => handleDecreaseZoom()}
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
                      onClick={() => handleIncreaseZoom()}
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
          {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
            <JimuMapViewComponent
              useMapWidgetId={props.useMapWidgetIds[0]}
              onActiveViewChange={activeViewChangeHandler}
            />
          )}
          <div>{layerList}</div>
        </CalciteAccordion>
      </calcite-panel>
    </div>
  );
}
