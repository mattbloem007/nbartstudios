import React, { useEffect, useState } from "react"
import Layout from "./components/layout"
//import commerce from "./lib/Commerce"
import { navigate } from "gatsby"

const Nbcollective = props => {
  const elementWithProps = React.Children.map(props.element, (child, i) =>
    React.cloneElement(child)
  )

  return (
    <div>
      <Layout>{elementWithProps}</Layout>
    </div>
  )
}

export default Nbcollective
