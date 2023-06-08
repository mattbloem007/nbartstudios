import React from "react"
import { graphql, navigate } from "gatsby"
import Img from "gatsby-image"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { documentToHtmlString } from "@contentful/rich-text-html-renderer"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"

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
      if (
        node.data.uri.includes("youtube.com") ||
        node.data.uri.includes("youtu.be")
      ) {
        // Extract videoId from the URL
        const match = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/.exec(
          node.data.uri
        )
        const videoId = match && match[7].length === 11 ? match[7] : null
        return (
          videoId && (
            <article className="post-card no-image" style={{ width: "68vw" }}>
              <iframe
                className="video"
                title={`https://youtube.com/embed/${videoId}`}
                src={`https://youtube.com/embed/${videoId}`}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                frameBorder="0"
                allowFullScreen
                style={{ maxWidth: "100%", width: "100%" }}
              />
            </article>
          )
        )
      } else {
        return <a href={node.data.uri}>{children}</a>
      }
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
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

class PerformanceTemplate extends React.Component {
  render() {
    const post = this.props.data.contentfulPerformancePage
    const siteTitle = this.props.data.site.siteMetadata.title
    let imageCounter = -1
    return (
      <>
        <SEO title={post.heading} />
        <div className="post-feed" style={{ flexDirection: "column" }}>
          <article className={`post-content ${post.image || `no-image`}`}>
            <header className="post-content-header">
              <h1 className="post-content-title">{post.heading}</h1>
            </header>

            {post.subheading && (
              <p class="post-content-excerpt">{post.subheading}</p>
            )}

            {post.imagesAndText && (
              <div>
                {post.imagesAndText.map((item, i) => {
                  let hyperlink = false
                  if (item.text) {
                    if (
                      item.text.raw.includes("youtu.be") ||
                      item.text.raw.includes("youtube.com")
                    ) {
                      hyperlink = true
                    }
                  }
                  return (
                    <div className="performance-post-feed">
                      {item.gallery ? (
                        item.gallery.map(image => {
                          imageCounter++
                          return (
                            <article
                              className={`post-card-performances ${imageCounter %
                                3 ===
                                0 && `post-card-large`} ${
                                image ? `with-image` : `no-image`
                              }`}
                            >
                              <GatsbyImage
                                className="kg-image"
                                image={image.gatsbyImageData}
                              />
                            </article>
                          )
                        })
                      ) : (
                        <div></div>
                      )}
                      {item.text &&
                        hyperlink &&
                        documentToReactComponents(
                          JSON.parse(item.text.raw),
                          options
                        )}
                      <div className="performance-content-body">
                        {item.text && !hyperlink && (
                          <p>
                            {documentToReactComponents(
                              JSON.parse(item.text.raw),
                              options
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <article
              className={`post-content no-image`}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button className="button" onClick={() => navigate(-1)}>
                <i className="arrow left"></i> Back to Perfomances
              </button>
            </article>
            <footer className="post-content-footer">
              {/* There are two options for how we display the byline/author-info.
          If the post has more than one author, we load a specific template
          from includes/byline-multiple.hbs, otherwise, we just use the
          default byline.

          */}
            </footer>
          </article>
        </div>
      </>
    )
  }
}

export default PerformanceTemplate

export const pageQuery = graphql`
  query PerformancesBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }

    contentfulPerformancePage(artPageFeed: { slug: { eq: $slug } }) {
      heading
      subheading
      imagesAndText {
        text {
          raw
        }
        gallery {
          gatsbyImageData(layout: FULL_WIDTH)
        }
      }
    }
  }
`

// <article
//   className={`post-card post
// ${image ? `with-image` : `no-image`}`}
//   style={
//     image && {
//       backgroundImage: `url(${image.gatsbyImageData.images.fallback.src})`,
//     }
//   }
// ></article>
