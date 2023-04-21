const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const eventPost = path.resolve(`./src/templates/event.js`)
  const productPage = path.resolve(`./src/templates/product.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }

        allChecProduct {
          edges {
            node {
              id
              permalink
              name
              image {
                url
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges
    const events = result.data.allChecProduct.edges
    const products = result.data.allChecProduct.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    events.forEach((event, index) => {
      createPage({
        path: `/events/${event.node.permalink}`,
        component: eventPost,
        context: {
          slug: event.node.permalink,
        },
      })
    })

    products.forEach(product => {
      let urlString = product.node.image.url.split("|")
      let url = urlString[0] + "%7C" + urlString[1]
      createPage({
        path: `/store/${product.node.permalink}`,
        component: productPage,
        context: {
          id: product.node.id,
          url,
        },
      })
    })

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
