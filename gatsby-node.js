const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const eventPost = path.resolve(`./src/templates/event.js`)
  const productPage = path.resolve(`./src/templates/product.js`)
  const performancePage = path.resolve(`./src/templates/performances.js`)
  const exhibitionPage = path.resolve(`./src/templates/exhibitions.js`)
  // actions.createPage({
  //   path: "/air-it",
  //   component: require.resolve("gatsby-theme-anchor/src/templates/Landing.tsx"),
  //   context: {
  //     name: "Air It",
  //   },
  // })
  // actions.createPage({
  //   path: "/404-podcasts",
  //   component: require.resolve("gatsby-theme-anchor/src/templates/404.tsx"),
  // })
  // actions.createPage({
  //   path: "/about-podcasts",
  //   component: require.resolve("gatsby-theme-anchor/src/templates/About.tsx"),
  //   context: {
  //     name: "About Podcasts",
  //   },
  // })

  return graphql(
    `
      {
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

        allContentfulArtPageFeed {
          edges {
            node {
              slug
              typeOfPage
              catalogue {
                id
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
    const events = result.data.allChecProduct.edges
    const products = result.data.allChecProduct.edges
    const performances = result.data.allContentfulArtPageFeed.edges

    // posts.forEach((post, index) => {
    //   const previous = index === posts.length - 1 ? null : posts[index + 1].node
    //   const next = index === 0 ? null : posts[index - 1].node
    //
    //   createPage({
    //     path: post.node.fields.slug,
    //     component: blogPost,
    //     context: {
    //       slug: post.node.fields.slug,
    //       previous,
    //       next,
    //     },
    //   })
    // })

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

    performances.forEach((node, index) => {
      if (node.node.slug && node.node.typeOfPage) {
        createPage({
          path: `/performances/${node.node.slug}`,
          component: performancePage,
          context: {
            slug: node.node.slug,
          },
        })
      } else if (node.node.slug) {
        createPage({
          path: `/exhibitions/${node.node.slug}`,
          component: exhibitionPage,
          context: {
            slug: node.node.slug,
          },
        })
      }
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
