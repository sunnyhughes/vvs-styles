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
  /**
   * Real product photo of this shirt in this color (e.g. a Printify mockup),
   * served from `public/shirts/<slug>/<color>.<ext>`. Null until a photo has
   * been uploaded for the combo — the UI falls back to the shirt's
   * `default_image_url` in that case.
   */
  image_url: string | null;
}

/**
 * Per-shirt customization mode — drives the input + overlay on the product
 * page. Most phrases stand alone ('none'); a few take years clean (e.g.
 * "Still Here, Still Clean"); a few take the year clean (e.g. "Clean and
 * Serene since 1953").
 */
export type CleantimeMode = "none" | "years" | "year_clean";

/**
 * A single shirt plus its customization options, returned by
 * `GET /api/shirts/:slug` and used to render the product detail page.
 */
export interface ShirtDetail extends Shirt {
  category: string | null;
  accent_image_url: string | null;
  cleantime_mode: CleantimeMode;
  colors: Color[];
}
