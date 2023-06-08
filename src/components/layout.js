import React from "react"
import { Link } from "gatsby"
import { CircleSpinner } from "react-spinners-kit"
import CartNav from "./cartnav"
import "../utils/scss/style.scss"
import { isMobile } from "react-device-detect"

const Layout = props => {
  const { title, children } = props
  const [toggleNav, setToggleNav] = React.useState(false)
  const [displayPodcast, setDisplayPodcast] = React.useState(false)

  console.log("toggle Nav", toggleNav)

  let {
    cart,
    onUpdateCartQty,
    onRemoveFromCart,
    onEmptyCart,
    isCartVisible,
    setCartVisible,
  } = props

  const showDropdownMenu = event => {
    event.preventDefault()
    setDisplayPodcast(true)
    document.addEventListener("mouseenter", hideDropdownMenu)
  }

  const hideDropdownMenu = () => {
    setDisplayPodcast(false)
    document.removeEventListener("mouseout", hideDropdownMenu)
  }

  return (
    <div className={`site-wrapper ${toggleNav ? `site-head-open` : ``}`}>
      <header className="site-head">
        <div className="site-head-container">
          <a
            className="nav-burger"
            href={`#`}
            onClick={() => setToggleNav(!toggleNav)}
          >
            <div
              className="hamburger hamburger--collapse"
              aria-label="Menu"
              role="button"
              aria-controls="navigation"
            >
              <div className="hamburger-box">
                <div className="hamburger-inner" />
              </div>
            </div>
          </a>
          <nav id="swup" class="site-head-left">
            <ul className="nav" role="menu">
              <li className="nav-home" role="menuitem">
                <Link to={`/`} onClick={() => setToggleNav(!toggleNav)}>
                  Home
                </Link>
              </li>
              <li className="nav-about" role="menuitem">
                <Link to={`/store`} onClick={() => setToggleNav(!toggleNav)}>
                  Store
                </Link>
              </li>
              <li className="nav-elements" role="menuitem">
                <Link to={`/art`} onClick={() => setToggleNav(!toggleNav)}>
                  Art
                </Link>
              </li>
              <li className="nav-about" role="menuitem">
                <Link to={`/doula`} onClick={() => setToggleNav(!toggleNav)}>
                  Creativity Doula
                </Link>
              </li>
              <li className="nav-about" role="menuitem">
                <Link to={`/about`} onClick={() => setToggleNav(!toggleNav)}>
                  About
                </Link>
              </li>
              <li className="nav-about" role="menuitem">
                <Link to={`/#contact`} onClick={() => setToggleNav(!toggleNav)}>
                  Contact
                </Link>
              </li>
              {isMobile ? (
                <li className="nav-about" role="menuitem">
                  <Link
                    to={`https://podcasters.spotify.com/pod/show/air-it`}
                    onClick={() => setToggleNav(!toggleNav)}
                  >
                    Podcast
                  </Link>
                  <ul className="subMenu__item__menuList">
                    <li className="subMenu__item-link">
                      <a
                        target="_blank"
                        href="https://podcasters.spotify.com/pod/show/air-it"
                        onClick={() => setToggleNav(!toggleNav)}
                      >
                        Air it
                      </a>
                    </li>
                    <li className="subMenu__item-link">
                      <a
                        target="_blank"
                        href="https://podcasters.spotify.com/pod/show/nicolene-burger"
                        onClick={() => setToggleNav(!toggleNav)}
                      >
                        NB Art notes
                      </a>
                    </li>
                  </ul>
                </li>
              ) : (
                <div></div>
              )}
            </ul>
          </nav>
          <div className="site-head-center">
            <Link className="site-head-logo" to={`/`}>
              Nicolene Burger
            </Link>
          </div>
          <div className="site-head-right">
            <div className="social-links">
              <a
                href="https://www.instagram.com/artist_nb/"
                title="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/channel/UCFNXuqfq5smXcJ0rio2H4bg"
                title="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>

              {isMobile ? (
                <div></div>
              ) : (
                <div
                  className="subMenu"
                  onMouseEnter={e => showDropdownMenu(e)}
                  onMouseLeave={e => hideDropdownMenu(e)}
                >
                  <div className="subMenu__item">Podcast</div>
                  {displayPodcast ? (
                    <ul className="subMenu__item__menuList">
                      <li className="subMenu__item-link">
                        <a
                          target="_blank"
                          href="https://podcasters.spotify.com/pod/show/air-it"
                        >
                          Air it
                        </a>
                      </li>
                      <li className="subMenu__item-link">
                        <a
                          target="_blank"
                          href="https://podcasters.spotify.com/pod/show/nicolene-burger"
                        >
                          NB Art notes
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <div></div>
                  )}
                </div>
              )}

              <div
                style={{
                  display: "block",
                  margin: "0px",
                  padding: "10px 12px",
                  fontWeight: "600",
                }}
              >
                {cart && Object.entries(cart).length === 0 ? (
                  <CircleSpinner size={30} loading={true} color="#131313" />
                ) : (
                  <CartNav
                    cart={cart}
                    onUpdateCartQty={onUpdateCartQty}
                    onRemoveFromCart={onRemoveFromCart}
                    onEmptyCart={onEmptyCart}
                    isCartVisible={isCartVisible}
                    setCartVisible={setCartVisible}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main id="site-main" className="site-main">
        <div id="swup" className="transition-fade">
          {children}
        </div>
      </main>
      <footer className="site-foot">
        &copy; {new Date().getFullYear()} <Link to={`/`}>{title}</Link>
      </footer>
    </div>
  )
}

export default Layout
