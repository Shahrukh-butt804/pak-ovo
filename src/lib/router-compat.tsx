import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Link as RRDLink,
  useNavigate as useRRDNavigate,
  useParams as useRRDParams,
  useSearchParams,
  useLocation,
  Outlet,
} from "react-router-dom";

export { Outlet };

// ---------- helpers ----------
function interpolate(to: string, params?: Record<string, string | number | undefined>) {
  if (!params) return to;
  let out = to;
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    out = out.replaceAll(`$${k}`, String(v)).replaceAll(`:${k}`, String(v));
  }
  return out;
}
function qs(search?: Record<string, unknown>) {
  if (!search) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(search)) {
    if (v == null || v === "") continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ---------- Link ----------
// Matches TanStack API surface used in this project: `to`, `params`, `search`.
// Falls through to react-router-dom's Link with an interpolated href.
// Non-link `to` values (used by shadcn's search prop on other components) are guarded upstream.
type LinkProps = React.ComponentProps<typeof RRDLink> & {
  to: string;
  params?: Record<string, string | number | undefined>;
  search?: Record<string, unknown>;
  activeProps?: unknown;
  inactiveProps?: unknown;
  activeOptions?: unknown;
  preload?: unknown;
  from?: unknown;
};
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, params, search, activeProps, inactiveProps, activeOptions, preload, from, ...rest },
  ref,
) {
  const href = interpolate(to, params) + qs(search);
  return <RRDLink ref={ref} to={href} {...rest} />;
});

// ---------- useNavigate ----------
type NavigateArg =
  | string
  | {
      to: string;
      params?: Record<string, string | number | undefined>;
      search?: Record<string, unknown>;
      replace?: boolean;
    };
export function useNavigate() {
  const nav = useRRDNavigate();
  return (arg: NavigateArg) => {
    if (typeof arg === "string") return nav(arg);
    const href = interpolate(arg.to, arg.params) + qs(arg.search);
    nav(href, { replace: arg.replace });
  };
}

// ---------- useRouterState ----------
export function useRouterState<T>({ select }: { select: (s: { location: { pathname: string; search: string; hash: string } }) => T }): T {
  const loc = useLocation();
  return select({ location: { pathname: loc.pathname, search: loc.search, hash: loc.hash } });
}

// ---------- notFound ----------
export class NotFoundError extends Error {
  isNotFound = true;
  constructor() {
    super("Not found");
  }
}
export function notFound() {
  return new NotFoundError();
}

// ---------- Loader data context ----------
const LoaderCtx = createContext<unknown>(null);

// ---------- createFileRoute shim ----------
// Preserves the module shape so route files barely need edits.
// `head()` is ignored here — pages now use react-helmet-async directly (a follow-up
// migration step) or we inject helmet in App wrapper via config.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type RouteConfig<TLoader> = {
  loader?: (ctx: Any) => TLoader | Promise<TLoader>;
  head?: (ctx: Any) => {
    meta?: Array<Any>;
    links?: Array<Any>;
    scripts?: Array<Any>;
  };
  component: React.ComponentType;
  notFoundComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: Error; reset: () => void }>;
  validateSearch?: Any;
  pendingComponent?: React.ComponentType;
};

export type RouteObject<TLoader = unknown> = {
  _config: RouteConfig<TLoader>;
  useLoaderData: () => TLoader;
  useParams: <T = Record<string, string>>() => T;
  useSearch: <T = Any>() => T;
  useRouteContext: () => Record<string, unknown>;
};

export function createFileRoute(_path: string) {
  return function <TLoader>(config: RouteConfig<TLoader>): RouteObject<TLoader> {
    return {
      _config: config,
      useLoaderData: () => useContext(LoaderCtx) as TLoader,
      useParams: <T = Record<string, string>>() => useRRDParams() as T,
      useSearch: <T = Any>() => {
        const [sp] = useSearchParams();
        const obj: Record<string, unknown> = {};
        sp.forEach((v, k) => (obj[k] = v));
        if (config.validateSearch) {
          try {
            const vs: Any = config.validateSearch;
            if (typeof vs === "function") return vs(obj) as T;
            if (vs && typeof vs.parse === "function") return vs.parse(obj) as T;
          } catch {
            return obj as T;
          }
        }
        return obj as T;
      },
      useRouteContext: () => ({}),
    };
  };
}

