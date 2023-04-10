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

const Art = ({ data }, location) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allContentfulArtPageMenu.edges
  let postCounter = 0

  return (
    <>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      <div className="post-feed" style={{ flexDirection: "column" }}>
        {posts.map(({ node }) => {
          postCounter++
          return (
            <article className="post-content page-template no-image">
              <h3 id="dynamic-styles">{node.title}</h3>
              <div className="post-feed" style={{ flexWrap: "nowrap" }}>
                {node.menuItems.map(item => {
                  console.log("catalogue", item.catalogue)
                  return (
                    <article
                      className={`post-card ${postCounter % 3 === 0 &&
                        `post-card-large`} post
                      ${item ? `with-image` : `no-image`}`}
                      style={
                        item.image && {
                          backgroundImage: `url(${item.image.gatsbyImageData.images.fallback.src})`,
                        }
                      }
                    >
                      {item.catalogue ? (
                        <a
                          href={item.catalogue.file.url}
                          target="_blank"
                          className="post-card-link"
                        >
                          <div className="post-card-content">
                            <h2
                              className="post-card-title"
                              style={{ textAlign: "center" }}
                            >
                              {item.itemName}
                            </h2>
                          </div>
                        </a>
                      ) : (
                        <Link to="/" className="post-card-link">
                          <div className="post-card-content">
                            <h2
                              className="post-card-title"
                              style={{ textAlign: "center" }}
                            >
                              {item.itemName}
                            </h2>
                          </div>
                        </Link>
                      )}
                    </article>
                  )
                })}
              </div>
            </article>
          )
          // return (
          //   <ArtCard
          //     key={node.slug}
          //     count={postCounter}
          //     node={node}
          //     postClass={`post`}
          //   />
          // )
        })}
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

    allContentfulArtPageMenu(sort: { order: ASC, fields: order }) {
      edges {
        node {
          title
          order
          menuItems {
            itemName
            image {
              gatsbyImageData(layout: FULL_WIDTH)
            }
            catalogue {
              file {
                url
              }
            }
          }
        }
      }
    }

    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 1360) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`

export default props => (
  <StaticQuery
    query={indexQuery}
    render={data => (
      <Art location={props.location} props data={data} {...props} />
    )}
  />
)
