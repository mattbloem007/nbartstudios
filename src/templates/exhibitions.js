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

class ExhibitionTemplate extends React.Component {
  render() {
    const post = this.props.data.contentfulPerformancePage
    const siteTitle = this.props.data.site.siteMetadata.title

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
                {post.imagesAndText.map(item => {
                  return (
                    <div className="performance-post-feed">
                      {item.gallery ? (
                        item.gallery.map(image => {
                          console.log("image", image)
                          return (
                            <GatsbyImage
                              className="kg-image"
                              image={image.gatsbyImageData}
                            />
                          )
                        })
                      ) : (
                        <div></div>
                      )}
                      <div className="performance-content-body">
                        {item.text ? (
                          <p>
                            {documentToReactComponents(
                              JSON.parse(item.text.raw),
                              options
                            )}
                          </p>
                        ) : (
                          <div></div>
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
                <i className="arrow left"></i> Back to Exibitions
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

export default ExhibitionTemplate

export const pageQuery = graphql`
  query ExhibitionsBySlug($slug: String!) {
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
