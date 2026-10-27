---
name: "Sistem Manajemen Armada"
description: "A navy masthead, a white enamel card, and a route circle large enough to read while walking."
colors:
  desk-navy: "#06367c"
  ground-blue: "#0846a1"
  mark-blue: "#174da1"
  band-pale: "#ebf3f9"
  row-wash: "#cde6fd"
  rule-gray: "#cdd6e4"
  ledger-gray: "#5b5b5b"
  arrive-green: "#35a344"
  sheet: "#ffffff"
typography:
  display:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  title:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  body:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  emphasis:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: "normal"
  label:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "normal"
rounded:
  control: "4px"
  surface: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  page: "32px"
components:
  button-mark:
    backgroundColor: "{colors.mark-blue}"
    textColor: "{colors.sheet}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-ground:
    backgroundColor: "{colors.ground-blue}"
    textColor: "{colors.sheet}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-desk:
    backgroundColor: "{colors.desk-navy}"
    textColor: "{colors.sheet}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-quiet:
    backgroundColor: "{colors.band-pale}"
    textColor: "{colors.desk-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-disabled:
    backgroundColor: "{colors.rule-gray}"
    textColor: "{colors.ledger-gray}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.desk-navy}"
    typography: "{typography.emphasis}"
    rounded: "{rounded.control}"
    padding: "0"
  field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.desk-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  field-disabled:
    backgroundColor: "{colors.band-pale}"
    textColor: "{colors.ledger-gray}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  chip-transit:
    backgroundColor: "{colors.mark-blue}"
    textColor: "{colors.sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  chip-stopped:
    backgroundColor: "{colors.ledger-gray}"
    textColor: "{colors.sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  chip-incoming:
    backgroundColor: "{colors.arrive-green}"
    textColor: "{colors.sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  chip-unknown:
    backgroundColor: "{colors.desk-navy}"
    textColor: "{colors.sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  card:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.desk-navy}"
    rounded: "{rounded.surface}"
    padding: "16px"
  band:
    backgroundColor: "{colors.band-pale}"
    textColor: "{colors.desk-navy}"
    rounded: "{rounded.surface}"
    padding: "16px"
  row-active:
    backgroundColor: "{colors.row-wash}"
    textColor: "{colors.desk-navy}"
    typography: "{typography.body}"
    padding: "8px 12px"
  masthead:
    backgroundColor: "{colors.desk-navy}"
    textColor: "{colors.sheet}"
    typography: "{typography.title}"
    padding: "16px"
  footer:
    backgroundColor: "{colors.ground-blue}"
    textColor: "{colors.sheet}"
    typography: "{typography.body}"
    padding: "16px"
  dialog:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.desk-navy}"
    rounded: "{rounded.surface}"
    padding: "16px 20px"
---

# Design System: Sistem Manajemen Armada

## Overview

**Creative North Star: "Koridor Blade"**

The board is a corridor blade. A Desk Navy masthead stays pinned to the top, a white enamel card carries the vehicle, and the route circle is large enough to read while walking. The voice is calm and institutional: PT Sans at two weights, short Mark Blue bars, and pale bands, so the number and the route can be read without decoration.

Density stays even. The page title is large, with a short bar under it and no eyebrow above it. Filters sit in a pale band. Vehicles are a grid of flat white cards. The vehicle number, the status, and the time do the talking. Route color is API data. It paints the route circle and the map line, and the pin on that line uses the same color. The fallback is Mark Blue.

Confirmed rejections are the TransJakarta logo, its homepage, and its marketing layout, along with gradients, illustration, and a hero.

**Key Characteristics:**

- Calm and institutional
- Flat bands of color, with one menu shadow
- PT Sans at 400 and 700 only
- A short Mark Blue bar as the only ornament
- A 56px route circle on the card and in the dialog
- Route color on the circle, the map line, and the pin
- Restrained, readable controls

## Colors

