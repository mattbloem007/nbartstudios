import React from "react"
import { graphql, StaticQuery, navigate } from "gatsby"
import Img from "gatsby-image"
import { GatsbyImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import SEO from "../components/seo"

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

const AboutPage = ({ data }, location) => {
  const aboutData = data.contentfulAboutPage

  return (
    <>
      <SEO title="About" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />

      <article className="post-content page-template no-image">
        <div className="post-content-body">
          <h2 id="clean-minimal-and-deeply-customisable-london-is-a-theme-made-for-people-who-appreciate-simple-lines-">
            {documentToReactComponents(
              JSON.parse(aboutData.introHeader.raw),
              options
            )}
          </h2>
          <GatsbyImage
            className="about-image"
            image={aboutData.featuredImage.gatsbyImageData}
          />
          <article
            className={`post-content no-image`}
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "0px",
            }}
          >
            <button
              className="button primary"
              onClick={() => navigate(aboutData.cv.file.url)}
            >
              View my CV here
            </button>
          </article>
          {documentToReactComponents(JSON.parse(aboutData.body.raw), options)}
        </div>
      </article>
    </>
  )
}

const indexQuery = graphql`
  query {
    contentfulAboutPage {
      introHeader {
        raw
      }
      featuredImage {
        gatsbyImageData(layout: FULL_WIDTH)
      }
      cv {
        file {
          url
        }
      }
      body {
        raw
      }
    }
  }
`

export default props => (
  <StaticQuery
    query={indexQuery}
    render={data => (
      <AboutPage location={props.location} data={data} {...props} />
    )}
  />
)
