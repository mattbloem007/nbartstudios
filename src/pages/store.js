import React, { useState } from "react"
import { graphql, StaticQuery, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

// import "../utils/global.scss"
import "../utils/normalize.css"
import "../utils/css/screen.css"
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

const Store = ({ data }, location) => {
  const siteTitle = data.site.siteMetadata.title
  const products = data.allChecProduct.edges
  const categories = data.allChecCategory.edges
  const [currProducts, setProducts] = useState({ products })
  const [active, setActive] = useState({ active: 0 })

  const handleItemClick = value => {
    console.log("KEY:", value)
    setActive({ active: value })
  }

  const filterItems = category => {
    console.log("category", category)
    const newProducts = products.filter(node => {
      console.log("node", node.node.categories[0].name)
      return node.node.categories[0].name === category
      // comparing category for displaying data
    })
    setProducts({ products: newProducts })
    console.log("products", currProducts.products)
  }

  let postCounter = 0

  return (
    <>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      <div className="post-feed" style={{ flexDirection: "column" }}>
        <article
          className="post-content page-template no-image"
          style={{ margin: "0px" }}
        >
          <div className="container">
            <div className="col-lg-12">
              <div className="page-top">
                <h1 className="title_holder">Store</h1>
              </div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ width: "30%" }}>
              <div className="container">
                <div>
                  <div className="page-top">
                    <h2 className="post-card-title">Categories</h2>
                    <div className="store__nav">
                      <ul className="store__nav-items">
                        <li
                          className="store__nav-item"
                          key={0}
                          onClick={() => handleItemClick(0)}
                        >
                          <div
                            className={`store__nav-item-link${
                              active.active == 0 ? `--active` : ``
                            }`}
                          >
                            <span
                              onClick={() => setProducts({ products })}
                            >{`All`}</span>
                            <span className="categoryBadge">
                              {products.length}
                            </span>
                          </div>
                        </li>
                        {categories.map((node, i) => {
                          return (
                            <li
                              className="store__nav-item"
                              key={i + 1}
                              onClick={() => handleItemClick(i + 1)}
                            >
                              <div
                                className={`store__nav-item-link${
                                  active.active == i + 1 ? `--active` : ``
                                }`}
                              >
                                <span
                                  onClick={() => filterItems(node.node.name)}
                                >{`${node.node.name}`}</span>
                                <span className="categoryBadge">
                                  {node.node.products.length}
                                </span>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="events-feed">
              {currProducts.products.map(({ node }) => {
                postCounter++
                return (
                  <div className="product-card-container">
                    <article
                      className={`product-card  post
                        ${node.image ? `with-image` : `no-image`}`}
                      style={
                        node.image && {
                          backgroundImage: `url(${node.image.url})`,
                        }
                      }
                    >
                      <Link
                        to={node.permalink}
                        className="post-card-link"
                      ></Link>
                    </article>
                    <div className="content">
                      <div className="inner">
                        <p style={{ margin: "0 0 0.5em 0" }}>
                          <Link to={node.permalink}>{node.name}</Link>
                        </p>
                        <span class="category">{node.categories[0].name}</span>
                        <br />
                        <span class="category">
                          {node.price.formatted_with_symbol}
                        </span>
                      </div>
                    </div>
                  </div>
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

    allChecCategory {
      edges {
        node {
          name
          products {
            id
          }
        }
      }
    }

    allChecProduct {
      edges {
        node {
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
          permalink
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
      <Store location={props.location} props data={data} {...props} />
    )}
  />
)
