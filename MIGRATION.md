# Миграция: dev-store → коммерческий стор

**Почему:** поддержка Shopify письменно подтвердила (22.07.2026), что
`uphealth-nqs6iukl.myshopify.com` — dev-store «для создания и тестирования
приложений» и **не может** быть переведён на платный тариф или торговый
аккаунт. Единственный путь к запуску — новый стор + перенос.

Хорошая новость: почти всё, что мы построили, лежит в git и переносится
командами. Ручной работы — на день-два, не недели.

---

## Фаза 0 — подготовка (dev-стор не трогаем)

- [ ] Зарегистрировать новый стор **напрямую на shopify.com** под
      `hello@uphealth.life`.
      ⚠️ **НЕ через Dev Dashboard → Add dev store** — иначе получим ту же
      ловушку. Только обычная регистрация мерчанта (триал).
- [ ] Записать новый `*.myshopify.com`-адрес → обновить его в командах ниже
- [ ] В админке нового стора: Settings → Apps and sales channels →
      **Develop apps** → создать custom app, выдать Admin API scopes:
      `write_products, read_products, write_content, read_content,
      write_themes, read_themes, read_publications, write_publications` →
      скопировать Admin API access token (показывается один раз)
- [ ] **Dev-стор не удалять** до конца Фазы 7 — он эталон для сверки.
      Поддержка подтвердила (22.07.2026): dev-стор **не истекает**, спешки нет
- [ ] Страховочный экспорт из dev-стора: Products → Export → All products
      (CSV включает product-метаполя при наличии определений; цены, SKU,
      привязка картинок — пригодится для сверки после Supliful-импорта)

## Фаза 1 — тема (автоматизировано, Claude)

- [ ] `shopify theme push --store <new>.myshopify.com --path shopify-theme --unpublished --theme-editor-sync`
      из ветки `backup/shopify-theme` (546 файлов, включая
      `config/settings_data.json` — настройки секций переезжают)
- [ ] Проверить превью → опубликовать тему
- [ ] ⚠️ Медиа из **Shopify Files** в git нет — их перезалить руками
      (Content → Files) и перепривязать в theme editor, где использовались

## Фаза 2 — товары (руками, владелец)

- [ ] Подключить **Supliful** к новому стору, запустить импорт всех товаров
- [ ] Опубликовать товары в Online Store
- [ ] Сверить handle'ы со старым стором (скрипт сверки — Claude):
      метаполя цепляются по handle, расхождения чинить переименованием handle

## Фаза 3 — контент товаров (автоматизировано, Claude, по токену)

- [ ] **Сначала создать определения метаполей** (Settings → Custom data или
      API): `custom.content` (JSON), `custom.accent`/`custom.bg`/`custom.ink`
      (Color), `custom.rating`, `custom.card_badge`, `custom.card_subtitle`,
      `custom.ingredients`; на **вариантах** — `custom.pack_note`.
      Без определений метаполя не видны ни в админке, ни в CSV
- [ ] Метаполе `custom.content` из `product-content/*.json` (55 файлов,
      ветка `feature/shopify-real-product-range`) — по handle
- [ ] Цветовые метаполя `custom.accent` / `custom.bg` / `custom.ink`
- [ ] SEO: title/description товаров, alt-тексты (runbook прошлого прохода)
- [ ] Назначить шаблон `product.universal` товарам с контентом
- [ ] Варианты-паки (1/3 бутылки) — runbook Admin API мутаций;
      ⚠️ название варианта начинается с числа (см. PROJECT-GUIDE §3)
- [ ] `custom.pack_note` на вариантах — **только через API или руками**:
      variant-метаполя в CSV не переносятся (подтверждено поддержкой)

## Фаза 4 — коллекции, страницы, меню

- [ ] 10 outcome-коллекций — handle'ы в PROJECT-GUIDE §3 (Claude, API)
- [ ] Разложить товары по коллекциям (Claude, API + ручная проверка)
- [ ] Страницы: about, contact, ingredients, delivery, bonuses, faq,
      wellness-test — создать в админке, назначить шаблоны `page.*`
      (шаблоны приедут с темой в Фазе 1)
- [ ] Меню header/footer — руками: Content → Menus (в git не переносится)

## Фаза 5 — приложения (руками)

- [ ] **Shopify Subscriptions** — установить, **пересоздать selling plans**
      (Subscribe & save): настройки приложений не мигрируют
- [ ] **Search & Discovery** — фасеты Availability/Price/Type
- [ ] Отзывы (Judge.me / Loox) — если решено к запуску

## Фаза 6 — коммерция и настройки магазина

- [ ] Валюта **USD** — зафиксировать ДО первой продажи
- [ ] Shopify Payments: KYC на DCK D. GLOBAL LTD (No. 15076839) + банк.
      Запускать сразу — проверка занимает дни
- [ ] Налоги (консультация бухгалтера: UK-юрлицо, US-фулфилмент)
- [ ] Зоны/тарифы доставки = регионам Supliful
- [ ] Policies: refund, privacy, terms, shipping
- [ ] Email-уведомления, GA4/пиксели

## Фаза 7 — переключение

- [ ] Сквозной чек-лист сверки нового стора против dev (ниже)
- [ ] Тестовый чекаут: test mode → реальный заказ на свою карту → refund →
      заказ дошёл до Supliful
- [ ] Домен: на dev-сторе Settings → Domains → **удалить** `uphealth.life`
      → на новом сторе подключить → назначить primary (SSL ~1 час)
- [ ] Снять пароль витрины (Online Store → Preferences)
- [ ] Search Console: подтвердить домен заново, отправить sitemap
- [ ] Dev-стор держать ещё ~2 недели как референс, потом удалять

## Чек-лист сверки (Фаза 7, старый ↔ новый)

- [ ] Главная: все 13 секций, hero-слайдер, медиа не битые
- [ ] Каталог: 10 пилюль outcome работают, карточки с hover-картинками
- [ ] Товар с JSON-контентом: цвета, график, facts, FAQ (выборочно 5 шт.)
- [ ] Товар без JSON: дефолтный шаблон рендерится
- [ ] Buy-box: паки, цена за штуку, подписка
- [ ] Корзина-drawer, избранное, поиск, 404
- [ ] Все 7 инфо-страниц открываются с нужными шаблонами
- [ ] Аккаунт-флоу (login/register) — требует Classic customer accounts
- [ ] JSON-LD Product/Organization в исходнике страниц
- [ ] Мобильная вёрстка выборочно

---

**Разделение работ:** фазы 1, 3, 4(API) — Claude по Admin API токену;
фазы 0, 2, 5, 6, 7 — владелец/разработчик в админке. Порядок фаз 2→3
обязателен: метаполя ложатся на товары, созданные Supliful-импортом.
