import React from "react"
import { graphql, StaticQuery, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ArtCard from "../components/artCard"

// import "../utils/global.scss"
import "../utils/normalize.css"
import "../utils/css/screen.css"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
//TODO: switch to staticQuery, get rid of comments, remove unnecessary components, export as draft template

const Bold = ({ children }) => (
  <span style={{ fontWeight: "bold" }}>{children}</span>
)
const Text = ({ children }) => <p>{children}</p>

const options = {
  renderMark: {
    [MARKS.BOLD]: text => {
      console.log("text", text)
      return <Bold>{text}</Bold>
    },
  },
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      console.log("INLINES NODE", node)
      if (node.data.uri.indexOf("youtube.com") >= 0) {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <iframe
              width="340"
              height="315"
              src={node.data.uri}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        )
      } else {
        return <a href={node.data.uri}>{children}</a>
      }
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
      console.log(node)
      return <Text>{children}</Text>
    },
    [BLOCKS.EMBEDDED_ASSET]: node => {
      return (
        <>
          <h2>Embedded Asset</h2>
          <pre>
            <code>{JSON.stringify(node, null, 2)}</code>
          </pre>
        </>
      )
    },
  },
}

const Events = ({ data }, location) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allChecProduct.edges
  let postCounter = 0

  return (
    <>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      <div className="post-feed" style={{ flexDirection: "column" }}>
        <article className="post-content page-template no-image">
          <h3 id="dynamic-styles" style={{ textAlign: "center" }}>
            Upcoming Events
          </h3>
          <div className="doula-feed">
            <div className="doula-article">
              {posts.map(({ node }) => {
                postCounter++
                return (
                  <article
                    className={`doula-card  post
                      ${node.image ? `with-image` : `no-image`}`}
                    style={
                      node.image && {
                        backgroundImage: `url(${node.image.url})`,
                      }
                    }
                  >
                    <Link to={node.permalink} className="post-card-link">
                      <div className="post-card-detail">
                        <h2
                          className="events-card-title"
                          style={{ textAlign: "center" }}
                        >
                          {node.name}
                        </h2>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </article>
      </div>
    </>
  )
}

const indexQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`

export default props => (
  <StaticQuery
    query={indexQuery}
    render={data => (
      <Events location={props.location} props data={data} {...props} />
    )}
  />
)
