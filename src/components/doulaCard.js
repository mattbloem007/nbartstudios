import React from "react"
import { Link } from "gatsby"

export default props => (
  <article
    className={`events-card post
       ${props.node.image ? `with-image` : `no-image`}`}
    style={
      props.node.image && {
        backgroundImage: `url(${props.node.image.url})`,
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
        <h6 className="events-card-title" style={{ paddingTop: "10px" }}>
          {props.node.seo ? props.node.seo.title : ""}
        </h6>
      </div>
    </Link>
  </article>
)
