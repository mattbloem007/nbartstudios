import React from "react"
import { Link } from "gatsby"

export default props => (
  <div className="doula-article">
    <article
      className={`post-card post
         ${props.node.image ? `with-image` : `no-image`}`}
      style={
        props.node.image && {
          backgroundImage: `url(${props.node.image.url})`,
          flex: "0 1 33%",
          margin: "10px 1em",
          paddingLeft: "10px",
          paddingRight: "10px",
          height: "28vw",
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
          <h6
            className="events-card-title"
            style={{ paddingTop: "10px", fontSize: "1.5rem" }}
          >
            {props.node.seo ? props.node.seo.title : ""}
          </h6>
        </div>
      </Link>
    </article>
  </div>
)
