import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

class EventTemplate extends React.Component {
  render() {
    const post = this.props.data.checProduct
    const siteTitle = this.props.data.site.siteMetadata.title

    return (
      <>
        <SEO title={post.name} description={post.description} />
        <article className={`post-content ${post.image || `no-image`}`}>
          <header className="post-content-header">
            <h1 className="post-content-title">{post.name}</h1>
          </header>

          {/**post.frontmatter.description && (
            <p class="post-content-excerpt">{post.frontmatter.description}</p>
          )*/}

          {post.image && (
            <div className="post-content-image">
              <img className="kg-image" src={post.image.url} />
            </div>
          )}

          <div
            className="post-content-body"
            style={{ textAlign: "center" }}
            dangerouslySetInnerHTML={{ __html: post.description }}
          />

          <footer className="post-content-footer">
            {/* There are two options for how we display the byline/author-info.
        If the post has more than one author, we load a specific template
        from includes/byline-multiple.hbs, otherwise, we just use the
        default byline. */}
          </footer>
        </article>
      </>
    )
  }
}

export default EventTemplate

export const pageQuery = graphql`
  query EventsBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }

    checProduct(permalink: { eq: $slug }) {
      id
      name
      image {
        url
      }
      categories {
        name
      }
      price {
        formatted_with_symbol
      }
      description
      permalink
    }
  }
`
