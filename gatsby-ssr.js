import Nbcollective from "./src/root-wrapper"
import React from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"

// export function onRenderBody({ setHeadComponents }) {
//   setHeadComponents([
//     <link
//       rel="stylesheet"
//       href="node_modules/react-responsive-carousel/lib/styles/carousel.min.css"
//     >,
//   ])
// }

const Wrapper = ({ element }) => {
  return <Nbcollective element={element} />
}

export const wrapPageElement = Wrapper
