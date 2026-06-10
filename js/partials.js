/* ============================================================
   partials.js — inject shared header/footer
   Runs synchronously (no defer) right after the body parses,
   so main.js (deferred) sees the full DOM on DOMContentLoaded.
   Pages opt in by including:
     <div data-partial="header"></div>
     <div data-partial="footer"></div>
   Active nav link is derived from <body data-page="...">.
   ============================================================ */

(function () {
  'use strict';

  const HEADER_HTML = `
  <div class="promo-bar" role="region" aria-label="Promotional announcement">
    <div class="promo-bar__inner container">
      <p class="promo-bar__text">Spring offer — free shipping on orders over $80 · Express next-day delivery in major metros</p>
    </div>
  </div>

  <header class="header" id="site-header">
    <div class="header__inner container">

      <div class="header__left">
        <a href="index.html" class="header__logo" aria-label="UpHealth home">
          <span class="header__logo-mark">up</span><span class="header__logo-word">health</span>
        </a>

        <button class="header__burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
          <span></span><span></span><span></span>
        </button>

        <nav class="header__nav" aria-label="Primary navigation">
          <ul class="header__nav-list">

            <li class="header__nav-item header__nav-item--has-menu" data-menu="catalog" data-page="shop">
              <button class="header__nav-link header__nav-link--button" aria-expanded="false" aria-controls="menu-catalog">
                Catalog <span class="header__nav-caret">▾</span>
              </button>
              <div class="mega-menu mega-menu--wide" id="menu-catalog" role="region" aria-label="Product catalog">
                <div class="mega-menu__inner">
                  <div>
                    <h4 class="mega-menu__col-title">Formats</h4>
                    <ul class="mega-menu__list">
                      <li><a href="shop.html"             class="mega-menu__link">All products</a></li>
                      <li><a href="shop.html?cat=sticks"  class="mega-menu__link">Sticks</a></li>
                      <li><a href="shop.html?cat=gummies" class="mega-menu__link">Gummies</a></li>
                      <li><a href="shop.html?cat=drinks"  class="mega-menu__link">Drinks</a></li>
                      <li><a href="shop.html?cat=protein" class="mega-menu__link">Protein</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="mega-menu__col-title">Collections</h4>
                    <ul class="mega-menu__list">
                      <li><a href="shop.html?cat=bundles" class="mega-menu__link">Bundles</a></li>
                      <li><a href="shop.html?cat=sale"    class="mega-menu__link">Sale</a></li>
                      <li><a href="shop.html?cat=new"     class="mega-menu__link">New arrivals</a></li>
                      <li><a href="#"                     class="mega-menu__link">Gift cards</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="mega-menu__col-title">Resources</h4>
                    <ul class="mega-menu__list">
                      <li><a href="about.html"    class="mega-menu__link">About the science</a></li>
                      <li><a href="bonuses.html"  class="mega-menu__link">Loyalty program</a></li>
                      <li><a href="delivery.html" class="mega-menu__link">Shipping &amp; returns</a></li>
                      <li><a href="faq.html"      class="mega-menu__link">FAQ</a></li>
                    </ul>
                  </div>
                  <a class="mega-menu__featured" href="product.html">
                    <div class="mega-menu__featured-image" aria-hidden="true">
                      <img src="assets/image/png/photo_2026-06-01_10-27-57.jpg" alt="" loading="lazy" />
                    </div>
                    <div class="mega-menu__featured-body">
                      <span class="mega-menu__featured-label">Featured</span>
                      <span class="mega-menu__featured-title">Vanilla Whey Protein</span>
                      <span class="mega-menu__featured-cta">Shop now →</span>
                    </div>
                  </a>
                </div>
              </div>
            </li>

            <li class="header__nav-item header__nav-item--has-menu" data-menu="states">
              <button class="header__nav-link header__nav-link--button" aria-expanded="false" aria-controls="menu-states">
                States <span class="header__nav-caret">▾</span>
              </button>
              <div class="mega-menu" id="menu-states" role="region" aria-label="Wellness states">
                <div class="mega-menu__inner">
                  <div>
                    <h4 class="mega-menu__col-title">By outcome</h4>
                    <ul class="mega-menu__list">
                      <li><a href="shop.html?state=energy"   class="mega-menu__link"><span class="mega-menu__bullet" data-state="energy"></span>Energy</a></li>
                      <li><a href="shop.html?state=sleep"    class="mega-menu__link"><span class="mega-menu__bullet" data-state="sleep"></span>Sleep</a></li>
                      <li><a href="shop.html?state=relax"    class="mega-menu__link"><span class="mega-menu__bullet" data-state="relax"></span>Relax</a></li>
                      <li><a href="shop.html?state=beauty"   class="mega-menu__link"><span class="mega-menu__bullet" data-state="beauty"></span>Beauty</a></li>
                      <li><a href="shop.html?state=strength" class="mega-menu__link"><span class="mega-menu__bullet" data-state="strength"></span>Strength</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="mega-menu__col-title">By need</h4>
                    <ul class="mega-menu__list">
                      <li><a href="#" class="mega-menu__link">Skin &amp; hair</a></li>
                      <li><a href="#" class="mega-menu__link">Joints &amp; bones</a></li>
                      <li><a href="#" class="mega-menu__link">Recovery</a></li>
                      <li><a href="#" class="mega-menu__link">Focus &amp; mood</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="mega-menu__col-title">Lifestyle</h4>
                    <ul class="mega-menu__list">
                      <li><a href="#" class="mega-menu__link">Vegan</a></li>
                      <li><a href="#" class="mega-menu__link">Sugar-free</a></li>
                      <li><a href="#" class="mega-menu__link">Gluten-free</a></li>
                    </ul>
                  </div>
                  <a class="mega-menu__featured" href="index.html#wellness-test">
                    <div class="mega-menu__featured-image" aria-hidden="true">
                      <img src="https://assets.mixkit.co/videos/16084/16084-thumb-720-0.jpg" alt="" loading="lazy" />
                    </div>
                    <div class="mega-menu__featured-body">
                      <span class="mega-menu__featured-label">Personalized</span>
                      <span class="mega-menu__featured-title">Wellness Test</span>
                      <span class="mega-menu__featured-cta">Find your fit →</span>
                    </div>
                  </a>
                </div>
              </div>
            </li>

            <li class="header__nav-item" data-page="about">
              <a href="about.html" class="header__nav-link">About</a>
            </li>
          </ul>

          <a href="index.html#wellness-test" class="header__nav-cta" data-no-ripple="true">Wellness Test</a>
        </nav>
      </div>

      <div class="header__right">
        <form class="header__search" role="search" onsubmit="return false;">
          <input type="search" class="header__search-input" placeholder="Search the catalog…" aria-label="Search the catalog" />
          <button type="submit" class="header__search-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <span>Find</span>
          </button>
        </form>

        <div class="header__actions">
          <button class="header__icon-btn header__icon-btn--wishlist" id="wishlist-btn" aria-label="Favorites">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-4.5-9.5-9C1 8.5 3.5 5 7 5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.5 0 6 3.5 4.5 7-2.5 4.5-9.5 9-9.5 9z"/></svg>
            <span class="header__count header__count--wishlist" id="wishlist-count" aria-hidden="true">0</span>
          </button>
          <button class="header__icon-btn header__icon-btn--cart" id="cart-btn" aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6h15l-2 11H8L6 6z"/><path d="M6 6 5 2H2"/><circle cx="10" cy="21" r="1.5"/><circle cx="17" cy="21" r="1.5"/></svg>
            <span class="header__count" aria-hidden="true">0</span>
          </button>
        </div>
      </div>
    </div>

    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
      <div class="mobile-nav__inner">
        <form class="header__search" role="search" onsubmit="return false;" style="width: 100%; margin-bottom: var(--space-md);">
          <input type="search" class="header__search-input" placeholder="Search the catalog…" aria-label="Search the catalog" />
          <button type="submit" class="header__search-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
        </form>

        <ul class="mobile-nav__list">
          <li class="mobile-nav__group">
            <button class="mobile-nav__group-toggle" aria-expanded="false">Catalog <span>+</span></button>
            <ul class="mobile-nav__sub">
              <li><a href="shop.html">All products</a></li>
              <li><a href="shop.html?cat=sticks">Sticks</a></li>
              <li><a href="shop.html?cat=gummies">Gummies</a></li>
              <li><a href="shop.html?cat=drinks">Drinks</a></li>
              <li><a href="shop.html?cat=protein">Protein</a></li>
              <li><a href="shop.html?cat=bundles">Bundles</a></li>
              <li><a href="shop.html?cat=sale">Sale</a></li>
            </ul>
          </li>
          <li class="mobile-nav__group">
            <button class="mobile-nav__group-toggle" aria-expanded="false">States <span>+</span></button>
            <ul class="mobile-nav__sub">
              <li><a href="shop.html?state=energy">Energy</a></li>
              <li><a href="shop.html?state=sleep">Sleep</a></li>
              <li><a href="shop.html?state=relax">Relax</a></li>
              <li><a href="shop.html?state=beauty">Beauty</a></li>
              <li><a href="shop.html?state=strength">Strength</a></li>
            </ul>
          </li>
          <li><a href="about.html" class="mobile-nav__link">About</a></li>
          <li><a href="index.html#wellness-test" class="mobile-nav__link">Wellness Test</a></li>
          <li><a href="faq.html" class="mobile-nav__link">FAQ</a></li>
          <li><a href="delivery.html" class="mobile-nav__link">Shipping</a></li>
          <li><a href="bonuses.html" class="mobile-nav__link">Bonuses</a></li>
        </ul>
        <div class="mobile-nav__footer">
          <a href="#" class="btn btn--ghost btn--full">Sign in</a>
        </div>
      </div>
    </nav>
  </header>`;

  const FOOTER_HTML = `
  <footer class="footer" aria-label="Site footer">
    <div class="container">
      <div class="footer__marquee" aria-hidden="true">
        <div class="footer__marquee-track">
          <span class="footer__marquee-item">Feel your best self&nbsp;&nbsp;✦</span>
          <span class="footer__marquee-item">Wellness is a habit&nbsp;&nbsp;✦</span>
          <span class="footer__marquee-item">Feel your best self&nbsp;&nbsp;✦</span>
          <span class="footer__marquee-item">Wellness is a habit&nbsp;&nbsp;✦</span>
        </div>
      </div>
      <div class="footer__top">
        <div class="footer__brand">
          <a href="index.html" class="footer__logo">
            <span class="header__logo-mark">up</span><span class="header__logo-word">health</span>
          </a>
          <p class="footer__tagline">Functional wellness with formulas you can trust.</p>
          <div class="footer__socials">
            <a href="#" class="footer__social" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z"/></svg>
            </a>
            <a href="#" class="footer__social" aria-label="Telegram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.7 4.4 18.4 19.8c-.2.9-.7 1.1-1.5.7l-4.1-3-2 1.9c-.2.2-.4.4-.9.4l.3-4.3 7.8-7c.3-.3-.1-.4-.5-.2l-9.6 6-4.1-1.3c-.9-.3-.9-.9.2-1.3L20.3 3.4c.7-.3 1.4.2 1.4 1z"/></svg>
            </a>
            <a href="#" class="footer__social" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12a8 8 0 1 0-15.1 3.6L4 20l4.5-.9A8 8 0 0 0 20 12zm-3 2.4c-.2.5-1 1-1.5 1.1-.4.1-.9.1-1.5-.1l-1.4-.5a8.5 8.5 0 0 1-3.4-3 5.7 5.7 0 0 1-1-2.4c0-.6.2-1.1.5-1.5.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .4.3l.6 1.5c.1.2 0 .4 0 .5l-.3.4-.2.2c-.1.1-.2.2-.1.4l.6 1c.4.7 1 1.2 1.7 1.5l.4.2c.2 0 .3 0 .4-.1l.5-.6c.1-.2.3-.2.5-.1l1.4.7c.2.1.4.2.4.3v.5z"/></svg>
            </a>
          </div>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">Catalog</h4>
          <ul class="footer__list">
            <li><a href="shop.html">All products</a></li>
            <li><a href="shop.html?cat=sticks">Sticks</a></li>
            <li><a href="shop.html?cat=gummies">Gummies</a></li>
            <li><a href="shop.html?cat=drinks">Drinks</a></li>
            <li><a href="shop.html?cat=protein">Protein</a></li>
            <li><a href="shop.html?cat=bundles">Bundles</a></li>
            <li><a href="shop.html?cat=sale">Sale</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">States</h4>
          <ul class="footer__list">
            <li><a href="shop.html?state=energy">Energy</a></li>
            <li><a href="shop.html?state=sleep">Sleep</a></li>
            <li><a href="shop.html?state=relax">Relax</a></li>
            <li><a href="shop.html?state=beauty">Beauty</a></li>
            <li><a href="shop.html?state=strength">Strength</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">Company</h4>
          <ul class="footer__list">
            <li><a href="about.html">About</a></li>
            <li><a href="delivery.html">Contacts</a></li>
            <li><a href="#">Wholesale</a></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">Support</h4>
          <ul class="footer__list">
            <li><a href="delivery.html">Shipping</a></li>
            <li><a href="bonuses.html">Bonuses</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="#">Gift cards</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">© <span id="year"></span> UpHealth. All rights reserved.</p>
        <ul class="footer__legal">
          <li><a href="#">Terms of service</a></li>
          <li><a href="#">Privacy policy</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
      </div>
    </div>
  </footer>

  <aside class="cart-drawer" id="cart-drawer" aria-hidden="true" aria-label="Shopping cart">
    <div class="cart-drawer__header">
      <h3>Your cart</h3>
      <button class="cart-drawer__close" id="cart-close" aria-label="Close cart">×</button>
    </div>
    <div class="cart-drawer__body">
      <p class="cart-drawer__empty">Your cart is empty.</p>
    </div>
  </aside>

  <aside class="cart-drawer fav-drawer" id="fav-drawer" aria-hidden="true" aria-label="Favorites">
    <div class="cart-drawer__header">
      <h3>Favorites <span class="fav-drawer__count" id="fav-drawer-count"></span></h3>
      <button class="cart-drawer__close" id="fav-close" aria-label="Close favorites">×</button>
    </div>
    <div class="fav-drawer__body" id="fav-body">
      <p class="cart-drawer__empty">No favorites yet — tap the ♥ on any product.</p>
    </div>
  </aside>

  <div class="overlay" id="overlay" aria-hidden="true"></div>`;

  /* ---------- Inject ---------- */
  const headerHost = document.querySelector('[data-partial="header"]');
  const footerHost = document.querySelector('[data-partial="footer"]');

  if (headerHost) headerHost.outerHTML = HEADER_HTML;
  if (footerHost) footerHost.outerHTML = FOOTER_HTML;

  /* ---------- Highlight active nav link ---------- */
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`.header__nav-item[data-page="${page}"]`).forEach((item) => {
      const link = item.querySelector('.header__nav-link');
      if (link) link.classList.add('header__nav-link--active');
    });
  }
})();
