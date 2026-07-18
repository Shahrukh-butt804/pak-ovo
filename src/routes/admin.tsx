import catFallback from "@/assets/cat-cosmetics.jpg";
import Spinner from "@/components/spinner";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { UPLOADS_URL } from "@/constants/api";
import {
  parseCsv,
  productCsvTemplate,
  useAdmin,
  validateProductRows,
  type AdminOrder,
  type AdminProduct,
  type BlogPost
} from "@/lib/admin-store";
import { formatPrice } from "@/lib/format";
import { createFileRoute, Link, useNavigate } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { logout, selectUser, setUser } from "@/redux/reducers/userSlice";
import { useLoginMutation } from "@/redux/services/authSlice";
import { useAddToCategoryMutation, useDeleteCategoryMutation, useGetAllCategoriesWithSubCategoriesQuery, useUpdateCategoryMutation } from "@/redux/services/categorySlice";
import { useAddProductMutation, useDeleteProductMutation, useGetAllProductsQuery, useUpdateProductMutation } from "@/redux/services/productSlice";
import { useGetAllUsersQuery, useToggleUserStatusMutation } from "@/redux/services/userManagement";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart3,
  Check, ChevronLeft, ChevronRight,
  Download,
  FileDown,
  FileText, Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PakOvo" }, { name: "robots", content: "noindex" }] }),
  component: AdminGate,
});

function AdminGate() {
  const user = useSelector(selectUser)
  if (!user || user.role !== "admin") return <AdminLogin />;
  return <Admin />;
}

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res: any = await login({ email, password, role: "admin" });

    if (res?.data?.success) {
      dispatch(setUser({ ...res?.data?.data?.user, token: res?.data?.data?.accessToken }));
      toast.success(res?.data?.message || "Operation successful");
      navigate({ to: "/admin" });
    } else {
      toast.error(
        res?.error?.data?.message || res?.error?.data?.errors[0].msg || "something went wrong",
      );
    }
  };

  return (
    <div className="container-px mx-auto flex min-h-[70vh] max-w-md items-center py-12">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Admin portal</p>
        <h1 className="mt-1 font-display text-2xl font-bold">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted-foreground">Authorized staff only. Unauthorized access is prohibited.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
          <Button disabled={isLoading} type="submit" variant="hero" size="lg" className="w-full">Sign in</Button>
      
        </form>
      </div>
    </div>
  );
}

type View = "dashboard" | "products" | "categories" | "orders" | "customers" | "discounts" | "banners" | "reviews" | "content" | "blog" | "reports" | "settings";

const nav: { key: View; icon: any; label: string }[] = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "products", icon: Package, label: "Products" },
  { key: "categories", icon: Tag, label: "Categories" },
  { key: "orders", icon: ShoppingCart, label: "Orders" },
  { key: "customers", icon: Users, label: "Customers" },
  { key: "discounts", icon: Megaphone, label: "Discounts" },
  { key: "banners", icon: ImageIcon, label: "Banners" },
  { key: "reviews", icon: Star, label: "Reviews" },
  { key: "content", icon: FileText, label: "Content (CMS)" },
  { key: "blog", icon: FileText, label: "Blog" },
  { key: "reports", icon: BarChart3, label: "Reports" },
  { key: "settings", icon: Settings, label: "Settings" },
];

function Admin() {
  const dispatch = useDispatch();
  const [view, setView] = useState<View>("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const user = useSelector(selectUser)

  return (
    <div className="container-px mx-auto max-w-7xl py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Admin portal</p>
          <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">PakOvo control center</h1>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {user.name} · <span className="uppercase tracking-wider text-brand">{user.role}</span>
            </span>
          )}
          <button onClick={() => setMobileNav(true)} className="lg:hidden rounded-md border border-border px-3 py-2 text-sm">Menu</button>
          <Link to="/" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">← Back to site</Link>
          <button
            onClick={() => {
              dispatch(logout());
              toast.success("Signed out");
            }}
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden h-fit rounded-2xl border border-border bg-card p-3 lg:block">
          <NavList view={view} setView={setView} />
        </aside>
        {mobileNav && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNav(false)} />
            <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display font-bold">Admin</p>
                <button onClick={() => setMobileNav(false)} className="p-1.5"><X className="h-5 w-5" /></button>
              </div>
              <NavList view={view} setView={(v) => { setView(v); setMobileNav(false); }} />
            </div>
          </div>
        )}

        <div className="min-w-0 space-y-6">
          {view === "dashboard" && <Dashboard />}
          {view === "products" && <ProductsView />}
          {view === "categories" && <CategoriesView />}
          {view === "orders" && <OrdersView />}
          {view === "customers" && <CustomersView />}
          {view === "discounts" && <DiscountsView />}
          {view === "banners" && <BannersView />}
          {view === "reviews" && <ReviewsView />}
          {view === "content" && <CmsView />}
          {view === "blog" && <BlogView />}
          {view === "reports" && <ReportsView />}
          {view === "settings" && <SettingsView />}
        </div>
      </div>
    </div>
  );
}

