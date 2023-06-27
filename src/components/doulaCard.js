import React from "react"
import { Link } from "gatsby"

export default props => {
  let urlString = props.node.image.url.split("|")
  let url = urlString[0] + "%7C" + urlString[1]

  return (
    <div className="doula-article">
      <article
        className={`doula-card post
           ${props.node.image ? `with-image` : `no-image`}`}
        style={
          props.node.image && {
            backgroundImage: `url(${url})`,
          }
        }
      >
        <Link to={`/store/${props.node.permalink}`} className="post-card-link">
          <div
            className="post-card-detail"
            style={{ paddingLeft: "50px", paddingRight: "50px" }}
          >
            <h4 className="events-card-title">
              {props.node.name || props.node.slug}
            </h4>
          </div>
          <div className="post-card-content" style={{ top: "100px" }}>
            <h6 className="events-card-byline">
              {props.node.seo ? props.node.seo.title : ""}
            </h6>
          </div>
        </Link>
      </article>
    </div>
  )
}
