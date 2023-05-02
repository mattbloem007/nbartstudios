import React from "react"
import { Carousel } from "react-responsive-carousel"
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

class TestimonialSlides extends React.Component {
  render() {
    console.log("doulaData", this.props.doulaData)
    return (
      <Carousel interval="500" transitionTime="500" showArrows={true}>
        {this.props.doulaData.testmonial ? (
          this.props.doulaData.testmonial.map(testmonial => {
            return (
              <div className="post-feed" style={{ flexWrap: "nowrap" }}>
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
                      <iframe
                        src={testmonial.videoTestimonial.file.url}
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        frameBorder="0"
                        webkitallowfullscreen="true"
                        mozallowfullscreen="true"
                        allowFullScreen
                        style={{ height: "21vw", width: "100%" }}
                      />
                    </div>
                  </div>
                </article>
                <article className={`testmonial-card post no-image`}>
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
                </article>
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
