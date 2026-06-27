#!/usr/bin/env node
// List the variants of a published Printify product, so we can build the
// shirt_variants map (our slug/color/size -> Printify variant id).
//
// Usage:
//   PRINTIFY_API_TOKEN=xxx PRINTIFY_SHOP_ID=123 \
//     node scripts/printify-variants.mjs <product_id>
//
// Find <product_id> in the Printify product's URL, e.g.
//   printify.com/app/store/products/<product_id>
//
// Prints each enabled variant's id + human title (e.g. "White / M"). We then
// hand-map those titles to our six color names + S/M/L/XL/2XL sizes and write
// seeds/shirt_variants.sql. (Color titles vary per blueprint — "Sport Grey",
// "True Royal", etc. — which is why we read them from the real product rather
// than guessing.)

const token = process.env.PRINTIFY_API_TOKEN;
const shopId = process.env.PRINTIFY_SHOP_ID;
const productId = process.argv[2];

if (!token || !shopId || !productId) {
  console.error(
    "Missing input. Need PRINTIFY_API_TOKEN + PRINTIFY_SHOP_ID env vars and a product_id arg.",
  );
  process.exit(1);
}

const res = await fetch(
  `https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "vvs-styles-setup/1.0",
    },
  },
);

if (!res.ok) {
  console.error(`Printify API error ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const product = await res.json();
console.log(`\nProduct: ${product.title}  (id ${product.id})\n`);
console.log("variant_id\tenabled\ttitle");
for (const v of product.variants ?? []) {
  console.log(`${v.id}\t${v.is_enabled ? "yes" : "no "}\t${v.title}`);
}
console.log(
  `\n${(product.variants ?? []).filter((v) => v.is_enabled).length} enabled variants.`,
);
