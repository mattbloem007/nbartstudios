import Nbcollective from "./src/root-wrapper"
import React from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"

export function onRenderBody({ setHeadComponents }) {
  setHeadComponents([
    <script
      type="text/javascript"
      src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=YsZkRA"
    ></script>,
  ])
  // setPreBodyComponents([
  //   <div id="checkout">
  //     <div id="paypal-button-container"></div>
  //   </div>,
  // ])
}

const Wrapper = ({ element }) => {
  return <Nbcollective element={element} />
}

export const wrapPageElement = Wrapper