// ---------- RouteRenderer ----------
// Runs the loader (sync or async) on every param change and provides loader data via context.
export function RouteRenderer<TLoader>({ route }: { route: RouteObject<TLoader> }) {
  const params = useRRDParams() as Record<string, string>;
  const [sp] = useSearchParams();
  const searchObj: Record<string, unknown> = {};
  sp.forEach((v, k) => (searchObj[k] = v));
  const cfg = route._config;

  const [state, setState] = useState<{
    status: "loading" | "ready" | "notFound" | "error";
    data?: TLoader;
    error?: Error;
  }>(() => (cfg.loader ? { status: "loading" } : { status: "ready", data: undefined as TLoader }));

  const key = JSON.stringify(params);
  useEffect(() => {
    if (!cfg.loader) {
      setState({ status: "ready", data: undefined as TLoader });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    Promise.resolve()
      .then(() => cfg.loader!({ params, search: searchObj }))
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((error: Error) => {
        if (cancelled) return;
        if ((error as NotFoundError).isNotFound) setState({ status: "notFound" });
        else setState({ status: "error", error });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (state.status === "loading") {
    const Pending = cfg.pendingComponent;
    return Pending ? <Pending /> : null;
  }
  if (state.status === "notFound") {
    const NF = cfg.notFoundComponent;
    return NF ? <NF /> : <DefaultNotFound />;
  }
  if (state.status === "error") {
    const E = cfg.errorComponent;
    const reset = () => setState({ status: "loading" });
    return E ? <E error={state.error!} reset={reset} /> : <DefaultError error={state.error!} reset={reset} />;
  }
  const Comp = cfg.component;
  return (
    <LoaderCtx.Provider value={state.data}>
      <RouteHead route={route} />
      <ErrorBoundary route={route}>
        <Comp />
      </ErrorBoundary>
    </LoaderCtx.Provider>
  );
}

// Runs a route's head() config through react-helmet-async.
import { Helmet } from "react-helmet-async";
function RouteHead<TLoader>({ route }: { route: RouteObject<TLoader> }) {
  const params = useRRDParams() as Record<string, string>;
  const data = useContext(LoaderCtx) as TLoader | undefined;
  const cfg = route._config;
  if (!cfg.head) return null;
  const head = cfg.head({ params, loaderData: data });
  return (
    <Helmet>
      {head.meta?.map((m, i) => {
        if ("title" in m && m.title) return <title key={`t-${i}`}>{m.title}</title>;
        if ("charSet" in m) return <meta key={`c-${i}`} charSet={m.charSet as string} />;
        return <meta key={`m-${i}`} {...(m as Record<string, string>)} />;
      })}
      {head.links?.map((l, i) => <link key={`l-${i}`} {...l} />)}
    </Helmet>
  );
}

// Simple in-render error boundary for user components that throw notFound() at render time.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ErrorBoundary extends React.Component<
  { route: RouteObject<any>; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    const err = this.state.error;
    if (!err) return this.props.children;
    const cfg = this.props.route._config;
    if ((err as NotFoundError).isNotFound) {
      const NF = cfg.notFoundComponent;
      return NF ? <NF /> : <DefaultNotFound />;
    }
    const E = cfg.errorComponent;
    const reset = () => this.setState({ error: null });
    return E ? <E error={err} reset={reset} /> : <DefaultError error={err} reset={reset} />;
  }
}

function DefaultNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-3 text-muted-foreground">Page not found.</p>
        <RRDLink to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Go home
        </RRDLink>
      </div>
    </div>
  );
}
function DefaultError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Try again
        </button>
      </div>
    </div>
  );
}