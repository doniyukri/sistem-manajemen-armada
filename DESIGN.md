---
name: "Sistem Manajemen Armada"
description: "A calm dispatch desk for a live fleet board."
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
  headline:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "normal"
  body:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "normal"
  label:
    fontFamily: "PT Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "0.025em"
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
    typography: "{typography.body}"
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
    padding: "12px 16px"
  footer:
    backgroundColor: "{colors.ground-blue}"
    textColor: "{colors.sheet}"
    typography: "{typography.body}"
    padding: "16px"
---

# Design System: Sistem Manajemen Armada

## Overview

**Creative North Star: "The Dispatch Desk"**

The board is a desk. A Desk Navy band stays pinned to the top, a white sheet holds the work, and a Ground Blue footer closes the page. The voice is calm and institutional: bold PT Sans, short blue bars, and pale bands, the way a public-service counter stays quiet so the record can be read.

Density stays even. The page title is large and is followed by one short mark. Filters sit in a pale band. Vehicles are a grid of white cards. The vehicle label, the status, and the time do the talking. Route color is allowed where it identifies a route: the round badge, and the line on the map.

The public TransJakarta site supplies this shell: the navy, the blue ground, PT Sans, and the short bar. Confirmed rejections are its logo, its homepage, and its marketing layout, along with gradients, illustration, and a hero.

**Key Characteristics:**

- Calm and institutional
- Flat bands of color, with one menu shadow
- One typeface, in two weights
- A short Mark Blue bar as the only ornament
- Route color confined to the badge and the map
- Restrained, readable controls

## Colors

Three close blues build the desk, pale blues structure the sheet, and one green means a vehicle is about to arrive.

### Primary

