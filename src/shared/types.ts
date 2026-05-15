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
