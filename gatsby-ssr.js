import Nbcollective from "./src/root-wrapper"
import React from "react"

const Wrapper = ({ element }) => {
  return <Nbcollective element={element} />
}

export const wrapPageElement = Wrapper
