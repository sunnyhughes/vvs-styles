/** Types shared between the Worker API and the React client. */

/** A shirt design as stored in D1 and returned by `GET /api/shirts`. */
export interface Shirt {
  id: number;
  slug: string;
  name: string;
  base_price_cents: number;
  default_image_url: string;
  hero_phrase: string;
}

/** A shirt color option (swatch). */
export interface Color {
  id: number;
  name: string;
  hex: string;
}

/** A recovery program option (AA / NA / anger management). */
export interface Program {
  id: number;
  slug: string;
  name: string;
}

/**
 * A single shirt plus its customization options, returned by
 * `GET /api/shirts/:slug` and used to render the product detail page.
 */
export interface ShirtDetail extends Shirt {
  colors: Color[];
  programs: Program[];
}
