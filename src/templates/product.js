import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Img from "gatsby-image"
import ImageGalleryComponent from "../components/imageGallery"
//import Collapsible from "react-collapsible-paragraph";
import commerce from "../lib/Commerce"
import { isMobile } from "react-device-detect"
import SimpleImageSlider from "react-simple-image-slider"
import SEO from "../components/seo"

const Product = props => {
  console.log("Data", props)
  let data = props.data
  const [product, setProduct] = useState({})
  let urlString = data.checProduct.image.url.split("|")
  let url = urlString[0] + "%7C" + urlString[1]

  useEffect(() => {
    commerce.products
      .retrieve(data.checProduct.id)
      .then(product => setProduct(product.assets))
  }, [])

  const handleAddToCart = () => {
    props.onAddToCart(data.checProduct.id, 1)
    if (isMobile && props.isOverlayOpen == false) {
      props.setOverlay(true)
      document
        .querySelector(".trigger-popup-menu")
        .classList.toggle("overlay-wrapper-open")
      document
        .querySelector(".hambergur-menu")
        .classList.toggle("hambergur-menu-open")
    }
    //props.setCartVisible(!props.isCartVisible)
  }

  const htmlToText = html => {
    return html.replace(/(<([^>]+)>)/g, " ")
  }
  let desc = htmlToText(data.checProduct.description)
  console.log("Product", product)
  return (
    <>
      <SEO
        title={data.checProduct.name}
        description={data.checProduct.description}
      />
      <article
        className={`post-content ${data.checProduct.image || `no-image`}`}
      >
        <header className="post-content-header">
          <h1 className="post-content-title">{data.checProduct.name}</h1>
        </header>

        {/**post.frontmatter.description && (
              <p class="post-content-excerpt">{post.frontmatter.description}</p>
            )*/}
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ width: "100%" }}>
            {data.checProduct.image && (
              <div
                className="post-content-image"
                style={{ paddingRight: "111px" }}
              >
                {Object.entries(product).length !== 0 && (
                  <ImageGalleryComponent images={product} />
                )}
              </div>
            )}
          </div>
          <div
            className="row"
            style={{ justifyContent: "center", paddingLeft: "77px" }}
          >
            <div className="col-lg-8">
              <div
                className="post-content-body"
                style={{ textAlign: "center" }}
                dangerouslySetInnerHTML={{
                  __html: data.checProduct.description,
                }}
              />
            </div>
            <div className="col-lg-8" style={{ marginTop: "50px" }}>
              <button
                title=""
                className="button primary"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

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

export const allCategoryQueryData = graphql`
  query oneProductQuery($id: String!) {
    checProduct(id: { eq: $id }) {
      id
      description
      price {
        formatted_with_symbol
      }
      image {
        url
      }
      name
      categories {
        name
      }
    }
  }
`

export default Product
