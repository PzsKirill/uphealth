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

  /* Inline state icons — stroke uses currentColor so the colour is driven by CSS
     (#74548e default / #fefcf9 when the pill or tab is active). */
  const STATE_ICONS = {
    energy:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 5 13h6l-1 9 8-12h-6l1-8z"/></svg>',
    sleep:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    relax:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c10 2 16-4 16-15-9 0-16 4-16 13z"/><path d="M4 20c2-5 5-8 9-10.5"/></svg>',
    beauty:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.6 4.2 1.8 5.4 6 6-4.2.6-5.4 1.8-6 6-.6-4.2-1.8-5.4-6-6 4.2-.6 5.4-1.8 6-6z"/></svg>',
    strength: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    all:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
  };

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
              <div class="mega-menu mega-menu--catalog" id="menu-catalog" role="region" aria-label="Product catalog">
                <div class="mega-menu__inner mega-menu__inner--catalog">

                  <div class="mega-cat">
                    <a href="shop.html" class="mega-cat__title">All products <span class="mega-cat__title-arrow" aria-hidden="true">→</span></a>
                    <ul class="mega-cat__links">
                      <li><a href="shop.html?cat=sticks"  class="mega-cat__link">Sticks</a></li>
                      <li><a href="shop.html?cat=drinks"  class="mega-cat__link">Drinks</a></li>
                      <li><a href="shop.html?cat=gummies" class="mega-cat__link">Gummies</a></li>
                      <li><a href="shop.html?cat=protein" class="mega-cat__link">Protein</a></li>
                      <li><a href="shop.html?cat=sale"    class="mega-cat__link">Sale</a></li>
                      <li><a href="shop.html?cat=bundles" class="mega-cat__link">Bundles</a></li>
                      <li><a href="shop.html?cat=gift"    class="mega-cat__link">Gift cards</a></li>
                    </ul>
                  </div>

                  <div class="mega-cards">
                    <a class="mega-card" href="product.html">
                      <span class="mega-card__media">
                        <img src="assets/image/png/photo_2026-06-01_10-27-57.jpg" alt="" loading="lazy" />
                      </span>
                      <span class="mega-card__foot">
                        <span class="mega-card__label">Vanilla Whey Protein</span>
                        <span class="mega-card__arrow" aria-hidden="true">→</span>
                      </span>
                    </a>
                    <a class="mega-card mega-card--gift" href="shop.html?cat=gift">
                      <span class="mega-card__media mega-card__media--gift" aria-hidden="true">
                        <span class="gift-art">
                          <span class="gift-art__card gift-art__card--back"></span>
                          <span class="gift-art__card gift-art__card--front">up·health</span>
                        </span>
                      </span>
                      <span class="mega-card__foot">
                        <span class="mega-card__label">Gift cards</span>
                        <span class="mega-card__arrow" aria-hidden="true">→</span>
                      </span>
                    </a>
                  </div>

                </div>
              </div>
            </li>

            <li class="header__nav-item header__nav-item--has-menu" data-menu="states">
              <button class="header__nav-link header__nav-link--button" aria-expanded="false" aria-controls="menu-states">
                States <span class="header__nav-caret">▾</span>
              </button>
              <div class="mega-menu mega-menu--states" id="menu-states" role="region" aria-label="Wellness states">
                <div class="mega-menu__inner mega-menu__inner--states">
                  <div class="mega-states">
                    <span class="mega-states__eyebrow">Pick an outcome</span>
                    <div class="state-pills">
                      <a class="state-pill" data-state="energy" href="shop.html?state=energy">
                        <span class="state-pill__icon">${STATE_ICONS.energy}</span>Energy
                      </a>
                      <a class="state-pill" data-state="sleep" href="shop.html?state=sleep">
                        <span class="state-pill__icon">${STATE_ICONS.sleep}</span>Sleep
                      </a>
                      <a class="state-pill" data-state="relax" href="shop.html?state=relax">
                        <span class="state-pill__icon">${STATE_ICONS.relax}</span>Relax
                      </a>
                      <a class="state-pill" data-state="beauty" href="shop.html?state=beauty">
                        <span class="state-pill__icon">${STATE_ICONS.beauty}</span>Beauty
                      </a>
                      <a class="state-pill" data-state="strength" href="shop.html?state=strength">
                        <span class="state-pill__icon">${STATE_ICONS.strength}</span>Strength
                      </a>
                    </div>
                    <p class="mega-states__hint">Not sure where to start? <a href="index.html#wellness-test">Take the wellness test →</a></p>
                  </div>
                </div>
              </div>
            </li>

            <li class="header__nav-item header__nav-item--has-menu" data-menu="about" data-page="about">
              <button class="header__nav-link header__nav-link--button" aria-expanded="false" aria-controls="menu-about">
                About <span class="header__nav-caret">▾</span>
              </button>
              <div class="mega-menu mega-menu--about" id="menu-about" role="region" aria-label="About UpHealth">
                <div class="mega-menu__inner mega-menu__inner--about">

                  <div class="mega-about__col">
                    <h4 class="mega-menu__col-title">Company</h4>
                    <ul class="mega-menu__list">
                      <li><a href="about.html"   class="mega-menu__link">About us</a></li>
                      <li><a href="#"            class="mega-menu__link">Wholesale</a></li>
                      <li><a href="bonuses.html" class="mega-menu__link">Bonuses</a></li>
                      <li><a href="#"            class="mega-menu__link">Vacancies</a></li>
                    </ul>
                  </div>

                  <div class="mega-about__col">
                    <h4 class="mega-menu__col-title">Help</h4>
                    <ul class="mega-menu__list">
                      <li><a href="delivery.html" class="mega-menu__link">Contacts</a></li>
                      <li><a href="faq.html"      class="mega-menu__link">FAQ</a></li>
                      <li><a href="delivery.html" class="mega-menu__link">Shipping &amp; returns</a></li>
                      <li><a href="bonuses.html"  class="mega-menu__link">Loyalty program</a></li>
                    </ul>
                  </div>

                  <div class="mega-about__contacts">
                    <h4 class="mega-menu__col-title">Talk to us</h4>
                    <ul class="mega-contacts">
                      <li class="mega-contact">
                        <span class="mega-contact__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h3l2 5-2 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A14 14 0 0 1 4 5a2 2 0 0 1 2-2z"/></svg></span>
                        <span class="mega-contact__text">
                          <span class="mega-contact__region">United States</span>
                          <a href="tel:+18885550142" class="mega-contact__value">+1 (888) 555-0142</a>
                        </span>
                      </li>
                      <li class="mega-contact">
                        <span class="mega-contact__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h3l2 5-2 1.5a11 11 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2 2A14 14 0 0 1 4 5a2 2 0 0 1 2-2z"/></svg></span>
                        <span class="mega-contact__text">
                          <span class="mega-contact__region">Europe</span>
                          <a href="tel:+442079460123" class="mega-contact__value">+44 20 7946 0123</a>
                        </span>
                      </li>
                      <li class="mega-contact">
                        <span class="mega-contact__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span>
                        <span class="mega-contact__text">
                          <span class="mega-contact__region">Email</span>
                          <a href="mailto:care@uphealth.com" class="mega-contact__value">care@uphealth.com</a>
                        </span>
                      </li>
                    </ul>
                    <div class="mega-social">
                      <a href="https://wa.me/18885550142" class="mega-social__btn" aria-label="WhatsApp">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12a8 8 0 1 0-15.1 3.6L4 20l4.5-.9A8 8 0 0 0 20 12zm-3 2.4c-.2.5-1 1-1.5 1.1-.4.1-.9.1-1.5-.1l-1.4-.5a8.5 8.5 0 0 1-3.4-3 5.7 5.7 0 0 1-1-2.4c0-.6.2-1.1.5-1.5.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .4.3l.6 1.5c.1.2 0 .4 0 .5l-.3.4-.2.2c-.1.1-.2.2-.1.4l.6 1c.4.7 1 1.2 1.7 1.5l.4.2c.2 0 .3 0 .4-.1l.5-.6c.1-.2.3-.2.5-.1l1.4.7c.2.1.4.2.4.3v.5z"/></svg>
                      </a>
                      <a href="#" class="mega-social__btn" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>
                      </a>
                      <a href="#" class="mega-social__btn" aria-label="YouTube">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z"/></svg>
                      </a>
                    </div>
                  </div>

                  <a class="mega-menu__featured mega-about__featured" href="about.html">
                    <div class="mega-menu__featured-image" aria-hidden="true">
                      <img src="assets/image/personal/image.png" alt="" loading="lazy" />
                    </div>
                    <div class="mega-menu__featured-body">
                      <span class="mega-menu__featured-label">Our story</span>
                      <span class="mega-menu__featured-title">Science you can trust</span>
                      <span class="mega-menu__featured-cta">Read more →</span>
                    </div>
                  </a>

                </div>
              </div>
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
          <li class="mobile-nav__group">
            <button class="mobile-nav__group-toggle" aria-expanded="false">About <span>+</span></button>
            <ul class="mobile-nav__sub">
              <li><a href="about.html">About us</a></li>
              <li><a href="#">Wholesale</a></li>
              <li><a href="bonuses.html">Bonuses</a></li>
              <li><a href="#">Vacancies</a></li>
              <li><a href="delivery.html">Contacts</a></li>
              <li><a href="faq.html">FAQ</a></li>
            </ul>
          </li>
          <li><a href="index.html#wellness-test" class="mobile-nav__link">Wellness Test</a></li>
          <li><a href="delivery.html" class="mobile-nav__link">Shipping</a></li>
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
      <h3>Your cart <span class="cart-drawer__count" id="cart-drawer-count"></span></h3>
      <button class="cart-drawer__close" id="cart-close" aria-label="Close cart">×</button>
    </div>
    <div class="cart-drawer__body" id="cart-body">
      <p class="cart-drawer__empty">Your cart is empty.</p>
    </div>
    <div class="cart-drawer__foot" id="cart-foot" hidden>
      <form class="cart-promo" id="cart-promo">
        <label class="cart-promo__label" for="cart-code">Have a gift card or promo code?</label>
        <div class="cart-promo__row">
          <input type="text" id="cart-code" class="cart-promo__input" placeholder="e.g. GIFT100" autocomplete="off" spellcheck="false" />
          <button type="submit" class="cart-promo__apply">Apply</button>
        </div>
        <p class="cart-promo__msg" id="cart-promo-msg" role="status" aria-live="polite"></p>
      </form>
      <div class="cart-totals">
        <div class="cart-totals__row"><span>Subtotal</span><span id="cart-subtotal">$0</span></div>
        <div class="cart-totals__row cart-totals__row--discount" id="cart-discount-row" hidden>
          <span id="cart-discount-label">Discount</span><span id="cart-discount">-$0</span>
        </div>
        <div class="cart-totals__row cart-totals__row--total"><span>Total</span><span id="cart-total">$0</span></div>
      </div>
      <button class="btn btn--primary btn--full" id="cart-checkout">Checkout</button>
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