- **Desk Navy** (#06367c): The masthead, the ink on the sheet, the current page number, the dialog's Tutup button, and the map's Ikuti kendaraan button. Body copy on the white sheet is this color.
- **Mark Blue** (#174da1): The short bar under the page title, the 4px strip on every vehicle card, the top rule of the pager, paging buttons, the in-transit status, and a checked box. This is the mark that says "here."

### Secondary

- **Ground Blue** (#0846a1): The page behind the sheet, the footer, the Muat ulang button, and the keyboard focus outline.

### Tertiary

- **Arrive Green** (#35a344): The incoming status pill only. It is not a success color for buttons or empty states.

### Neutral

- **Sheet** (#ffffff): The working surface, cards, fields, the dialog, and the menu panel.
- **Band Pale** (#ebf3f9): The filter band, empty and error panels, a disabled field, and an idle page number.
- **Row Wash** (#cde6fd): The menu row under the pointer or the keyboard cursor.
- **Rule Gray** (#cdd6e4): Hairline borders, and the fill of a disabled button.
- **Ledger Gray** (#5b5b5b): Secondary text, field labels, the stopped status, and disabled button text. The masthead and footer subtitles use Sheet at 80% opacity instead of this gray.

### Named Rules

**The Route Color Rule.** A route's color comes from the API. It paints the round badge and the map line, and nothing else in the shell. When the API sends no color, the fallback is Mark Blue.

**The One Mark Rule.** Mark Blue is the bar, the moving-vehicle chip, and the paging controls. It does not become a second page background.

## Typography

**Display Font:** None. The page has no display size.
**Body Font:** PT Sans (with ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** PT Sans. There is no monospace role.

**Character:** One humanist sans, loaded only at 400 and 700. Weight does the hierarchy. The face stays plain, which suits an Indonesian public-service desk.

### Hierarchy

- **Headline** (700, 1.875rem, line-height 1.2): The page title. The masthead name uses the same face at 1.125rem and 700. That size is the masthead, not a second type role.
- **Title** (700, 1.5rem, line-height 1.333): The vehicle label on a card and in the dialog.
- **Body** (400, 0.875rem, line-height 1.43): Filters, coordinates, buttons, the footer, and the refresh line. A sentence that stands alone, such as an empty state or an error, uses the same face at 1rem.
- **Label** (700, 0.75rem, line-height 1.333, letter-spacing 0.025em, uppercase): Eyebrows and dialog field names, set in Ledger Gray.

### Named Rules

**The One Face Rule.** PT Sans only, at 400 and 700. No second family, and no italic, on the board.

**The Label and the Code Rule.** A status pill shows the Indonesian word in 700 and the raw API code beside it at 400 and 80% opacity. The code stays visible.

## Layout

The page is a column: sticky masthead, white sheet, Ground Blue footer. The sheet is centered at a maximum of 72rem, with 16px of side padding, and 24px from 640px upward. Sections inside the sheet stack with 24px between them. The page title sits above a mark that is 4px tall and 48px wide.

Filters live in one Band Pale panel. The two fields stack, then sit side by side from 640px with 16px between them. Vehicle cards are one column, two from 640px, and three from 1024px, with 16px gutters.

The dialog is centered, `min(40rem, 100vw - 2rem)` wide, and at most `min(90vh, 48rem)` tall. At 640px and below it fills the viewport and its corners become square. The map inside it is 16rem tall.

### Named Rules

**The Sheet Rule.** The work sits on Sheet. Ground Blue is the page behind that sheet and the footer. The filter band is Band Pale on the sheet.

## Elevation & Depth

Depth is a change of color. The masthead is Desk Navy, the sheet is white, the filter band is Band Pale, and the footer is Ground Blue. Cards, buttons, and the dialog have no shadow. The dialog separates from the desk with a scrim of Desk Navy at 48% opacity: `rgb(6 54 124 / 48%)`.

### Shadow Vocabulary

- **Menu overlay** (`box-shadow: 0 5px 6px rgba(0, 0, 0, 0.25)`): The open route or trip menu only, so the list reads above the sheet.

### Named Rules

**The Flat Band Rule.** A resting surface does not lift. A card does not gain a shadow on hover, and the board does not fade while a refresh is in flight.

**The Overlay Rule.** The menu shadow is an overlay, not a material. It is not reused on cards, buttons, or the dialog.

## Shapes

Controls that are operated — buttons, fields, checked boxes — use a 4px radius. Surfaces that are read — cards, the filter band, empty and error panels, the dialog, and the map — use a 16px radius. A pill is reserved for a status, and a circle for a route badge. The dialog drops to a square corner at 640px and below. The page-title mark is a 4px by 48px rectangle. Each card carries a full-bleed 4px strip of the same Mark Blue.

### Named Rules

**The Two Radius Rule.** 4px for a control, 16px for a surface, a circle only for a status or a route badge.

## Components

Controls are restrained and readable. An action is a flat, slightly rounded rectangle. A card is a white sheet with a short bar. A field is white with a hairline. A pill is only a status or a route badge.

### Buttons

- **Shape:** 4px radius. Padding is 8px 12px. Type is body size. Hover does not change the fill.
- **Mark:** Mark Blue fill, Sheet text. Paging controls, and Coba lagi on the board or in the dialog.
- **Ground:** Ground Blue fill, Sheet text. Muat ulang.
- **Desk:** Desk Navy fill, Sheet text. Tutup, the current page number, and Ikuti kendaraan. The follow button uses label size and 4px 8px padding.
- **Quiet:** Band Pale fill, Desk Navy text, at least 40px wide. An idle page number.
- **Text:** Transparent, Desk Navy, weight 700. Underline when it retries a failed count or a failed menu. Hapus pilihan is the same weight without an underline.
- **Disabled:** Rule Gray fill, Ledger Gray text.
- **Focus:** A 2px Ground Blue outline, 2px outside the control, on buttons, fields, and selects.

### Chips

- **Style:** A pill with 4px 10px padding. The Indonesian label is 700. The raw code is 400 at 80% opacity.
- **State:** In transit is Mark Blue. Stopped is Ledger Gray. Incoming is Arrive Green. An unrecognized code uses Desk Navy. Text on every chip is Sheet.

### Cards / Containers

- **Corner Style:** 16px.
- **Background:** Sheet, with a full-bleed 4px Mark Blue strip along the top.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** 1px Rule Gray.
- **Internal Padding:** 16px, with 12px between the label, the chip, the coordinates, and the time.
- **Behavior:** The whole card is the control that opens the dialog. The route badge sits at the top right, 44px across.

### Inputs / Fields

- **Style:** White fill, 1px Rule Gray border, 4px radius, 8px 12px padding, Desk Navy text. The label above the field is body size at weight 700. A closed menu shows a Mark Blue caret.
- **Search and page size:** The same hairline, with tighter padding of 6px 8px.
- **Focus:** The shared 2px Ground Blue outline.
- **Disabled:** Band Pale fill, Ledger Gray text. The trip field states why it is closed, in label size, under the control.
- **Menu:** A Sheet panel, 1px Rule Gray border, 4px radius, at least 16rem wide. The list scrolls inside 18rem. The active row is Row Wash. A checked box is 20px, 4px radius, Mark Blue with a Sheet check. An unchecked box is Sheet with a Rule Gray border.

### Navigation

- **Masthead:** Sticky Desk Navy. The product name is 1.125rem and 700, in Sheet. The subtitle is body size at 80% Sheet. Side padding matches the sheet: 16px, then 24px from 640px. Vertical padding is 12px.
- **Footer:** Ground Blue, body size. The author and product name are Sheet. The source line is Sheet at 80%. From 640px the two lines sit on one row, at the two ends.

### Dialog

- **Shape:** 16px radius, no border, Sheet fill, Desk Navy text. Square and full-viewport at 640px and below.
- **Header:** A 4px Mark Blue rule along the bottom, 16px vertical and 20px horizontal padding. Eyebrow, then the vehicle label at title size, then Tutup.
- **Body:** 16px vertical and 20px horizontal padding. Each fact is a row with a Rule Gray bottom border and 8px of vertical padding. The label is the uppercase eyebrow. The value is body size.
- **Scrim:** Desk Navy at 48% opacity. Clicking the scrim closes the dialog.

### Map

- **Frame:** 16rem tall, 16px radius, 1px Rule Gray border.
- **Route:** A Sheet casing 8px wide, then the route color at 4.5px, with round caps and joins. The color is the route's API color.
- **Pin:** A 28px mark. A triangular nose and a circle, filled with the route color and stroked in Sheet. It eases along the shape from the previous report to the new one, then waits.
- **Follow:** After a drag, Ikuti kendaraan appears at the bottom left. It recenters once. The camera does not chase the pin on every frame.

## Do's and Don'ts

### Do:

- **Do** keep the page ground Ground Blue and the working surface Sheet.
- **Do** mark the page title with a 4px by 48px Mark Blue bar, and each card with a full-bleed 4px strip of the same color.
- **Do** keep a card flat: 16px radius, a 1px Rule Gray border, and 16px of padding.
- **Do** show keyboard focus as a 2px Ground Blue outline, 2px outside the control.
- **Do** show a status as a pill: the Indonesian word at 700, the raw code at 400 and 80% opacity.
- **Do** paint the route badge and the map line with the API route color, and fall back to Mark Blue when that color is missing.

### Don't:

- **Don't** copy the TransJakarta logo, homepage, or marketing layout.
- **Don't** add a hero, a gradient, an illustration, or a second typeface.
- **Don't** put a shadow on a card, a button, or the dialog.
- **Don't** recolor a button on hover.
- **Don't** fade the vehicle cards while a refresh is in flight.
- **Don't** use a route's API color for the masthead, the footer, a button, or the page background.
- **Don't** round the dialog at 640px and below. At that width it is a square, full-viewport sheet.
