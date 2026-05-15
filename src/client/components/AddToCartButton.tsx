import { Button } from "./Button";
import { addToCart, openCart, type NewCartItem } from "../lib/cart";

/**
 * Adds the configured shirt to the cart and opens the cart drawer. A null
 * `item` (required options not yet chosen) leaves the button disabled.
 */
export function AddToCartButton({
  item,
  disabled,
}: {
  item: NewCartItem | null;
  disabled?: boolean;
}) {
  function handleClick() {
    if (!item) return;
    addToCart(item);
    openCart();
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled || !item}
      className="w-full"
    >
      Add to cart
    </Button>
  );
}
