import { Link } from "@/lib/router-compat";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  useDeleteFromCartMutation,
  useGetMyCartQuery,
  useUpdateCartMutation,
} from "@/redux/services/cartSlice";
import { toast } from "sonner";
import { UPLOADS_URL } from "@/constants/api";
import { useRef, useState, useCallback } from "react";

export function CartDrawer() {
  const { open, setOpen } = useCart();

  const { data: cart, isLoading } = useGetMyCartQuery({});

  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
  const [deleteFromCart, { isLoading: isDeleting }] = useDeleteFromCartMutation();

  const items = cart?.products ?? [];
  const itemCount = cart?.itemCount ?? items.length ?? 0;
  const subtotal = Number(cart?.subtotal ?? 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleQuantityChange = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity < 1) return;
      // update UI immediately
      setLocalQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
      if (debounceTimers.current[productId]) {
        clearTimeout(debounceTimers.current[productId]);
      }
      debounceTimers.current[productId] = setTimeout(async () => {
        const res: any = await updateCart({ productId, quantity: newQuantity });
        if (!res?.data?.success) {
          toast.error(res.error?.data?.message || "something went wrong");
        }
      }, 600);
    },
    [updateCart],
  );

  const handleRemove = async (productId: string) => {
    if (!productId) return;
    const res: any = await deleteFromCart(productId);

    if (!res?.data?.success) {
      toast.error(res.error.data.message || "something went wrong");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={() => setOpen(false)}
      />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg font-semibold">Your bag ({itemCount})</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="p-1.5 hover:bg-secondary rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
            Loading your cart...
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Discover our latest arrivals.</p>
            </div>
            <Button variant="premium" onClick={() => setOpen(false)} asChild>
              <Link to="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-border">
                {items.map((item: any, index: number) => {
                  const product = item?.product ?? item;
                  const title = product?.title ?? product?.name ?? "Product";
                  const price = Number(product?.effectivePrice ?? item?.price ?? 0);
                  const serverQuantity = Number(item?.quantity ?? item?.qty ?? 1);
                  const quantity = localQuantities[product._id] ?? serverQuantity;
                  const image = product?.image ?? product?.thumbnail ?? "";
                  const slug = product?.slug ?? "";
                  const productId = product?._id ?? product?.id ?? item?.productId ?? "";

                  return (
                    <li key={`${productId || index}`} className="flex gap-4 py-4">
                      <Link
                        to="/products/$slug"
                        params={{ slug }}
                        onClick={() => setOpen(false)}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface"
                      >
                        {image ? (
                          <img
                            src={UPLOADS_URL + image}
                            crossOrigin="anonymous"
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to="/products/$slug"
                            params={{ slug }}
                            onClick={() => setOpen(false)}
                            className="text-sm font-medium hover:text-brand line-clamp-2"
                          >
                            {title}
                          </Link>
                          <button
                            onClick={() => void handleRemove(productId)}
                            disabled={isDeleting || isUpdating}
                            aria-label="Remove item"
                            className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-border">
                            <button
                              onClick={() => handleQuantityChange(productId, quantity - 1)}
                              disabled={isDeleting || isUpdating}
                              aria-label="Decrease quantity"
                              className="rounded-l-full p-1.5 hover:bg-secondary disabled:opacity-50"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {localQuantities[productId] ?? item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(productId, quantity + 1)}
                              disabled={isDeleting || isUpdating}
                              aria-label="Increase quantity"
                              className="rounded-r-full p-1.5 hover:bg-secondary disabled:opacity-50"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold">{formatPrice(price * quantity)}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-border p-5">
              <div className="space-y-1.5 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
                {/* <Row label="Tax (est.)" value={formatPrice(tax)} /> */}
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button
                disabled={isDeleting || isUpdating}
                variant="hero"
                size="lg"
                className="mt-4 w-full"
                asChild
              >
                <Link to="/checkout" onClick={() => setOpen(false)}>
                  Checkout
                </Link>
              </Button>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 w-full py-2 text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
