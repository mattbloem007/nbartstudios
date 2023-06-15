import React from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import { documentToHtmlString } from "@contentful/rich-text-html-renderer"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { isMobile } from "react-device-detect"

//TODO: switch to staticQuery, get rid of comments, remove unnecessary components, export as draft template

const Bold = ({ children }) => (
  <span style={{ fontWeight: "bold" }}>{children}</span>
)
const Text = ({ children }) => (
  <p style={{ marginBottom: "0px", width: "100%" }}>{children}</p>
)

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
            <iframe
              className="video"
              title={`https://youtube.com/embed/${videoId}`}
              src={`https://youtube.com/embed/${videoId}`}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
              allowFullScreen
              style={{
                maxWidth: "100%",
                width: "100%",
                height: isMobile ? "70vw" : "18vw",
                margin: "0px",
              }}
            />
          )
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

class TestimonialSlides extends React.Component {
  render() {
    console.log("doulaData", this.props.doulaData)
    return (
      <Carousel interval="500" transitionTime="500" showArrows={true}>
        {this.props.doulaData.testmonial ? (
          this.props.doulaData.testmonial.map(testmonial => {
            return (
              <div className="doula-testimonial" style={{ flexWrap: "nowrap" }}>
                <article className={`testmonial-card post no-image`}>
                  <div className="testmonial-card-link">
                    <div className="testmonial-card-content">
                      <h2
                        className="events-card-title"
                        style={{ textAlign: "center" }}
                      >
                        {testmonial.client}
                      </h2>
                      {documentToReactComponents(
                        JSON.parse(testmonial.clientDetails.raw),
                        options
                      )}
                    </div>
                  </div>
                </article>
                <article className={`testmonial-card post no-image`}>
                  <div className="testmonial-card-link">
                    <div
                      className="testmonial-card-content"
                      style={{ margin: "0px" }}
                    >
                      {/**<iframe
                        className="testimonial-video"
                        src={testmonial.videoTestimonial.file.url}
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        frameBorder="0"
                        webkitallowfullscreen="true"
                        mozallowfullscreen="true"
                        allowFullScreen
                        style={{ margin: "0px", width: "100%" }}
                      />*/
                      documentToReactComponents(
                        JSON.parse(testmonial.embeddedVideo.raw),
                        options
                      )}
                    </div>
                  </div>
                </article>
                {/**<article className={`testmonial-card post no-image`}>
                  <div className="testmonial-card-link">
                    <div className="testmonial-card-content">
                      <h2
                        className="events-card-title"
                        style={{ textAlign: "center" }}
                      >
                        {testmonial.clientTitle}
                      </h2>
                      {documentToReactComponents(
                        JSON.parse(testmonial.clientAchievements.raw),
                        options
                      )}
                    </div>
                  </div>
                </article>*/}
              </div>
            )
          })
        ) : (
          <div></div>
        )}
      </Carousel>
    )
  }
}

export default TestimonialSlides
