import React from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

export default props => {
  props.node.menuItems.map(item => {
    console.log("item", item)
    return (
      <article
        className={`post-card ${props.count % 3 === 0 && `post-card-large`} ${
          props.postClass
        } ${item ? `with-image` : `no-image`}`}
      >
        <GatsbyImage className="kg-image" image={item.image.gatsbyImageData} />
        <Link to="/" className="post-card-link">
          <div className="post-card-content">
            <h2 className="post-card-title">{item.itemName}</h2>
          </div>
        </Link>
      </article>
    )
  })
}
