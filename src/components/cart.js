import React from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
import Layout from "../components/layout"
import CartItem from "../components/cartItem"
import { CircleSpinner } from "react-spinners-kit"

const Cart = props => {
  let { cart, onUpdateCartQty, onEmptyCart, onRemoveFromCart, showCart } = props

  const handleUpdateCartQty = (lineItemId, quantity) => {
    onUpdateCartQty(lineItemId, quantity)
  }

  const handleEmptyCart = () => {
    onEmptyCart()
  }

  const renderEmptyMessage = () => {
    if (cart) {
      if (cart.total_unique_items > 0) {
        return
      }

      return <p>You have no items in your shopping cart, start adding some!</p>
    } else {
      return <div></div>
    }
  }

  const renderItems = () => {
    if (cart) {
      return cart.line_items.map(lineItem => (
        <CartItem
          item={lineItem}
          key={lineItem.id}
          className="cart inner"
          cart={cart}
          onUpdateCartQty={onUpdateCartQty}
          onRemoveFromCart={onRemoveFromCart}
          onEmptyCart={onEmptyCart}
        />
      ))
    } else {
      return <div></div>
    }
  }
  const renderTotal = () => {
    if (cart) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "33px",
          }}
        >
          <p>Subtotal:</p>
          <p style={{ fontWeight: "bold" }}>
            {cart.subtotal.formatted_with_symbol}
          </p>
        </div>
      )
    } else {
      return <div></div>
    }
  }
  return (
    <div className="cartContainer">
      <div className="col-lg-12">
        <div className="page-top">
          <h1 className="title_holder">Your Shopping Cart</h1>
        </div>
      </div>
      {renderEmptyMessage()}
      {renderItems()}

      <div className="col-lg-12" style={{ justifyContent: "space-between" }}>
        {renderTotal()}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "23px",
          }}
        >
          <button
            className="rn-button btn-white"
            onClick={handleEmptyCart}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "0px 30px",
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>Empty Cart</span>
          </button>
          <button
            className="rn-button btn-white"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "0px 30px",
            }}
            onClick={() => {
              navigate("/checkout")
              showCart()
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>Checkout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
export default Cart
