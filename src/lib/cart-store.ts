import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  variant?: string;
}

interface CartState {
  open: boolean;
  lines: CartLine[];
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (id: string, variant?: string) => void;
  setQty: (id: string, qty: number, variant?: string) => void;
  clear: () => void;
}

const keyOf = (id: string, variant?: string) => `${id}__${variant ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      open: false,
      lines: [],
      setOpen: (v) => set({ open: v }),
      add: (line, qty = 1) =>
        set((s) => {
          const k = keyOf(line.id, line.variant);
          const existing = s.lines.find((l) => keyOf(l.id, l.variant) === k);
          if (existing) {
            return {
              open: true,
              lines: s.lines.map((l) =>
                keyOf(l.id, l.variant) === k ? { ...l, qty: l.qty + qty } : l,
              ),
            };
          }
          return { open: true, lines: [...s.lines, { ...line, qty }] };
        }),
      remove: (id, variant) =>
        set((s) => ({
          lines: s.lines.filter((l) => keyOf(l.id, l.variant) !== keyOf(id, variant)),
        })),
      setQty: (id, qty, variant) =>
        set((s) => ({
          lines: s.lines
            .map((l) =>
              keyOf(l.id, l.variant) === keyOf(id, variant) ? { ...l, qty } : l,
            )
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "pakovo-cart" },
  ),
);

export const cartTotals = (lines: CartLine[]) => {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.07;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
};