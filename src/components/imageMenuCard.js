import React from "react"
import { GatsbyImage } from "gatsby-plugin-image"

export default props => {
  let bookletCounter = props.booklet.node.menuItems.length

  console.log("PROPS", props.booklet)

  return (
    <div className="art-post-feed">
      <article
        className="doula-content page-template no-image"
        style={{ padding: "2vw 0" }}
      >
        <div className="art-menu-post-feed" style={{ flexWrap: "nowrap" }}>
          {props.booklet.node.menuItems.map(item => {
            console.log("catalogue", item)
            return (
              <div className="article">
                <a
                  href={item.booklet.file.url}
                  target="_blank"
                  className="post-card-link"
                >
                  <article
                    className={`post-card ${bookletCounter % 3 === 0 &&
                      `post-card-large`} post
                      ${item ? `with-image` : `no-image`}`}
                  >
                    <GatsbyImage
                      className="kg-image"
                      image={item.image.gatsbyImageData}
                    />
                  </article>
                </a>
              </div>
            )
          })}
        </div>
      </article>
    </div>
  )
}
