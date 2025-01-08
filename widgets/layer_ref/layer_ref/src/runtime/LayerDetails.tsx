import React, { useState, useEffect } from "react";
import CalciteDropdownItem from "@esri/calcite-components-react";
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

const LayerDetails = ({ layer }) => (

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
)

export default LayerDetails;
