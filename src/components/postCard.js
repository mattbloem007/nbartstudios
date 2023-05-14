import React from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

export default props => {
  return (
    <div className="article">
      <article
        className={`post-card ${props.count % 3 === 0 && `post-card-large`} ${
          props.postClass
        } ${props.node.image ? `with-image` : `no-image`}`}
      >
        <GatsbyImage
          className="kg-image"
          image={props.node.image.gatsbyImageData}
        />
        <Link to={props.node.slug} className="post-card-link">
          <div className="post-card-detail">
            <h2 className="post-card-title">
              {props.node.title || props.node.slug}
            </h2>
          </div>
          <div className="post-card-content" style={{ top: "100px" }}>
            <h2
              className="post-card-title"
              style={{ fontSize: "1.7rem", fontStyle: "italic" }}
            >
              {props.node.byline}
            </h2>
          </div>
        </Link>
      </article>
    </div>
  )
}
