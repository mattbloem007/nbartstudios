import React, { useState } from "react"
import { graphql, StaticQuery } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PostCard from "../components/postCard"
import SimpleImageSlider from "react-simple-image-slider"
import axios from "axios"
import { useForm } from "react-hook-form"

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

const BlogIndex = ({ data }, location) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allContentfulHomePageMenu.edges
  let postCounter = 0
  const is = data.contentfulHomePageSlider.images
  let images = []
  is.map(image => {
    images.push({ url: image.file.url })
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  })

  const [serverState, setServerState] = useState({
    submitting: false,
    status: null,
  })

  const [value, setValue] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleServerResponse = (ok, msg, form) => {
    setServerState({
      submitting: false,
      status: { ok, msg },
    })
    if (ok) {
      form.reset()
      setValue({
        name: "",
        email: "",
        message: "",
      })
    }
  }

  const onSubmit = (data, e) => {
    const form = e.target
    console.log("data", data)
    setServerState({ submitting: true })
    axios({
      method: "post",
      url: "https://getform.io/f/ae088cd2-5da9-47df-8c59-599abcbfd957",
      data,
    })
      .then(res => {
        handleServerResponse(
          true,
          "Thanks! for contacting.. Nicolene will reply soonest :)",
          form
        )
      })
      .catch(err => {
        handleServerResponse(false, err.response.data.error, form)
      })
  }

  const onChangeHandler = e => {
    setValue({ ...value, [e.target.name]: e.target.value })
  }

  return (
    <>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      {/* <Bio /> */}
      <header className="page-slider">
        <SimpleImageSlider
          width={896}
          height={504}
          images={images}
          autoPlay={true}
        />
      </header>
      {data.contentfulHomePageBio.bio && (
        <header className="page-head">
          <h2 className="page-head-title">
            {data.contentfulHomePageBio.heading}
          </h2>
          <div className="post-content-body" style={{ marginTop: "50px" }}>
            {documentToReactComponents(
              JSON.parse(data.contentfulHomePageBio.bio.raw),
              options
            )}
          </div>
        </header>
      )}
      <div className="post-feed">
        {posts.map(({ node }) => {
          postCounter++
          return (
            <PostCard
              key={node.slug}
              count={postCounter}
              node={node}
              postClass={`post`}
            />
          )
        })}
      </div>

      <article
        className="post-content page-template no-image"
        id="contact"
        aria-labelledby={`#contact`}
      >
        <header
          className="contact-head"
          style={{ textAlign: "center", marginBottom: "50px" }}
        >
          <h2 className="page-head-title">Contact Me</h2>
        </header>
        <div className="post-content-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row gtr-uniform">
              <div className="col-6 col-12-xsmall">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  {...register("name", {
                    onChange: e => {
                      onChangeHandler(e)
                    },
                    required: "Full Name Required",
                  })}
                />
                {errors.name && (
                  <span className="error">{errors.name.message}</span>
                )}
              </div>
              <div className="col-6 col-12-xsmall">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register("email", {
                    onChange: e => {
                      onChangeHandler(e)
                    },
                    required: "Email Required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="error">{errors.email.message}</span>
                )}
              </div>

              {/* Break */}
              {/* Break */}
              <div className="col-12">
                <textarea
                  id="message"
                  placeholder="Enter your message"
                  {...register("message", {
                    onChange: e => {
                      onChangeHandler(e)
                    },
                    required: "Message Required",
                    minLength: { value: 10, message: "Minimum length is 10" },
                  })}
                ></textarea>
                {errors.message && (
                  <span className="error">{errors.message.message}</span>
                )}
              </div>
              {/* Break */}
              <div className="col-12">
                {serverState.status && <p>{serverState.status.msg}</p>}
                <ul className="actions">
                  <li>
                    <input
                      type="submit"
                      defaultValue="Send Message"
                      className="primary"
                    />
                  </li>
                  {/**<li>
                  <input type="reset" defaultValue="Reset" />
                </li>*/}
                </ul>
              </div>
            </div>
          </form>
        </div>
      </article>
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

    allContentfulHomePageMenu(sort: { order: ASC, fields: order }) {
      edges {
        node {
          title
          byline
          slug
          order
          image {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }

    contentfulHomePageSlider {
      images {
        file {
          url
        }
      }
    }

    contentfulHomePageBio {
      heading
      bio {
        raw
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
      <BlogIndex location={props.location} props data={data} {...props} />
    )}
  />
)
