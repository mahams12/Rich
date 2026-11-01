// Worker-safe stub for @grpc/grpc-js and @grpc/proto-loader.
//
// The Node build of @firebase/firestore statically imports both packages, and
// proto-loader evaluates protobufjs `Root.fromJSON` -> `resolveAll` ->
// `new Function` at module-init time. Cloudflare Workers forbid codegen from
// strings, so any SSR chunk containing the Node Firestore build crashes with
// `EvalError` (this is what 500s /blog, /blog/[slug] and /admin/blog).
//
// Both modules are aliased here for every bundle. Firestore only reaches this
// stub through lazy connection setup (loadProtos/newConnection), which never
// runs during SSR — and on clients the browser Firestore build is used anyway.
// If server code ever does invoke it, it fails loudly at call time instead of
// silently poisoning route chunks.
const unavailable = () => {
  throw new Error(
    "@grpc is unavailable in this bundle (Cloudflare Worker forbids proto codegen). " +
      "Firestore must be used through the browser transport.",
  );
};

// A Proxy keeps the stub shape-agnostic: any named import or property access
// resolves to a callable that throws on invocation.
module.exports = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (prop === "__esModule") return true;
      return unavailable;
    },
  },
);