function NavList({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <ul className="space-y-1">
      {nav.map(({ key, icon: Icon, label }) => (
        <li key={key}>
          <button
            onClick={() => setView(key)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
              view === key ? "bg-secondary font-semibold" : "text-muted-foreground hover:bg-secondary",
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard() {
  const { products, orders, customers } = useAdmin();
  const revenue = orders.filter((o) => o.status !== "Refunded" && o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "Pending").length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Revenue" value={formatPrice(revenue)} delta="+12.4%" />
        <Metric label="Orders" value={orders.length.toString()} delta="+8.1%" />
        <Metric label="Customers" value={customers.length.toString()} delta="+5.2%" />
        <Metric label="SKUs" value={products.length.toString()} delta={`${pending} pending`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Recent orders</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-120 text-sm">
              <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="p-3 font-medium">{o.id}</td>
                    <td className="p-3 text-muted-foreground">{o.customer}</td>
                    <td className="p-3">{formatPrice(o.total)}</td>
                    <td className="p-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Top products</h2>
          <ul className="mt-4 space-y-3">
            {products.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.reviews} sold · {p.stock} in stock</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(p.price)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

/* ---------- Products ---------- */
function ProductsView() {
  const { products, addProduct, updateProduct, bulkAddProducts } = useAdmin();
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        keyword: ""
    })
    const { data, isLoading, refetch } = useGetAllProductsQuery({ ...pagination }, { refetchOnMountOrArgChange: true})

    const [deleteProduct ,{ isLoading : isDeleting}] = useDeleteProductMutation()


  const exportCsv = () => {
    const headers = ["id", "name", "category", "subcategory", "price", "compareAt", "stock", "rating", "reviews", "active"];
    const rows = products.map((p) =>
      [p.id, p.name, p.category, p.subcategory, p.price, p.compareAt ?? "", p.stock, p.rating, p.reviews, p.active]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
    );
    download("products.csv", "text/csv", [headers.join(","), ...rows].join("\n"));
    toast.success(`Exported ${products.length} products to CSV`);
  };


  const handleDelete = async (productId:any) => {
    if(!productId){
      toast.error("Product Id is Required");
      return
    }
    setDeletingItemId(productId)
    const res: any = await deleteProduct(productId);
    if (res?.data?.success) {
      toast.success(res?.data?.message || "Operation successful");
      refetch()
    } else {
      toast.error( res?.error?.data?.message || res?.error?.data?.errors[0].msg || "something went wrong",);
    }
    setDeletingItemId("")
  };

  if (isLoading) {
      return (
          <div className='grid place-content-center'>
              <Spinner size='lg' />
          </div>
      )
  }

  return (
    <>
      <ToolbarCard
        title="Products"
        count={`Total ${data.totalDocs || "N/A"} Products`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}><Upload className="h-4 w-4" /> Bulk CSV import</Button>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button>
            <Button variant="premium" size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> New product</Button>
          </>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
         <Table
                tableData={{ data: data.docs, exlucdedFields: ["__v", "updatedAt", "_id", "slug", "image", "description", "wished","reviews","rating"] }}
                setPagination={setPagination}
                pagination={data || {}}
                onEdit={setEditing}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                deletingItemId={deletingItemId}
            />
      </div>

      {(creating || editing) && (
        <ProductForm
          initial={editing}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSave={(data:any) => {
            if (editing) { updateProduct(editing.id, data); toast.success("Product updated"); }
            else { addProduct(data); toast.success("Product created"); }
            setCreating(false); setEditing(null); refetch()
          }}
        />
      )}

      {importOpen && (
        <BulkImport
          onClose={() => setImportOpen(false)}
          onImport={(rows) => {
            const n = bulkAddProducts(rows);
            toast.success(`Imported ${n} products`);
            setImportOpen(false);
          }}
        />
      )}
    </>
  );
}

function getImageUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
  return `${UPLOADS_URL}${path.replace(/\\/g, "/")}`;
}

export function ProductForm({
  initial,
  onClose,
  onSave,
}: {
  initial: any;
  onClose: any;
  onSave?: any;
}) {
  const [catPage, setCatPage] = useState(1);

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetAllCategoriesWithSubCategoriesQuery({ page: catPage, limit: 10 }) as {
      data: any;
      isLoading: boolean;
    };

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [addProduct, { isLoading: isCreating }] = useAddProductMutation();
  const isSaving = isUpdating || isCreating;

  const [form, setForm] = useState<any>(() => ({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? 0,
    discountedPrice: initial?.discountedPrice ?? "",
    rating: initial?.rating ?? 4.5,
    reviews: initial?.reviews ?? 0,
    inStock: initial?.inStock ?? true,
    category: initial?.category?._id ?? "",
    subCategory: initial?.subCategory?._id ?? "",
  }));

  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState(initial?.category?.name ?? "");
  const [selectedSubCategoryLabel, setSelectedSubCategoryLabel] = useState(initial?.subCategory?.name ?? "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>(getImageUrl(initial?.image));

  useEffect(() => {
    return () => {
      if (imgPreview.startsWith("blob:")) URL.revokeObjectURL(imgPreview);
    };
  }, [imgPreview]);

  const handleImage = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImageFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const categories = categoriesData?.docs ?? [];
  const totalPages = categoriesData?.totalPages ?? 1;

  const selectedCategory = useMemo(
    () => categories.find((c:any) => c._id === form.category),
    [categories, form.category],
  );
  const subCategoryOptions = selectedCategory?.subCategories ?? [];

  const handleSelectCategory = (cat: any) => {
    setForm((f:any) => ({ ...f, category: cat._id, subCategory: "" }));
    setSelectedCategoryLabel(cat.name);
    setSelectedSubCategoryLabel("");
  };

  const handleSelectSubCategory = (sub: any) => {
    setForm((f:any) => ({ ...f, subCategory: sub._id }));
    setSelectedSubCategoryLabel(sub.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.category) return toast.error("Please select a category");
    if (!form.subCategory) return toast.error("Please select a subcategory");
    if (form.price < 0) return toast.error("Price must be positive");
    if (form.discountedPrice !== "" && Number(form.discountedPrice) > form.price) {
      return toast.error("Discounted price can't exceed price");
    }
    if (!initial && !imageFile) return toast.error("Please upload a product image");

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("subCategory", form.subCategory);
    fd.append("price", String(form.price));
    fd.append("discountedPrice", form.discountedPrice === "" ? "" : String(form.discountedPrice));
    fd.append("rating", String(form.rating));
    fd.append("reviews", String(form.reviews));
    fd.append("inStock", String(form.inStock));
    if (imageFile) fd.append("image", imageFile);

    console.log(form.discountedPrice)
    try {
      if (initial) {
        await updateProduct({ id: initial._id, body: fd }).unwrap();
        toast.success("Product updated");
      } else {
        await addProduct(fd).unwrap();
        toast.success("Product created");
      }
      onSave?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.errors[0]?.msg || "Something went wrong");
    }
  };

  return (
    <Modal title={initial ? "Edit product" : "New product"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image + basic fields */}
        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Image</label>
            <div className="mt-1 aspect-square overflow-hidden rounded-lg border border-border bg-surface">
              <img src={getImageUrl(imgPreview)} crossOrigin="anonymous" alt="" className="h-full w-full object-cover" />
            </div>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-md border border-dashed border-border py-2 text-xs hover:bg-secondary">
              <Upload className="h-3 w-3" /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="space-y-3">
            <Field
              label="Title"
              required
              value={form.title}
              onChange={(v) => setForm((f:any) => ({ ...f, title: v }))}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Field
                label="Price"
                type="number"
                value={String(form.price)}
                onChange={(v) => setForm((f:any) => ({ ...f, price: Number(v) }))}
              />
              <Field
                label="Discounted price"
                type="number"
                value={form.discountedPrice === "" ? "" : String(form.discountedPrice)}
                onChange={(v) => setForm((f:any) => ({ ...f, discountedPrice: v === "" ? "" : Number(v) }))}
              />
            </div>

               <div className="grid gap-2 sm:grid-cols-2">
              <Field
                label="Reviews"
                type="number"
                value={String(form.reviews)}
                onChange={(v) => setForm((f:any) => ({ ...f, reviews: Number(v) }))}
              />
            <Field
              label="Rating"
              type="number"
              value={String(form.rating)}
              onChange={(v) => setForm((f:any) => ({ ...f, rating: Number(v) }))}
            />
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f:any) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm((f:any) => ({ ...f, inStock: e.target.checked }))}
              />
              In stock
            </label>
          </div>
        </div>

        {/* Category picker (paginated) */}
        <div className="border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Category
              {selectedCategoryLabel && <span className="ml-1 text-foreground">— {selectedCategoryLabel}</span>}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  disabled={catPage <= 1}
                  onClick={() => setCatPage((p) => p - 1)}
                  className="rounded p-1 disabled:opacity-30 hover:bg-secondary"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-muted-foreground">{catPage} / {totalPages}</span>
                <button
                  type="button"
                  disabled={catPage >= totalPages}
                  onClick={() => setCatPage((p) => p + 1)}
                  className="rounded p-1 disabled:opacity-30 hover:bg-secondary"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {isLoadingCategories ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {categories.map((cat:any) => {
                const isSelected = form.category === cat._id;
                return (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => handleSelectCategory(cat)}
                    className={`group relative flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-colors ${
                      isSelected ? "border-brand bg-brand/10" : "border-border hover:bg-secondary"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-1 top-1 rounded-full bg-brand p-0.5">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                    <div className="aspect-square w-full overflow-hidden rounded-md bg-surface">
                      {cat.image && (
                        <img src={getImageUrl(cat.image)} crossOrigin="anonymous" alt="category" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="line-clamp-1 text-[11px] capitalize">{cat.name}</span>
                  </button>
                );
              })}
              {categories.length === 0 && (
                <p className="col-span-full py-4 text-center text-xs text-muted-foreground">
                  No categories found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Subcategory picker — depends on selected category */}
        {form.category && (
          <div>
            <span className="mb-2 block text-xs font-medium text-muted-foreground">
              Subcategory
              {selectedSubCategoryLabel && (
                <span className="ml-1 text-foreground">— {selectedSubCategoryLabel}</span>
              )}
            </span>
            <div className="flex flex-wrap gap-2">
              {subCategoryOptions.map((sub:any) => {
                const isSelected = form.subCategory === sub._id;
                return (
                  <button
                    type="button"
                    key={sub._id}
                    onClick={() => handleSelectSubCategory(sub)}
                    className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                      isSelected ? "border-brand bg-brand text-white" : "border-border hover:bg-secondary"
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
              {subCategoryOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">This category has no subcategories yet.</p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="premium" disabled={isSaving}>
            {isSaving ? "Saving..." : initial ? "Save changes" : "Create product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}


function BulkImport({ onClose, onImport }: { onClose: () => void; onImport: (rows: Omit<AdminProduct, "id">[]) => void }) {
  const [preview, setPreview] = useState<ReturnType<typeof validateProductRows> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) { toast.error("CSV appears empty"); return; }
    setPreview(validateProductRows(rows, catFallback));
  };

  return (
    <Modal title="Bulk import products (CSV)" onClose={onClose}>
      <div className="space-y-4 text-sm">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-medium">CSV format</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Required columns: <code className="rounded bg-background px-1">name</code>,{" "}
            <code className="rounded bg-background px-1">category</code>,{" "}
            <code className="rounded bg-background px-1">price</code>. Optional: subcategory, compareAt, stock, rating, reviews, description, image.
          </p>
          <button
            type="button"
            onClick={() => download("products-template.csv", "text/csv", productCsvTemplate)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
          >
            <FileDown className="h-3 w-3" /> Download template
          </button>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 hover:bg-secondary">
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm font-medium">Click to upload CSV</span>
          <span className="text-xs text-muted-foreground">or drag & drop</span>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </label>

        {preview && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Valid" value={String(preview.valid.length)} tone="ok" />
              <Stat label="Errors" value={String(preview.errors.length)} tone={preview.errors.length ? "err" : "ok"} />
              <Stat label="Warnings" value={String(preview.warnings.length)} tone={preview.warnings.length ? "warn" : "ok"} />
            </div>
            {preview.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs">
                {preview.errors.slice(0, 20).map((e, i) => <p key={i} className="text-destructive">{e}</p>)}
              </div>
            )}
            {preview.warnings.length > 0 && (
              <div className="max-h-24 overflow-y-auto rounded-md border border-border bg-surface p-3 text-xs">
                {preview.warnings.slice(0, 20).map((w, i) => <p key={i} className="text-muted-foreground">{w}</p>)}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                type="button"
                variant="premium"
                disabled={preview.valid.length === 0}
                onClick={() => onImport(preview.valid)}
              >
                Import {preview.valid.length} products
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ---------- Orders ---------- */
function OrdersView() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [openOrder, setOpenOrder] = useState<AdminOrder | null>(null);

  const filtered = orders.filter((o) =>
    (!q || o.id.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase())) &&
    (!status || o.status === status),
  );

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("PakOvo — Orders", 14, 16);
    doc.setFontSize(10); doc.text(new Date().toLocaleString(), 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["Order", "Customer", "Email", "Date", "Items", "Total", "Status"]],
      body: filtered.map((o) => [o.id, o.customer, o.email, o.date, o.items, formatPrice(o.total), o.status]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 27, 61] },
    });
    doc.save("orders.pdf");
    toast.success(`Exported ${filtered.length} orders`);
  };

  return (
    <>
      <ToolbarCard
        title="Orders" count={`${orders.length} total`}
        search={{ value: q, onChange: setQ, placeholder: "Search orders or customers…" }}
        actions={
          <>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">All statuses</option>
              {["Pending", "Paid", "Fulfilled", "Delivered", "Refunded", "Cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Button variant="outline" size="sm" onClick={exportPdf}><FileDown className="h-4 w-4" /> Export PDF</Button>
          </>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Date</th>
              <th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((o) => (
              <tr key={o.id}>
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3 text-muted-foreground">{o.customer}</td>
                <td className="p-3 text-muted-foreground">{o.date}</td>
                <td className="p-3">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => { updateOrderStatus(o.id, e.target.value as AdminOrder["status"]); toast.success(`Order ${o.id} → ${e.target.value}`); }}
                    className="h-7 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {["Pending", "Paid", "Fulfilled", "Delivered", "Refunded", "Cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setOpenOrder(o)} className="rounded-md p-1.5 hover:bg-secondary" aria-label="View"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm(`Delete order ${o.id}?`)) { deleteOrder(o.id); toast.success("Order deleted"); } }} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No orders found.</p>}
      </div>

      {openOrder && (
        <Modal title={`Order ${openOrder.id}`} onClose={() => setOpenOrder(null)}>
          <div className="grid gap-3 text-sm">
            <Row label="Customer" value={openOrder.customer} />
            <Row label="Email" value={openOrder.email} />
            <Row label="Date" value={openOrder.date} />
            <Row label="Items" value={String(openOrder.items)} />
            <Row label="Total" value={formatPrice(openOrder.total)} />
            <Row label="Status" value={<StatusBadge status={openOrder.status} />} />
          </div>
        </Modal>
      )}
    </>
  );
}

/* ---------- Customers ---------- */
function CustomersView() {
 const [toggledUserId, setToggledUserId] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        keyword: ""
    })
    const { data , isLoading, refetch } = useGetAllUsersQuery({ ...pagination }, { refetchOnMountOrArgChange: true})
    console.log("🚀 ~ CustomersView ~ data:", data)
    const [toggleuser, {isLoading : isToggleLoading}] = useToggleUserStatusMutation()


  const handleDelete = async (userId:any) => {
    if(!userId) {
      toast.error("User Id is Required");
      return
    }
    setToggledUserId(userId)
    const res: any = await toggleuser(userId);
    if (res?.data?.success) {
      toast.success(res?.data?.message || "Operation successful");
      refetch()
    } else {
      toast.error( res?.error?.data?.message || res?.error?.data?.errors[0].msg || "something went wrong",);
    }
    setToggledUserId("")
  };

  



  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("PakOvo — Customers", 14, 16);
    doc.setFontSize(10); doc.text(`Generated ${new Date().toLocaleString()}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["ID", "Name", "Email", "Joined", "Orders", "Spent"]],
      // body: filtered.map((c) => [c.id, c.name, c.email, c.joined, c.orders, formatPrice(c.spent)]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 27, 61] },
    });
    doc.save("customers.pdf");
    // toast.success(`Exported ${filtered.length} customers to PDF`);
  };

  const exportCsv = () => {
    const rows = [["id", "name", "email", "joined", "orders", "spent"].join(",")];
    // filtered.forEach((c) => rows.push([c.id, `"${c.name}"`, c.email, c.joined, c.orders, c.spent].join(",")));
    download("customers.csv", "text/csv", rows.join("\n"));
    // toast.success(`Exported ${filtered.length} customers to CSV`);
  };


  if (isLoading) {
      return (
          <div className='grid place-content-center'>
              <Spinner size='lg' />
          </div>
      )
  }

  return (
    <>
      <ToolbarCard
        title="Customers" count={`Total ${data.totalDocs || 0} Customers`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" /> CSV</Button>
            <Button variant="premium" size="sm" onClick={exportPdf}><FileDown className="h-4 w-4" /> Export PDF</Button>
          </>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
     <Table
                tableData={{ data: data.docs, exlucdedFields: ["__v", "updatedAt", "_id", "refreshToken", "password", "otp", "role","reviews","rating"] }}
                setPagination={setPagination}
                pagination={data || {}}
                onDelete={handleDelete}
                isDeleting={isToggleLoading}
                deletingItemId={toggledUserId}
            />
      </div>
    </>
  );
}


interface SubCategory {
  _id?: string;
  name: string;
  slug?: string;
}

interface ServerCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  subCategories: SubCategory[];
  tagline?: string;
  description?: string;
  seoTitle?: string;
  metaDescription?: string;
}

export function CategoriesView() {
  const [editing, setEditing] = useState<ServerCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const { data: categories, isLoading, refetch } = useGetAllCategoriesWithSubCategoriesQuery({});

  const [addCategory] = useAddToCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  if (isLoading) {
    return (
      <div className="grid place-content-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const docs: ServerCategory[] = categories?.docs ?? [];

  const handleDelete = async (c: ServerCategory) => {
    if (!confirm(`Delete category "${c.name}"? Products in this category will keep their tag.`)) return;
    try {
      await deleteCategory(c._id).unwrap();
      toast.success("Category deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete category");
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (editing) {
        await updateCategory({ id: editing._id, body: formData }).unwrap();
        toast.success("Category updated");
      } else {
        await addCategory(formData).unwrap();
        toast.success("Category created");
      }
      setCreating(false);
      setEditing(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to save category");
    }
  };

  return (
    <>
      <ToolbarCard
        title="Categories"
        count={`${categories?.totalDocs ?? 0} total`}
        actions={
          <Button variant="premium" size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> New category
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((c) => (
          <div key={c._id} className="group overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative h-32 w-full overflow-hidden">
              <img
                src={UPLOADS_URL + c.image}
                crossOrigin="anonymous"
                alt={c.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-linear-to-t from-black/70 to-transparent p-2">
                <button
                  onClick={() => setEditing(c)}
                  className="rounded-md bg-background/90 p-1.5 text-foreground hover:bg-background"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  disabled={isDeleting}
                  className="rounded-md bg-background/90 p-1.5 text-destructive hover:bg-background disabled:opacity-50"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold">{c.name}</p>
              {c.description && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{c.subCategories?.length || 0} </span>
                Sub Categories
              </p>
            </div>
          </div>
        ))}
        {docs.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No categories yet.</p>
        )}
      </div>

      {(creating || editing) && (
        <CategoryForm
          initial={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}

function CategoryForm({
  initial,
  onClose,
  onSave,
}: {
  initial: ServerCategory | null;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
  });
  const [subcategories, setSubcategories] = useState<SubCategory[]>(initial?.subCategories ?? []);
  const [subInput, setSubInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>(
    initial ? UPLOADS_URL + initial.image : catFallback,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImage = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImageFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const addSub = () => {
    const v = subInput.trim();
    if (!v) return;
    if (subcategories.some((s) => s.name.toLowerCase() === v.toLowerCase())) {
      toast.error("Already added");
      return;
    }
    setSubcategories([...subcategories, { name: v }]);
    setSubInput("");
  };

  const removeSub = (name: string) => {
    setSubcategories(subcategories.filter((s) => s.name !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return toast.error("Name is required");

    if (!initial && !imageFile) return toast.error("Please upload an image");

    const fd = new FormData();
    fd.append("name", name);
    if (form.description) fd.append("description", form.description);
    fd.append("subCategories", JSON.stringify(subcategories.map((s) => s.name)));
    if (imageFile) fd.append("image", imageFile);

    setIsSubmitting(true);
    try {
      await onSave(fd);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={initial ? "Edit category" : "New category"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Image</label>
            <div className="mt-1 aspect-square overflow-hidden rounded-lg border border-border bg-surface">
              <img src={imgPreview} crossOrigin="anonymous" alt="image" className="h-full w-full object-cover" />
            </div>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-md border border-dashed border-border py-2 text-xs hover:bg-secondary">
              <Upload className="h-3 w-3" /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <div className="space-y-3">
            <Field label="Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground">Subcategories</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {subcategories.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs">
                {s.name}
                <button
                  type="button"
                  onClick={() => removeSub(s.name)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${s.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {subcategories.length === 0 && (
              <span className="text-xs text-muted-foreground">No subcategories yet.</span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={subInput}
              onChange={(e) => setSubInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSub();
                }
              }}
              placeholder="Add subcategory and press Enter"
              className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-brand"
            />
            <Button type="button" variant="outline" size="sm" onClick={addSub}>Add</Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="premium" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initial ? "Save changes" : "Create category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Discounts ---------- */
function DiscountsView() {
  const [codes, setCodes] = useState([
    { code: "WELCOME10", off: "10%", status: "Active", uses: 248 },
    { code: "SUMMER25", off: "25%", status: "Active", uses: 94 },
    { code: "VIP100", off: "Rs 1,000", status: "Paused", uses: 12 },
  ]);
  return (
    <>
      <ToolbarCard
        title="Discount codes" count={`${codes.length} codes`}
        actions={
          <Button variant="premium" size="sm" onClick={() => {
            const code = prompt("Discount code (e.g. SPRING20)")?.toUpperCase();
            const off = prompt("Discount value (10% or Rs 500)") || "";
            if (code) { setCodes([{ code, off, status: "Active", uses: 0 }, ...codes]); toast.success("Code created"); }
          }}><Plus className="h-4 w-4" /> New code</Button>
        }
      />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-120 text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3">Code</th><th className="p-3">Discount</th><th className="p-3">Uses</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {codes.map((c) => (
              <tr key={c.code}>
                <td className="p-3 font-mono font-medium">{c.code}</td>
                <td className="p-3">{c.off}</td>
                <td className="p-3 text-muted-foreground">{c.uses}</td>
                <td className="p-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", c.status === "Active" ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground")}>{c.status}</span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => { setCodes(codes.filter((x) => x.code !== c.code)); toast.success("Code removed"); }} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------- Banners ---------- */
function BannersView() {
  const { banners, addBanner, updateBanner, deleteBanner } = useAdmin();

  return (
    <>
      <ToolbarCard
        title="Banners" count={`${banners.length} banners`}
        actions={
          <Button variant="premium" size="sm" onClick={() => addBanner({ title: "New banner", subtitle: "Edit me", image: catFallback, active: true })}>
            <Plus className="h-4 w-4" /> New banner
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {banners.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={b.image} alt={b.title} className="h-40 w-full object-cover" />
            <div className="p-4 space-y-2">
              <input value={b.title} onChange={(e) => updateBanner(b.id, { title: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-semibold" />
              <input value={b.subtitle} onChange={(e) => updateBanner(b.id, { subtitle: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" />
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={b.active} onChange={(e) => updateBanner(b.id, { active: e.target.checked })} />
                  {b.active ? "Live" : "Hidden"}
                </label>
                <label className="cursor-pointer text-brand hover:underline">
                  Change image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    const reader = new FileReader();
                    reader.onload = () => { updateBanner(b.id, { image: reader.result as string }); toast.success("Banner updated"); };
                    reader.readAsDataURL(f);
                  }} />
                </label>
                <button onClick={() => { deleteBanner(b.id); toast.success("Banner removed"); }} className="text-destructive hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Reviews ---------- */
function ReviewsView() {
  const reviews = [
    { id: 1, product: "Velvet Matte Lipstick", customer: "Sara A.", rating: 5, text: "Pigmented and long-lasting, my new favorite.", status: "Approved" },
    { id: 2, product: "Heritage Automatic Watch", customer: "James L.", rating: 5, text: "Excellent build quality, fast shipping.", status: "Pending" },
    { id: 3, product: "Egyptian Cotton Sheets", customer: "Aisha K.", rating: 4, text: "Very soft, washes well.", status: "Approved" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold">Reviews queue</h2>
      <div className="mt-4 divide-y divide-border">
        {reviews.map((r) => (
          <div key={r.id} className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm">
            <div>
              <p className="font-medium">{r.product}</p>
              <p className="text-xs text-muted-foreground">{r.customer} · {"★".repeat(r.rating)}</p>
              <p className="mt-1 text-muted-foreground">"{r.text}"</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Review approved")}>Approve</Button>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Review hidden")}>Hide</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- CMS ---------- */
function CmsView() {
  const { cms, updateCms } = useAdmin();
  const [form, setForm] = useState(cms);
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold">Site content</h2>
      <p className="text-sm text-muted-foreground">Edit the copy shown across the storefront.</p>
      <form
        onSubmit={(e) => { e.preventDefault(); updateCms(form); toast.success("Site content saved"); }}
        className="mt-5 space-y-4"
      >
        <Field label="Hero title" value={form.heroTitle} onChange={(v) => setForm({ ...form, heroTitle: v })} />
        <Field label="Hero subtitle" value={form.heroSubtitle} onChange={(v) => setForm({ ...form, heroSubtitle: v })} />
        <Field label="Newsletter title" value={form.newsletterTitle} onChange={(v) => setForm({ ...form, newsletterTitle: v })} />
        <Field label="Footer tagline" value={form.footerTagline} onChange={(v) => setForm({ ...form, footerTagline: v })} />
        <Field label="Free shipping threshold (Rs)" type="number" value={String(form.shippingThreshold)} onChange={(v) => setForm({ ...form, shippingThreshold: Number(v) })} />
        <div className="flex justify-end"><Button type="submit" variant="premium">Save changes</Button></div>
      </form>
    </div>
  );
}

/* ---------- Blog ---------- */
function BlogView() {
  const { blog, addPost, updatePost, deletePost } = useAdmin();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");
  const filtered = blog.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <ToolbarCard
        title="Blog posts"
        count={`${blog.length} posts`}
        search={{ value: q, onChange: setQ, placeholder: "Search posts…" }}
        actions={
          <Button variant="premium" size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> New post
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={p.cover} alt={p.title} className="h-36 w-full object-cover" />
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  p.published ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground")}>
                  {p.published ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-muted-foreground">{p.date}</span>
              </div>
              <h3 className="font-display font-semibold leading-tight">{p.title}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => { updatePost(p.id, { published: !p.published }); toast.success(p.published ? "Unpublished" : "Published"); }}
                  className="text-xs font-semibold text-brand hover:underline"
                >{p.published ? "Unpublish" : "Publish"}</button>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="rounded-md p-1.5 hover:bg-secondary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (confirm(`Delete "${p.title}"?`)) { deletePost(p.id); toast.success("Post deleted"); } }} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
            No posts yet. Create your first article.
          </div>
        )}
      </div>

      {(creating || editing) && (
        <BlogForm
          initial={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) { updatePost(editing.id, data); toast.success("Post updated"); }
            else { addPost(data); toast.success("Post created"); }
            setCreating(false); setEditing(null);
          }}
        />
      )}
    </>
  );
}

function BlogForm({ initial, onClose, onSave }: {
  initial: BlogPost | null; onClose: () => void; onSave: (data: Omit<BlogPost, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<BlogPost, "id">>(
    initial ?? {
      slug: "", title: "", excerpt: "", content: "", cover: catFallback,
      author: "PakOvo Editors", date: new Date().toISOString().slice(0, 10),
      tags: [], published: true, seoTitle: "", metaDescription: "",
    },
  );
  const [tagsInput, setTagsInput] = useState(form.tags.join(", "));

  const handleImage = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, cover: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <Modal title={initial ? "Edit post" : "New post"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) { toast.error("Title is required"); return; }
          const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
          onSave({ ...form, slug, tags });
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Cover</label>
            <div className="mt-1 aspect-video overflow-hidden rounded-lg border border-border bg-surface">
              <img src={form.cover} alt="" className="h-full w-full object-cover" />
            </div>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-md border border-dashed border-border py-2 text-xs hover:bg-secondary">
              <Upload className="h-3 w-3" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="space-y-3">
            <Field label="Title" required value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Field label="URL slug (auto if blank)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Author" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
              <Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            </div>
            <Field label="Tags (comma separated)" value={tagsInput} onChange={setTagsInput} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Excerpt</span>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Content (plain text — paragraphs separated by blank lines)</span>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
        </label>

        <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO</p>
          <Field label="SEO title" value={form.seoTitle ?? ""} onChange={(v) => setForm({ ...form, seoTitle: v })} />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Meta description</span>
            <textarea value={form.metaDescription ?? ""} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={2} maxLength={160}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
            <span className="mt-1 block text-[10px] text-muted-foreground">{(form.metaDescription ?? "").length}/160</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="premium">{initial ? "Save changes" : "Create post"}</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Reports ---------- */
function ReportsView() {
  const { orders, products } = useAdmin();
  const byStatus = orders.reduce<Record<string, number>>((a, o) => ({ ...a, [o.status]: (a[o.status] ?? 0) + 1 }), {});
  const byCategory = products.reduce<Record<string, number>>((a, p) => ({ ...a, [p.category]: (a[p.category] ?? 0) + 1 }), {});
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ReportCard title="Orders by status" data={byStatus} />
      <ReportCard title="Products by category" data={byCategory} />
    </div>
  );
}

function ReportCard({ title, data }: { title: string; data: Record<string, number> }) {
  const max = Math.max(1, ...Object.values(data));
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm">
        {Object.entries(data).map(([k, v]) => (
          <li key={k}>
            <div className="flex justify-between"><span className="capitalize">{k}</span><span className="font-semibold">{v}</span></div>
            <div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-brand" style={{ width: `${(v / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Settings ---------- */
function SettingsView() {
  const { reset } = useAdmin();
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Store settings</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Store name" defaultValue="PakOvo" onChange={() => {}} value="PakOvo" />
          <Field label="Support email" defaultValue="support@pakovo.com" onChange={() => {}} value="support@pakovo.com" />
          <Field label="Currency" value="PKR (Rs)" onChange={() => {}} />
          <Field label="Default tax rate (%)" type="number" value="7" onChange={() => {}} />
        </div>
        <Button variant="premium" className="mt-4" onClick={() => toast.success("Settings saved")}>Save</Button>
      </div>
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="font-display text-lg font-semibold text-destructive">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">Reset all admin data (products, orders, customers, banners) to the seeded defaults.</p>
        <Button variant="outline" className="mt-4" onClick={() => { if (confirm("Reset all admin data?")) { reset(); toast.success("Admin data reset"); } }}>
          <RefreshCw className="h-4 w-4" /> Reset admin data
        </Button>
      </div>
    </div>
  );
}

/* ---------- Shared bits ---------- */
function Metric({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {delta && <p className="mt-1 text-xs font-semibold text-brand">{delta}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: AdminOrder["status"] }) {
  const map: Record<AdminOrder["status"], string> = {
    Pending: "bg-gold/15 text-gold-foreground",
    Paid: "bg-brand/10 text-brand",
    Fulfilled: "bg-brand/10 text-brand",
    Delivered: "bg-brand/15 text-brand",
    Refunded: "bg-destructive/10 text-destructive",
    Cancelled: "bg-secondary text-muted-foreground",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", map[status])}>{status}</span>;
}

function ToolbarCard({
  title, count, search, actions,
}: { title: string; count?: string; search?: { value: string; onChange: (v: string) => void; placeholder: string }; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {count && <p className="text-xs text-muted-foreground">{count}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {search && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search.value} onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder}
              className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-brand sm:w-64"
            />
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1.5 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, defaultValue }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      <input
        type={type} value={value} defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)} required={required}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-brand">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "ok" | "err" | "warn" }) {
  const toneCls = tone === "ok" ? "bg-brand/10 text-brand" : tone === "err" ? "bg-destructive/10 text-destructive" : "bg-gold/15 text-gold-foreground";
  return (
    <div className={cn("rounded-lg px-3 py-2 text-xs", toneCls)}>
      <p className="font-semibold">{value}</p>
      <p>{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex justify-between gap-3 border-b border-border pb-2"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}

function download(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}