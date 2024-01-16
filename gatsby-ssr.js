import Nbcollective from "./src/root-wrapper"
import React from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"

export function onRenderBody({ setHeadComponents }) {
  setHeadComponents([
    // <script
    //   type="text/javascript"
    //   src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=YsZkRA"
    // ></script>,
    // ,
    <script
      dangerouslySetInnerHTML={{
        __html: `
        window.omnisend = window.omnisend || [];
        omnisend.push(["accountID", "64b7b48bf3fd91671509b42f"]);
        omnisend.push(["track", "$pageViewed"]);
        !function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://omnisnippet1.com/inshop/launcher-v2.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}();
   	 `,
      }}
    />,
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
