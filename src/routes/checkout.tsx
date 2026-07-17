import { createFileRoute, Link } from "@/lib/router-compat";
import { useState } from "react";
import { CheckCircle2, Lock, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useGetMyCartQuery } from "@/redux/services/cartSlice";
import { UPLOADS_URL } from "@/constants/api";
import { useCreateOrderMutation } from "@/redux/services/orderSlice";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — PakOvo" },
      { name: "description", content: "Complete your purchase securely." },
    ],
  }),
  component: Checkout,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s-]{7,15}$/;
const CARD_NUMBER_REGEX = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CVC_REGEX = /^\d{3,4}$/;
const POSTAL_CODE_REGEX = /^[A-Za-z0-9\s-]{3,10}$/;

const validateForm = (data: {
  email: FormDataEntryValue | null;
  phone: FormDataEntryValue | null;
  firstName: FormDataEntryValue | null;
  lastName: FormDataEntryValue | null;
  address: FormDataEntryValue | null;
  city: FormDataEntryValue | null;
  zipCode: FormDataEntryValue | null;
  country: FormDataEntryValue | null;
  cardNumber: FormDataEntryValue | null;
  expiry: FormDataEntryValue | null;
  cvc: FormDataEntryValue | null;
  nameOnCard: FormDataEntryValue | null;
}): string | null => {
  const get = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

  const email = get(data.email);
  const phone = get(data.phone);
  const firstName = get(data.firstName);
  const lastName = get(data.lastName);
  const address = get(data.address);
  const city = get(data.city);
  const zipCode = get(data.zipCode);
  const country = get(data.country);
  const cardNumber = get(data.cardNumber);
  const expiry = get(data.expiry);
  const cvc = get(data.cvc);
  const nameOnCard = get(data.nameOnCard);

  if (!email) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Enter a valid email address";

  if (!phone) return "Phone number is required";
  if (!PHONE_REGEX.test(phone)) return "Enter a valid phone number";

  if (!firstName) return "First name is required";
  if (!lastName) return "Last name is required";
  if (!address) return "Address is required";
  if (!city) return "City is required";

  if (!zipCode) return "Postal code is required";
  if (!POSTAL_CODE_REGEX.test(zipCode)) return "Enter a valid postal code";

  if (!country) return "Country is required";

  if (!cardNumber) return "Card number is required";
  if (!CARD_NUMBER_REGEX.test(cardNumber)) return "Enter a valid 16-digit card number";

  if (!expiry) return "Expiry date is required";
  if (!EXPIRY_REGEX.test(expiry)) return "Expiry must be in MM/YY format";

  if (!cvc) return "CVC is required";
  if (!CVC_REGEX.test(cvc)) return "Enter a valid CVC";

  if (!nameOnCard) return "Name on card is required";

  return null; // all valid
};

function Checkout() {
  const { clear } = useCart();
  const [done, setDone] = useState(false);
  const { data: cart, isLoading } = useGetMyCartQuery({});

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const fields = {
      email: formData.get("email"),
      phone: formData.get("phone"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      address: formData.get("address"),
      city: formData.get("city"),
      zipCode: formData.get("postalCode"),
      country: formData.get("country"),
      cardNumber: formData.get("cardNumber"),
      expiry: formData.get("expiry"),
      cvc: formData.get("cvc"),
      nameOnCard: formData.get("nameOnCard"),
    };

    const validationError = validateForm(fields);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = {
      email: fields.email,
      phone: fields.phone,
      shippingAddress: {
        firstName: fields.firstName,
        lastName: fields.lastName,
        address: fields.address,
        city: fields.city,
        zipCode: fields.zipCode,
        country: fields.country,
      },
      payment: {
        cardNumber: fields.cardNumber,
        expiry: fields.expiry,
        cvc: fields.cvc,
        nameOnCard: fields.nameOnCard,
      },
    };

    const res: any = await createOrder(payload);

    if (!res?.data?.success) {
      toast.error(res.error?.data?.message || "something went wrong");
      return;
    }

    clear();
    setDone(true);
  };

  const items = cart?.products ?? [];
  const itemCount = cart?.itemCount ?? items.length ?? 0;
  const subtotal = Number(cart?.subtotal ?? 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  if (done) {
    return (
      <div className="container-px mx-auto max-w-2xl py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
        <h1 className="mt-4 font-display text-3xl font-bold">Order confirmed</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for shopping with PakOvo. A confirmation email is on its way.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">Continue shopping</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/track">Track my order</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="container-px mx-auto max-w-7xl py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to check out</h1>
        <Button variant="hero" size="lg" className="mt-6" asChild>
          <Link to="/shop">Shop now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Checkout</h1>
      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
        <Lock className="h-3 w-3" /> Secure 256-bit SSL checkout
      </p>

      <ol className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Step icon={ShoppingBag} label="Cart" done />
        <Divider />
        <Step icon={Truck} label="Shipping" active />
        <Divider />
        <Step icon={CreditCard} label="Payment" active />
        <Divider />
        <Step icon={CheckCircle2} label="Confirm" />
      </ol>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <Block title="Contact">
            <Input label="Email" name="email" type="email" required />
            <Input label="Phone" name="phone" required />
          </Block>
          <Block title="Shipping address">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="First name" name="firstName" required />
              <Input label="Last name" name="lastName" required />
              <Input label="Address" name="address" className="sm:col-span-2" required />
              <Input label="City" name="city" required />
              <Input label="Postal code" name="postalCode" required />
              <Input
                label="Country"
                name="country"
                defaultValue="Pakistan"
                className="sm:col-span-2"
                required
              />
            </div>
          </Block>
          <Block title="Payment">
            <Input
              label="Card number"
              name="cardNumber"
              required
              placeholder="1234 1234 1234 1234"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Expiry" name="expiry" required placeholder="MM/YY" />
              <Input label="CVC" name="cvc" required placeholder="123" />
            </div>
            <Input label="Name on card" name="nameOnCard" required />
          </Block>
          <Button
            variant="hero"
            size="xl"
            type="submit"
            className="w-full"
            disabled={isCreatingOrder}
          >
            {isCreatingOrder ? "Processing..." : `Pay ${formatPrice(total)}`}
          </Button>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <div className="mt-2 text-sm text-muted-foreground">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </div>
          <ul className="mt-4 space-y-3">
            {items.map((item: any, index: number) => {
              const product = item?.product ?? item;
              const title = product?.title ?? product?.name ?? "Product";
              const quantity = Number(item?.quantity ?? item?.qty ?? 1);
              const price = Number(product?.effectivePrice ?? item?.price ?? 0);
              const image = product?.image ?? product?.thumbnail ?? "";
              const slug = product?.slug ?? "";
              const productId = product?._id ?? product?.id ?? item?.productId ?? "";

              return (
                <li key={`${productId || index}`} className="flex gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-background">
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
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-navy-foreground">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-1">{title}</p>
                    {slug ? <p className="text-xs text-muted-foreground">{slug}</p> : null}
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(price * quantity)}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            {/* <Row label="Tax" value={formatPrice(tax)} /> */}
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
function Input({
  label,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </label>
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

function Step({
  icon: Icon,
  label,
  active,
  done,
}: {
  icon: any;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-1.5 ${done ? "text-brand" : active ? "text-foreground" : ""}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </li>
  );
}
function Divider() {
  return <li aria-hidden className="h-px w-6 bg-border" />;
}
