// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
import "typeface-nunito"
import "typeface-alegreya"

import Nbcollective from "./src/root-wrapper"
import React from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const Wrapper = ({ element }) => {
  return <Nbcollective element={element} />
}

export const wrapPageElement = Wrapper