Three close blues build the blade, pale blues structure the sheet, and one green means a vehicle is about to arrive.

### Primary

- **Desk Navy** (#06367c): The masthead, the ink on the sheet, the current page number, the dialog's Tutup button, and the map's Ikuti kendaraan button. Body copy on the white sheet is this color. The text caret is this color.
- **Mark Blue** (#174da1): The short bar under the page title, the 4px strip on every vehicle card and on the map frame, the top rule of the pager, paging buttons, the in-transit status, a checked box, and the closed-menu caret. The scrollbar thumb is this color. This is the mark that says "here."

### Secondary

- **Ground Blue** (#0846a1): The page background, the footer, the Muat ulang button, and the keyboard focus outline.

### Tertiary

- **Arrive Green** (#35a344): The incoming status pill only. It is not a success color for buttons or empty states.

### Neutral

- **Sheet** (#ffffff): The working surface, cards, fields, the dialog, the menu panel, and the type on a colored control. Masthead and footer subtitles use Sheet at 80% opacity.
- **Band Pale** (#ebf3f9): The filter band, empty and error panels, a disabled field, an idle page number, and the scrollbar track.
- **Row Wash** (#cde6fd): The menu row under the pointer or the keyboard cursor, and the text selection.
- **Rule Gray** (#cdd6e4): Hairline borders, and the fill of a disabled button.
- **Ledger Gray** (#5b5b5b): Secondary text, the stopped status, and disabled button text.

### Named Rules

**The Route Color Rule.** A route's color comes from the API. It paints the route circle and the map line, and the pin uses that same color. It does not paint the shell. When the API sends no color, the fallback is Mark Blue.

**The One Mark Rule.** Mark Blue is the bar, the in-transit chip, and the paging controls. It does not become a second page background.

## Typography

**Display Font:** PT Sans (with ui-sans-serif, system-ui, sans-serif), for the page title only
**Body Font:** PT Sans (with ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** PT Sans. There is no monospace role.

**Character:** One humanist sans, loaded only at 400 and 700. Weight does the hierarchy. Numerals are tabular across the page. The face stays plain, which suits a calm institutional board.

### Hierarchy

- **Display** (700, 2.5rem, line-height 1): The page title, "Kendaraan". Nothing sits above it. A 4px by 48px Mark Blue rule sits 8px below it.
- **Headline** (700, 2.25rem, line-height 1): The vehicle number on a card and in the dialog. Nothing sits above it.
- **Title** (700, 1.625rem, line-height 1): The masthead name.
- **Body** (400, 0.875rem, line-height 1.43): Filters, coordinates, buttons, the footer, and the refresh line. The same size at 700 is a field label, a menu name, a text button, and the map heading. A sentence with no size class inherits 1rem and line-height 1.5.
- **Label** (700, 0.75rem, line-height 1.333): The status word, the menu route circle, and a menu description's size. A secondary line at this size, including the raw status code and the follow button, uses weight 400.

### Named Rules

**The One Face Rule.** PT Sans only, at 400 and 700. No second family, and no italic, on the board.

**The No Eyebrow Rule.** The page title, the vehicle number, and the dialog title stand alone. No small uppercase line sits above them.

**The Label and the Code Rule.** A status pill shows the Indonesian word in 700 and the raw API code beside it at 400 and 80% opacity. The code stays visible.

## Layout

The page is a column: sticky masthead, white sheet, Ground Blue footer. The sheet is centered at a maximum of 72rem. Side padding is 16px, and 32px from 640px upward. The sheet's block starts 28px below the masthead. Sections inside the sheet stack with 24px between them. The page title sits 8px above a mark that is 4px tall and 48px wide.

Filters live in one Band Pale panel with 16px of padding. The two fields stack, then sit side by side from 640px with 16px between them. Vehicle cards are one column, two from 640px, and three from 1024px, with 16px gutters.

The dialog is centered, `min(40rem, 100vw - 2rem)` wide, and at most `min(90vh, 48rem)` tall. At 640px and below it fills the viewport and its corners become square. The map inside it is 16rem tall.

### Named Rules

**The Sheet Rule.** The work sits on Sheet. Ground Blue is the page background and the footer. The filter band is Band Pale on the sheet.

## Elevation & Depth

Depth is a change of color. The masthead is Desk Navy, the sheet is white, the filter band is Band Pale, and the footer is Ground Blue. Cards, buttons, the map, and the dialog have no shadow. The dialog separates from the board with a scrim of Desk Navy at 48% opacity: `rgb(6 54 124 / 48%)`.

### Shadow Vocabulary

- **Menu overlay** (`box-shadow: 0 5px 6px rgba(0, 0, 0, 0.25)`): The open route or trip menu only, so the list reads above the sheet.

### Named Rules

**The Flat Band Rule.** A resting surface does not lift. A card does not gain a shadow on hover, and the board does not fade while a refresh is in flight.

**The Overlay Rule.** The menu shadow is an overlay, not a material. It is not reused on cards, buttons, the map, or the dialog.

## Shapes

Controls that are operated — buttons, fields, checked boxes — use a 4px radius. Surfaces that are read — cards, the filter band, empty and error panels, the dialog, and the map — use a 16px radius. A pill is reserved for a status. A circle is reserved for a route mark: 56px on a card and in the dialog, 40px in the menu. The dialog drops to a square corner at 640px and below. The page-title mark is a 4px by 48px rectangle. Each card and the map frame carry a full-bleed 4px strip of Mark Blue.

### Named Rules

**The Two Radius Rule.** 4px for a control, 16px for a surface, a pill only for a status, and a circle only for a route mark.

## Components

Controls are restrained and readable. An action is a flat, slightly rounded rectangle. A card is a white enamel sheet with a short bar and a walking-scale route circle. A field is white with a hairline. Hover does not recolor a button.

### Buttons

- **Shape:** 4px radius. Padding is 8px 12px. Type is body size. Hover does not change the fill.
- **Mark:** Mark Blue fill, Sheet text. Paging controls, and Coba lagi on the board or in the dialog.
- **Ground:** Ground Blue fill, Sheet text. Muat ulang.
- **Desk:** Desk Navy fill, Sheet text. Tutup and the current page number.
- **Quiet:** Band Pale fill, Desk Navy text, at least 40px wide. An idle page number.
- **Text:** Transparent, Desk Navy, weight 700. Underline when it retries a failed count or a failed menu. Hapus pilihan is the same weight without an underline.
- **Follow:** Desk Navy fill, Sheet text, label size at weight 400, padding 4px 8px. It appears on the map after a drag.
- **Disabled:** Rule Gray fill, Ledger Gray text.
- **Focus:** A 2px Ground Blue outline, 2px outside the control, on buttons, fields, and selects.

### Chips

- **Style:** A pill with 4px 10px padding and 8px between the word and the code. The Indonesian label is 700. The raw code is 400 at 80% opacity.
- **State:** In transit is Mark Blue. Stopped is Ledger Gray. Incoming is Arrive Green. An unrecognized code uses Desk Navy. Text on every chip is Sheet.

### Cards / Containers

- **Corner Style:** 16px.
- **Background:** Sheet, with a full-bleed 4px Mark Blue strip along the top.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** 1px Rule Gray.
- **Internal Padding:** 16px, with 12px between the number, the chip, the coordinates, and the time.
- **Behavior:** The whole card is the control that opens the dialog. The vehicle number is headline size. The route circle sits at the top right, 56px across, with the route's text color. There is no line above the number.

### Inputs / Fields

- **Style:** White fill, 1px Rule Gray border, 4px radius, 8px 12px padding, Desk Navy text. The label above the field is body size at weight 700. A closed menu shows a Mark Blue caret.
- **Search and page size:** The same hairline, with tighter padding of 6px 8px.
- **Focus:** The shared 2px Ground Blue outline.
- **Disabled:** Band Pale fill, Ledger Gray text. The trip field states why it is closed, at label size and weight 400, under the control.
- **Menu:** A Sheet panel, 1px Rule Gray border, 4px radius, at least 16rem wide, with the menu-overlay shadow. The list scrolls inside 18rem. The active row is Row Wash. A checked box is 20px, 4px radius, Mark Blue with a Sheet check. An unchecked box is Sheet with a Rule Gray border. A route option shows a 40px circle in the route color.

### Navigation

- **Masthead:** Sticky Desk Navy. The product name is title size, in Sheet, with line-height 1. The subtitle is body size at 80% Sheet. Padding is 16px, and side padding is 32px from 640px. The two lines stack with 4px between them, then sit on one row from 640px.
- **Footer:** Ground Blue, body size, 16px of padding, and the same side padding as the masthead. The author and product name are Sheet. The source line is Sheet at 80%. From 640px the two lines sit on one row, at the two ends.

### Dialog

- **Shape:** 16px radius, no border, Sheet fill, Desk Navy text. Square and full-viewport at 640px and below.
- **Header:** A 4px Mark Blue rule along the bottom, 16px vertical and 20px horizontal padding. The route circle at 56px, then the vehicle number at headline size, then Tutup. No eyebrow above the number.
- **Body:** 16px vertical and 20px horizontal padding. Each fact is a row with a Rule Gray bottom border and 8px of vertical padding. The name is label size at weight 700 in Ledger Gray. The value is body size.
- **Scrim:** Desk Navy at 48% opacity. Clicking the scrim closes the dialog.

### Map

- **Frame:** 16rem tall, 16px radius, 1px Rule Gray border, and the same full-bleed 4px Mark Blue strip as a card.
- **Route:** A Sheet casing 8px wide at 95% opacity, then the route color at 4.5px, with round caps and joins.
- **Pin:** A 28px mark. A triangular nose and a circle, filled with the route color and stroked in Sheet. The map pin eases along the trip shape with smoothstep and then waits.
- **Follow:** After a drag, Ikuti kendaraan appears 8px from the bottom left. It recenters once. The camera does not chase the pin on every frame.

### Route mark

- **Card and dialog:** 56px circle, body size, weight 700, up to three characters. Fill and text color come from the route.
- **Menu:** 40px circle, label size, weight 700, the same route colors.
- **Fallback:** Mark Blue fill and Sheet text when the API sends no color.

## Do's and Don'ts

### Do:

- **Do** keep the page ground Ground Blue and the working surface Sheet.
- **Do** mark the page title with a 4px by 48px Mark Blue bar, and each card and the map frame with a full-bleed 4px strip of the same color.
- **Do** keep a card flat: 16px radius, a 1px Rule Gray border, 16px of padding, and no shadow.
- **Do** set the route circle to 56px on a card and in the dialog, and to 40px in the menu.
- **Do** show keyboard focus as a 2px Ground Blue outline, 2px outside the control.
- **Do** show a status as a pill: the Indonesian word at 700, the raw code at 400 and 80% opacity.
- **Do** paint the route circle and the map line with the API route color, fall back to Mark Blue when that color is missing, and use that same color on the pin.

### Don't:

- **Don't** copy the TransJakarta logo, homepage, or marketing layout.
- **Don't** add a hero, a gradient, an illustration, or a second typeface.
- **Don't** put an uppercase eyebrow above the page title, the vehicle number, or the dialog title.
- **Don't** put a shadow on a card, a button, the map, or the dialog.
- **Don't** recolor a button on hover.
- **Don't** fade the vehicle cards while a refresh is in flight.
- **Don't** use a route's API color for the masthead, the footer, a button, a card, or the page background.
- **Don't** round the dialog at 640px and below. At that width it is a square, full-viewport sheet.
