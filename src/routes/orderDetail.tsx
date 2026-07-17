import { createFileRoute } from "@/lib/router-compat";
import { useGetOrderByIdQuery } from "@/redux/services/orderSlice";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/order-details/$id")({
  head: () => ({
    meta: [
      { title: "Order details — PakOvo" },
      { name: "description", content: "View the details of your order." },
      { property: "og:title", content: "Order details — PakOvo" },
      { property: "og:url", content: "/order-details" },
    ],
    links: [{ rel: "canonical", href: "/order-details" }],
  }),
  component: OrderDetails,
});

function OrderDetails() {
  const { id } = Route.useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(id ?? "", { skip: !id });
  const shipping = order?.shippingAddress;
  const user = order?.user;
  const products = Array.isArray(order?.products) ? order.products : [];

  return (
    <section className="container-px mx-auto max-w-6xl py-12 md:py-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Order details</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Order #{order?._id ?? id}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Review your order status, shipping information, and purchased items.</p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Loading order details...</div>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive bg-destructive/5 p-10 text-center text-sm text-destructive">Unable to load order details. Please try again later.</div>
      ) : !order ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Order not found.</div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Order information</p>
              <div className="mt-4 space-y-3 text-sm text-foreground">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-medium">{order._id}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">{order.status}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Placed</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Total amount</span>
                  <span className="font-semibold">{formatPrice(order.totalAmount ?? 0)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Shipping address</p>
              <div className="mt-4 space-y-2 text-sm text-foreground">
                <p className="font-medium">{shipping?.firstName} {shipping?.lastName}</p>
                <p>{shipping?.address}</p>
                <p>{shipping?.city}, {shipping?.country} {shipping?.zipCode}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Customer</p>
              <div className="mt-4 space-y-2 text-sm text-foreground">
                <p className="font-medium">{user?.fullName || "N/A"}</p>
                <p>{user?.email || order.email}</p>
                <p>{order.phone}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Order contacts</p>
              <div className="mt-4 space-y-2 text-sm text-foreground">
                <p className="flex items-center gap-2"><span className="font-medium">Email:</span> {order.email}</p>
                <p className="flex items-center gap-2"><span className="font-medium">Phone:</span> {order.phone}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-background shadow-sm">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-surface text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="border-b border-border px-4 py-3">Product</th>
                  <th className="border-b border-border px-4 py-3">Unit price</th>
                  <th className="border-b border-border px-4 py-3">Quantity</th>
                  <th className="border-b border-border px-4 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item: any) => {
                  const product = item.product ?? {};
                  const quantity = item.quantity ?? 1;
                  const price = item.effectivePrice ?? product.price ?? 0;
                  return (
                    <tr key={item._id ?? product._id} className="border-b border-border last:border-b-0 hover:bg-surface">
                      <td className="px-4 py-4 align-top font-medium text-foreground">{product.title ?? "Product"}</td>
                      <td className="px-4 py-4 align-top text-muted-foreground">{formatPrice(price)}</td>
                      <td className="px-4 py-4 align-top text-muted-foreground">{quantity}</td>
                      <td className="px-4 py-4 align-top font-semibold">{formatPrice(price * quantity)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
