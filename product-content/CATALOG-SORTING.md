# UpHealth — каталог: сортировка по 6 категориям (как на витрине)

Одна категория-пилюля на товар (+ «All» автоматически). Форматные коллекции убраны.
Коллекции — **Automated**, условие: **Product tag is equal to `<tag>`**.
Источник: `products_export.csv` — 40 товаров (+2 дубля на удаление).

## Категории (6 + All)

| Пилюля | tag | handle |
|---|---|---|
| Energy & Stamina | `goal:energy` | `energy-stamina` |
| Immune Support | `goal:immune` | `immune-support` |
| Strength & Recovery | `goal:strength` | `strength-recovery` |
| Memory & Focus | `goal:focus` | `memory-focus` |
| Mood & Relaxation | `goal:mood` | `mood-relaxation` |
| Sleep & Rest | `goal:sleep` | `sleep-rest` |

---

## ⚡ Energy & Stamina (19) — `goal:energy`
- Energy Powder (Melon Creamsicle)
- Energy Powder (Fruit Punch)
- Energy Powder (Lychee Splash)
- Energy Powder (Cotton Candy)
- Energy Powder (Strawberry Shortcake)
- Energy Powder (Guava Berry)
- Hydration Powder (Lemonade)
- Hydration Powder (Lychee)
- Hydration Powder (Peach Mango)
- Hydration Powder (Passion Fruit)
- Bee Pearl
- Beetroot (caps)
- Beetroot Powder
- NMN
- CoQ10 Ubiquinone
- Shilajit Adaptogen Complex
- Fat Burner with MCT
- Keto BHB
- Vitality Mushroom Coffee

## 🛡 Immune Support (12) — `goal:immune`
- Adaptogen Immunity Drops
- Chaga Mushroom
- Colostrum Capsules
- Colostrum Powder
- Greens Superfood
- Sea Moss
- Vitamin D3 2,000 IU
- Digestive + Gut Health Strips        ← гут (нет отдельной «Gut» пилюли)
- Probiotic + Metabolism Strips        ← гут
- Ox Bile Complex                      ← гут
- L-Glutamine                          ← гут
- Vision Support                       ← глаза/антиоксиданты (натянуто, см. ниже)

## 💪 Strength & Recovery (16) — `goal:strength`
- Advanced Whey (Chocolate)
- Advanced Whey (Vanilla)
- Pure3 Whey (Chocolate)
- Creatine Monohydrate
- Creatine Hydration Powder
- BCAA Post Workout (Honeydew/Watermelon)
- BCAA Shock Powder (Fruit Punch)
- L-Citrulline & L-Arginine Stack
- Nitric Oxide
- Nitric Shock Pre-Workout (Fruit Punch)
- Recovery Cream
- Hangover Strips
- Grass-Fed Collagen Peptides (unflavoured)  ← кожа/суставы/восстановление
- Grass-Fed Collagen Peptides (Chocolate)
- Grass-Fed Collagen Creamer (Vanilla)

## 🧠 Memory & Focus (2) — `goal:focus`
- Lion's Mane Mushroom
- Mushroom Energy & Cognition Drops

## 🌿 Mood & Relaxation (1) — `goal:mood`
- Reishi Relax Gummies

## 🌙 Sleep & Rest (1) — `goal:sleep`
- Magnesium Glycinate

---

## Заметки / натяжки
- **Гут-товары** (Digestive, Probiotic, Ox Bile, L-Glutamine) кинуты в Immune Support — в 6
  пилюлях нет «Gut & Digestion». Если хочешь — добавим **7-ю «Gut & Digestion»** и вынесем их туда.
- **Vision Support** — здоровье глаз, не ложится никуда; временно в Immune (антиоксиданты).
- Тонкие категории: Memory&Focus (2), Mood (1), Sleep (1). При желании:
  Reishi можно продублировать в Sleep & Rest (есть валериана), NMN/Coffee — в Memory & Focus.
- Один товар = один тег (для чистых пилюль). Коллекции могут пересекаться, если добавить теги.

## Дубли — удалить
- `adaptogen-immunity-drops-1`, `hydration-powder-lemonade-1`

## Раскатка
1. Импорт `tags-import.csv` (Products → Import, overwrite by handle — меняется только Tags).
2. Создать 6 Automated-коллекций по таблице (Tag = …). «All» = существующая страница каталога.
3. Удалить 2 дубля.
