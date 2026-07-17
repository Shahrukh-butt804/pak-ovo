import { createFileRoute } from "@/lib/router-compat";
import { useMemo } from "react";
import { useGetMyOrdersQuery } from "@/redux/services/orderSlice";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "My orders — PakOvo" },
      { name: "description", content: "View all of your orders and their status." },
      { property: "og:title", content: "My orders — PakOvo" },
      { property: "og:url", content: "/track" },
    ],
    links: [{ rel: "canonical", href: "/track" }],
  }),
  component: TrackOrder,
});

function TrackOrder() {
  const { data, isLoading, isError } = useGetMyOrdersQuery({});
  const orders = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);

  return (
    <section className="container-px mx-auto max-w-7xl py-12 md:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Order history</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">My orders</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Review every order placed with your account, including status, totals, shipping, and items.</p>
        </div>
        <Button variant="outline" className="h-11">Refresh</Button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Loading orders...</div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive bg-destructive/5 p-10 text-center text-sm text-destructive">Unable to load orders. Please try again later.</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-background shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-surface text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <th className="border-b border-border px-4 py-3">email</th>
                <th className="border-b border-border px-4 py-3">Phone</th>
                <th className="border-b border-border px-4 py-3">Date</th>
                <th className="border-b border-border px-4 py-3">Status</th>
                <th className="border-b border-border px-4 py-3">Amount</th>
                <th className="border-b border-border px-4 py-3">Shipping Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => {
                const shipping = order.shippingAddress;

                return (
                  <tr key={order._id ?? order.id} className="border-b border-border last:border-b-0 hover:bg-surface">
                    <td className="px-4 py-4 align-top font-medium text-foreground">{order.email || "N/A"}</td>
                    <td className="px-4 py-4 align-top font-medium text-foreground">{order.phone || "N/A"}</td>
                    <td className="px-4 py-4 align-top text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">{order.status}</span>
                    </td>
                    <td className="px-4 py-4 align-top font-semibold">{formatPrice(order.totalAmount ?? order.total ?? 0)}</td>
                    <td className="px-4 py-4 align-top text-sm text-muted-foreground">
                     {shipping?.address}, {shipping?.city}, {shipping?.country}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
