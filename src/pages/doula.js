import React from "react"
import { graphql, StaticQuery, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Faq from "react-faq-component"
import Img from "gatsby-image"
import SimpleImageSlider from "react-simple-image-slider"
import DoulaCard from "../components/doulaCard"

// import "../utils/global.scss"
import "../utils/normalize.css"
import "../utils/css/screen.css"
import { documentToHtmlString } from "@contentful/rich-text-html-renderer"
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

const styles = {
  bgColor: "#f8f8f8",
  titleTextColor: "black",
  rowTitleColor: "rgb(38, 168, 237)",
  // rowContentColor: 'grey',
  // arrowColor: "red",
}

const config = {
  // animate: true,
  arrowIcon: "V",
  // tabFocus: true
}

const Doula = ({ data }, location) => {
  const siteTitle = data.site.siteMetadata.title
  const doulaData = data.contentfulDoulaPage
  const posts = data.allChecProduct.edges
  let rows = []
  let testmonialData = []
  doulaData.testmonial.map(test => {
    testmonialData.push(test)
  })
  doulaData.faq1.map(faq => {
    let row = {
      title: faq.problemText,
      content: JSON.parse(faq.solutionText.raw).content[0].content[0].value,
    }
    rows.push(row)
  })
  let faqData = { title: "Got a problem?", rows: rows }

  const is = data.contentfulDoulaPage.featuredImages
  let images = []
  is.map(image => {
    images.push({ url: image.file.url })
  })

  console.log("test data", testmonialData)
  console.log("faq data", faqData)
  let postCounter = 0

  return (
    <>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      <div className="post-feed" style={{ flexDirection: "column" }}>
        <article className="post-content page-template no-image">
          <header className="page-slider">
            <SimpleImageSlider
              width={896}
              height={504}
              images={images}
              autoPlay={true}
            />
          </header>
          <article
            className="post-content page-template no-image"
            style={{ paddingTop: "0px", paddingBottom: "0px" }}
          >
            <div
              className="post-content-body"
              style={{
                marginLeft: "145px",
                marginRight: "145px",
                paddingBottom: "0px",
              }}
            >
              <p>
                {documentToReactComponents(
                  JSON.parse(doulaData.intro.raw),
                  options
                )}
              </p>
            </div>
          </article>
          <h3 id="dynamic-styles" style={{ textAlign: "center" }}>
            Testimonials
          </h3>
          <div
            className="post-feed"
            style={{
              flexWrap: "nowrap",
              marginLeft: "145px",
              marginRight: "145px",
            }}
          >
            <article className={`testmonial-card post no-image`}>
              <div className="testmonial-card-link">
                <div className="post-card-content">
                  <h2
                    className="post-card-title"
                    style={{ textAlign: "center" }}
                  >
                    {doulaData.testmonial[0].testmonial1}
                  </h2>
                </div>
              </div>
            </article>
            <article className={`testmonial-card post no-image`}>
              <div className="testmonial-card-link">
                <div
                  className="post-card-content"
                  style={{ paddingBottom: "0px", paddingTop: "0px" }}
                >
                  <iframe
                    src={doulaData.testmonial[0].videoTestimonial.file.url}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    allowFullScreen
                    style={{ height: "21vw" }}
                  />
                </div>
              </div>
            </article>
            <article className={`testmonial-card post no-image`}>
              <div className="testmonial-card-link">
                <div className="post-card-content">
                  {doulaData.testmonial[0].testmonial1}
                </div>
              </div>
            </article>
          </div>
          <article
            className="post-content page-template no-image"
            style={{ paddingTop: "0px" }}
          >
            <div
              className="post-content-body"
              style={{
                marginLeft: "145px",
                marginRight: "145px",
                paddingBottom: "0px",
              }}
            >
              <p>
                {documentToReactComponents(
                  JSON.parse(doulaData.creativeCycle.raw),
                  options
                )}
              </p>
            </div>
          </article>
          <div className="doula-feed">
            {posts.map(({ node }) => {
              return <DoulaCard key={node.slug} node={node} />
            })}
          </div>
          <article className="post-content page-template no-image">
            <div
              className="post-content-body"
              style={{ marginLeft: "145px", marginRight: "145px" }}
            >
              <Faq data={faqData} styles={styles} config={config} />
            </div>
          </article>
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

    contentfulDoulaPage {
      faq1 {
        problemText
        solutionText {
          raw
        }
      }
      testmonial {
        testmonial1
        testmonial2
        videoTestimonial {
          file {
            url
          }
        }
      }
      intro {
        raw
      }
      creativeCycle {
        raw
      }
      featuredImages {
        file {
          url
        }
      }
    }

    allChecProduct(
      filter: { categories: { elemMatch: { name: { eq: "Workshops" } } } }
    ) {
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
      <Doula location={props.location} props data={data} {...props} />
    )}
  />
)
