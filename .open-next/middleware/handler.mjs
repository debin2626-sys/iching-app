
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.9.16";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__cfc6ad0d._.js
var require_root_of_the_server_cfc6ad0d = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__cfc6ad0d._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__cfc6ad0d._.js", 51615, (e, r, o) => {
      r.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 78500, (e, r, o) => {
      r.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 35825, (e, r, o) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(58217));
      n.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(n, { get(e2, r2) {
        if ("then" === r2) return (r3, o3) => e2.then(r3, o3);
        let o2 = (...o3) => e2.then((e3) => (0, e3[r2])(...o3));
        return o2.then = (o3, n2) => e2.then((e3) => e3[r2]).then(o3, n2), o2;
      } });
    }]);
  }
});

// .next/server/edge/chunks/node_modules_340da56f._.js
var require_node_modules_340da56f = __commonJS({
  ".next/server/edge/chunks/node_modules_340da56f._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/node_modules_340da56f._.js", 28042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, a = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, o = Object.prototype.hasOwnProperty, s = {}, d = { RequestCookies: () => h, ResponseCookies: () => g, parseCookie: () => c, parseSetCookie: () => _, stringifyCookie: () => u };
      for (var l in d) n(s, l, { get: d[l], enumerable: true });
      function u(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function c(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, a2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != a2 ? a2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function _(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = c(e2), { domain: a2, expires: i2, httponly: o2, maxage: s2, path: d2, samesite: l2, secure: u2, partitioned: _2, priority: h2 } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var g2, y, m = { name: t2, value: decodeURIComponent(r2), domain: a2, ...i2 && { expires: new Date(i2) }, ...o2 && { httpOnly: true }, ..."string" == typeof s2 && { maxAge: Number(s2) }, path: d2, ...l2 && { sameSite: p.includes(g2 = (g2 = l2).toLowerCase()) ? g2 : void 0 }, ...u2 && { secure: true }, ...h2 && { priority: f.includes(y = (y = h2).toLowerCase()) ? y : void 0 }, ..._2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in m) m[t3] && (e3[t3] = m[t3]);
          return e3;
        }
      }
      t.exports = ((e2, t2, r2, s2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let d2 of i(t2)) o.call(e2, d2) || d2 === r2 || n(e2, d2, { get: () => t2[d2], enumerable: !(s2 = a(t2, d2)) || s2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), s);
      var p = ["strict", "lax", "none"], f = ["low", "medium", "high"], h = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const t2 = e2.get("cookie");
          if (t2) for (const [e3, r2] of c(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => u(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => u(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, g = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const a2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (const e3 of Array.isArray(a2) ? a2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, a3, i2, o2 = [], s2 = 0;
            function d2() {
              for (; s2 < e4.length && /\s/.test(e4.charAt(s2)); ) s2 += 1;
              return s2 < e4.length;
            }
            for (; s2 < e4.length; ) {
              for (t3 = s2, i2 = false; d2(); ) if ("," === (r3 = e4.charAt(s2))) {
                for (n3 = s2, s2 += 1, d2(), a3 = s2; s2 < e4.length && "=" !== (r3 = e4.charAt(s2)) && ";" !== r3 && "," !== r3; ) s2 += 1;
                s2 < e4.length && "=" === e4.charAt(s2) ? (i2 = true, s2 = a3, o2.push(e4.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
              } else s2 += 1;
              (!i2 || s2 >= e4.length) && o2.push(e4.substring(t3, e4.length));
            }
            return o2;
          }(a2)) {
            const t3 = _(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, a2 = this._parsed;
          return a2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = u(r3);
              t3.append("set-cookie", e4);
            }
          }(a2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(u).join("; ");
        }
      };
    }, 59110, (e, t, r) => {
      (() => {
        "use strict";
        let r2, n, a, i, o;
        var s, d, l, u, c, _, p, f, h, g, y, m, w, v, b, S, x = { 491: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ContextAPI = void 0;
          let n2 = r3(223), a2 = r3(172), i2 = r3(930), o2 = "context", s2 = new n2.NoopContextManager();
          class d2 {
            static getInstance() {
              return this._instance || (this._instance = new d2()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, a2.registerGlobal)(o2, e3, i2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t3, r4, ...n3) {
              return this._getContextManager().with(e3, t3, r4, ...n3);
            }
            bind(e3, t3) {
              return this._getContextManager().bind(e3, t3);
            }
            _getContextManager() {
              return (0, a2.getGlobal)(o2) || s2;
            }
            disable() {
              this._getContextManager().disable(), (0, a2.unregisterGlobal)(o2, i2.DiagAPI.instance());
            }
          }
          t2.ContextAPI = d2;
        }, 930: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagAPI = void 0;
          let n2 = r3(56), a2 = r3(912), i2 = r3(957), o2 = r3(172);
          class s2 {
            constructor() {
              function e3(e4) {
                return function(...t4) {
                  let r4 = (0, o2.getGlobal)("diag");
                  if (r4) return r4[e4](...t4);
                };
              }
              const t3 = this;
              t3.setLogger = (e4, r4 = { logLevel: i2.DiagLogLevel.INFO }) => {
                var n3, s3, d2;
                if (e4 === t3) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t3.error(null != (n3 = e5.stack) ? n3 : e5.message), false;
                }
                "number" == typeof r4 && (r4 = { logLevel: r4 });
                let l2 = (0, o2.getGlobal)("diag"), u2 = (0, a2.createLogLevelDiagLogger)(null != (s3 = r4.logLevel) ? s3 : i2.DiagLogLevel.INFO, e4);
                if (l2 && !r4.suppressOverrideMessage) {
                  let e5 = null != (d2 = Error().stack) ? d2 : "<failed to generate stacktrace>";
                  l2.warn(`Current logger will be overwritten from ${e5}`), u2.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, o2.registerGlobal)("diag", u2, t3, true);
              }, t3.disable = () => {
                (0, o2.unregisterGlobal)("diag", t3);
              }, t3.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t3.verbose = e3("verbose"), t3.debug = e3("debug"), t3.info = e3("info"), t3.warn = e3("warn"), t3.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new s2()), this._instance;
            }
          }
          t2.DiagAPI = s2;
        }, 653: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.MetricsAPI = void 0;
          let n2 = r3(660), a2 = r3(172), i2 = r3(930), o2 = "metrics";
          class s2 {
            static getInstance() {
              return this._instance || (this._instance = new s2()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, a2.registerGlobal)(o2, e3, i2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, a2.getGlobal)(o2) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t3, r4) {
              return this.getMeterProvider().getMeter(e3, t3, r4);
            }
            disable() {
              (0, a2.unregisterGlobal)(o2, i2.DiagAPI.instance());
            }
          }
          t2.MetricsAPI = s2;
        }, 181: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.PropagationAPI = void 0;
          let n2 = r3(172), a2 = r3(874), i2 = r3(194), o2 = r3(277), s2 = r3(369), d2 = r3(930), l2 = "propagation", u2 = new a2.NoopTextMapPropagator();
          class c2 {
            constructor() {
              this.createBaggage = s2.createBaggage, this.getBaggage = o2.getBaggage, this.getActiveBaggage = o2.getActiveBaggage, this.setBaggage = o2.setBaggage, this.deleteBaggage = o2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new c2()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(l2, e3, d2.DiagAPI.instance());
            }
            inject(e3, t3, r4 = i2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t3, r4);
            }
            extract(e3, t3, r4 = i2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t3, r4);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(l2, d2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(l2) || u2;
            }
          }
          t2.PropagationAPI = c2;
        }, 997: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceAPI = void 0;
          let n2 = r3(172), a2 = r3(846), i2 = r3(139), o2 = r3(607), s2 = r3(930), d2 = "trace";
          class l2 {
            constructor() {
              this._proxyTracerProvider = new a2.ProxyTracerProvider(), this.wrapSpanContext = i2.wrapSpanContext, this.isSpanContextValid = i2.isSpanContextValid, this.deleteSpan = o2.deleteSpan, this.getSpan = o2.getSpan, this.getActiveSpan = o2.getActiveSpan, this.getSpanContext = o2.getSpanContext, this.setSpan = o2.setSpan, this.setSpanContext = o2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new l2()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t3 = (0, n2.registerGlobal)(d2, this._proxyTracerProvider, s2.DiagAPI.instance());
              return t3 && this._proxyTracerProvider.setDelegate(e3), t3;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(d2) || this._proxyTracerProvider;
            }
            getTracer(e3, t3) {
              return this.getTracerProvider().getTracer(e3, t3);
            }
            disable() {
              (0, n2.unregisterGlobal)(d2, s2.DiagAPI.instance()), this._proxyTracerProvider = new a2.ProxyTracerProvider();
            }
          }
          t2.TraceAPI = l2;
        }, 277: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.deleteBaggage = t2.setBaggage = t2.getActiveBaggage = t2.getBaggage = void 0;
          let n2 = r3(491), a2 = (0, r3(780).createContextKey)("OpenTelemetry Baggage Key");
          function i2(e3) {
            return e3.getValue(a2) || void 0;
          }
          t2.getBaggage = i2, t2.getActiveBaggage = function() {
            return i2(n2.ContextAPI.getInstance().active());
          }, t2.setBaggage = function(e3, t3) {
            return e3.setValue(a2, t3);
          }, t2.deleteBaggage = function(e3) {
            return e3.deleteValue(a2);
          };
        }, 993: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.BaggageImpl = void 0;
          class r3 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t3 = this._entries.get(e3);
              if (t3) return Object.assign({}, t3);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t3]) => [e3, t3]);
            }
            setEntry(e3, t3) {
              let n2 = new r3(this._entries);
              return n2._entries.set(e3, t3), n2;
            }
            removeEntry(e3) {
              let t3 = new r3(this._entries);
              return t3._entries.delete(e3), t3;
            }
            removeEntries(...e3) {
              let t3 = new r3(this._entries);
              for (let r4 of e3) t3._entries.delete(r4);
              return t3;
            }
            clear() {
              return new r3();
            }
          }
          t2.BaggageImpl = r3;
        }, 830: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataSymbol = void 0, t2.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataFromString = t2.createBaggage = void 0;
          let n2 = r3(930), a2 = r3(993), i2 = r3(830), o2 = n2.DiagAPI.instance();
          t2.createBaggage = function(e3 = {}) {
            return new a2.BaggageImpl(new Map(Object.entries(e3)));
          }, t2.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (o2.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: i2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.context = void 0, t2.context = r3(491).ContextAPI.getInstance();
        }, 223: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopContextManager = void 0;
          let n2 = r3(780);
          t2.NoopContextManager = class {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t3, r4, ...n3) {
              return t3.call(r4, ...n3);
            }
            bind(e3, t3) {
              return t3;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          };
        }, 780: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ROOT_CONTEXT = t2.createContextKey = void 0, t2.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r3 {
            constructor(e3) {
              const t3 = this;
              t3._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t3.getValue = (e4) => t3._currentContext.get(e4), t3.setValue = (e4, n2) => {
                let a2 = new r3(t3._currentContext);
                return a2._currentContext.set(e4, n2), a2;
              }, t3.deleteValue = (e4) => {
                let n2 = new r3(t3._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t2.ROOT_CONTEXT = new r3();
        }, 506: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.diag = void 0, t2.diag = r3(930).DiagAPI.instance();
        }, 56: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagComponentLogger = void 0;
          let n2 = r3(172);
          function a2(e3, t3, r4) {
            let a3 = (0, n2.getGlobal)("diag");
            if (a3) return r4.unshift(t3), a3[e3](...r4);
          }
          t2.DiagComponentLogger = class {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return a2("debug", this._namespace, e3);
            }
            error(...e3) {
              return a2("error", this._namespace, e3);
            }
            info(...e3) {
              return a2("info", this._namespace, e3);
            }
            warn(...e3) {
              return a2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return a2("verbose", this._namespace, e3);
            }
          };
        }, 972: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagConsoleLogger = void 0;
          let r3 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          t2.DiagConsoleLogger = class {
            constructor() {
              for (let e3 = 0; e3 < r3.length; e3++) this[r3[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t3) {
                  if (console) {
                    let r4 = console[e4];
                    if ("function" != typeof r4 && (r4 = console.log), "function" == typeof r4) return r4.apply(console, t3);
                  }
                };
              }(r3[e3].c);
            }
          };
        }, 912: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createLogLevelDiagLogger = void 0;
          let n2 = r3(957);
          t2.createLogLevelDiagLogger = function(e3, t3) {
            function r4(r5, n3) {
              let a2 = t3[r5];
              return "function" == typeof a2 && e3 >= n3 ? a2.bind(t3) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t3 = t3 || {}, { error: r4("error", n2.DiagLogLevel.ERROR), warn: r4("warn", n2.DiagLogLevel.WARN), info: r4("info", n2.DiagLogLevel.INFO), debug: r4("debug", n2.DiagLogLevel.DEBUG), verbose: r4("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagLogLevel = void 0, (r3 = t2.DiagLogLevel || (t2.DiagLogLevel = {}))[r3.NONE = 0] = "NONE", r3[r3.ERROR = 30] = "ERROR", r3[r3.WARN = 50] = "WARN", r3[r3.INFO = 60] = "INFO", r3[r3.DEBUG = 70] = "DEBUG", r3[r3.VERBOSE = 80] = "VERBOSE", r3[r3.ALL = 9999] = "ALL";
        }, 172: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.unregisterGlobal = t2.getGlobal = t2.registerGlobal = void 0;
          let n2 = r3(200), a2 = r3(521), i2 = r3(130), o2 = a2.VERSION.split(".")[0], s2 = Symbol.for(`opentelemetry.js.api.${o2}`), d2 = n2._globalThis;
          t2.registerGlobal = function(e3, t3, r4, n3 = false) {
            var i3;
            let o3 = d2[s2] = null != (i3 = d2[s2]) ? i3 : { version: a2.VERSION };
            if (!n3 && o3[e3]) {
              let t4 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r4.error(t4.stack || t4.message), false;
            }
            if (o3.version !== a2.VERSION) {
              let t4 = Error(`@opentelemetry/api: Registration of version v${o3.version} for ${e3} does not match previously registered API v${a2.VERSION}`);
              return r4.error(t4.stack || t4.message), false;
            }
            return o3[e3] = t3, r4.debug(`@opentelemetry/api: Registered a global for ${e3} v${a2.VERSION}.`), true;
          }, t2.getGlobal = function(e3) {
            var t3, r4;
            let n3 = null == (t3 = d2[s2]) ? void 0 : t3.version;
            if (n3 && (0, i2.isCompatible)(n3)) return null == (r4 = d2[s2]) ? void 0 : r4[e3];
          }, t2.unregisterGlobal = function(e3, t3) {
            t3.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${a2.VERSION}.`);
            let r4 = d2[s2];
            r4 && delete r4[e3];
          };
        }, 130: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.isCompatible = t2._makeCompatibilityCheck = void 0;
          let n2 = r3(521), a2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function i2(e3) {
            let t3 = /* @__PURE__ */ new Set([e3]), r4 = /* @__PURE__ */ new Set(), n3 = e3.match(a2);
            if (!n3) return () => false;
            let i3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != i3.prerelease) return function(t4) {
              return t4 === e3;
            };
            function o2(e4) {
              return r4.add(e4), false;
            }
            return function(e4) {
              if (t3.has(e4)) return true;
              if (r4.has(e4)) return false;
              let n4 = e4.match(a2);
              if (!n4) return o2(e4);
              let s2 = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              if (null != s2.prerelease || i3.major !== s2.major) return o2(e4);
              if (0 === i3.major) return i3.minor === s2.minor && i3.patch <= s2.patch ? (t3.add(e4), true) : o2(e4);
              return i3.minor <= s2.minor ? (t3.add(e4), true) : o2(e4);
            };
          }
          t2._makeCompatibilityCheck = i2, t2.isCompatible = i2(n2.VERSION);
        }, 886: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.metrics = void 0, t2.metrics = r3(653).MetricsAPI.getInstance();
        }, 901: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ValueType = void 0, (r3 = t2.ValueType || (t2.ValueType = {}))[r3.INT = 0] = "INT", r3[r3.DOUBLE = 1] = "DOUBLE";
        }, 102: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createNoopMeter = t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t2.NOOP_OBSERVABLE_GAUGE_METRIC = t2.NOOP_OBSERVABLE_COUNTER_METRIC = t2.NOOP_UP_DOWN_COUNTER_METRIC = t2.NOOP_HISTOGRAM_METRIC = t2.NOOP_COUNTER_METRIC = t2.NOOP_METER = t2.NoopObservableUpDownCounterMetric = t2.NoopObservableGaugeMetric = t2.NoopObservableCounterMetric = t2.NoopObservableMetric = t2.NoopHistogramMetric = t2.NoopUpDownCounterMetric = t2.NoopCounterMetric = t2.NoopMetric = t2.NoopMeter = void 0;
          class r3 {
            createHistogram(e3, r4) {
              return t2.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r4) {
              return t2.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r4) {
              return t2.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r4) {
              return t2.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t3) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t2.NoopMeter = r3;
          class n2 {
          }
          t2.NoopMetric = n2;
          class a2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopCounterMetric = a2;
          class i2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopUpDownCounterMetric = i2;
          class o2 extends n2 {
            record(e3, t3) {
            }
          }
          t2.NoopHistogramMetric = o2;
          class s2 {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t2.NoopObservableMetric = s2;
          class d2 extends s2 {
          }
          t2.NoopObservableCounterMetric = d2;
          class l2 extends s2 {
          }
          t2.NoopObservableGaugeMetric = l2;
          class u2 extends s2 {
          }
          t2.NoopObservableUpDownCounterMetric = u2, t2.NOOP_METER = new r3(), t2.NOOP_COUNTER_METRIC = new a2(), t2.NOOP_HISTOGRAM_METRIC = new o2(), t2.NOOP_UP_DOWN_COUNTER_METRIC = new i2(), t2.NOOP_OBSERVABLE_COUNTER_METRIC = new d2(), t2.NOOP_OBSERVABLE_GAUGE_METRIC = new l2(), t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new u2(), t2.createNoopMeter = function() {
            return t2.NOOP_METER;
          };
        }, 660: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NOOP_METER_PROVIDER = t2.NoopMeterProvider = void 0;
          let n2 = r3(102);
          class a2 {
            getMeter(e3, t3, r4) {
              return n2.NOOP_METER;
            }
          }
          t2.NoopMeterProvider = a2, t2.NOOP_METER_PROVIDER = new a2();
        }, 200: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), a2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), a2(r3(46), t2);
        }, 651: (t2, r3) => {
          Object.defineProperty(r3, "__esModule", { value: true }), r3._globalThis = void 0, r3._globalThis = "object" == typeof globalThis ? globalThis : e.g;
        }, 46: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), a2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), a2(r3(651), t2);
        }, 939: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.propagation = void 0, t2.propagation = r3(181).PropagationAPI.getInstance();
        }, 874: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTextMapPropagator = void 0, t2.NoopTextMapPropagator = class {
            inject(e3, t3) {
            }
            extract(e3, t3) {
              return e3;
            }
            fields() {
              return [];
            }
          };
        }, 194: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.defaultTextMapSetter = t2.defaultTextMapGetter = void 0, t2.defaultTextMapGetter = { get(e3, t3) {
            if (null != e3) return e3[t3];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t2.defaultTextMapSetter = { set(e3, t3, r3) {
            null != e3 && (e3[t3] = r3);
          } };
        }, 845: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.trace = void 0, t2.trace = r3(997).TraceAPI.getInstance();
        }, 403: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NonRecordingSpan = void 0;
          let n2 = r3(476);
          t2.NonRecordingSpan = class {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t3) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t3) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t3) {
            }
          };
        }, 614: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracer = void 0;
          let n2 = r3(491), a2 = r3(607), i2 = r3(403), o2 = r3(139), s2 = n2.ContextAPI.getInstance();
          t2.NoopTracer = class {
            startSpan(e3, t3, r4 = s2.active()) {
              var n3;
              if (null == t3 ? void 0 : t3.root) return new i2.NonRecordingSpan();
              let d2 = r4 && (0, a2.getSpanContext)(r4);
              return "object" == typeof (n3 = d2) && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, o2.isSpanContextValid)(d2) ? new i2.NonRecordingSpan(d2) : new i2.NonRecordingSpan();
            }
            startActiveSpan(e3, t3, r4, n3) {
              let i3, o3, d2;
              if (arguments.length < 2) return;
              2 == arguments.length ? d2 = t3 : 3 == arguments.length ? (i3 = t3, d2 = r4) : (i3 = t3, o3 = r4, d2 = n3);
              let l2 = null != o3 ? o3 : s2.active(), u2 = this.startSpan(e3, i3, l2), c2 = (0, a2.setSpan)(l2, u2);
              return s2.with(c2, d2, void 0, u2);
            }
          };
        }, 124: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracerProvider = void 0;
          let n2 = r3(614);
          t2.NoopTracerProvider = class {
            getTracer(e3, t3, r4) {
              return new n2.NoopTracer();
            }
          };
        }, 125: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracer = void 0;
          let n2 = new (r3(614)).NoopTracer();
          t2.ProxyTracer = class {
            constructor(e3, t3, r4, n3) {
              this._provider = e3, this.name = t3, this.version = r4, this.options = n3;
            }
            startSpan(e3, t3, r4) {
              return this._getTracer().startSpan(e3, t3, r4);
            }
            startActiveSpan(e3, t3, r4, n3) {
              let a2 = this._getTracer();
              return Reflect.apply(a2.startActiveSpan, a2, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          };
        }, 846: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracerProvider = void 0;
          let n2 = r3(125), a2 = new (r3(124)).NoopTracerProvider();
          t2.ProxyTracerProvider = class {
            getTracer(e3, t3, r4) {
              var a3;
              return null != (a3 = this.getDelegateTracer(e3, t3, r4)) ? a3 : new n2.ProxyTracer(this, e3, t3, r4);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : a2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t3, r4) {
              var n3;
              return null == (n3 = this._delegate) ? void 0 : n3.getTracer(e3, t3, r4);
            }
          };
        }, 996: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SamplingDecision = void 0, (r3 = t2.SamplingDecision || (t2.SamplingDecision = {}))[r3.NOT_RECORD = 0] = "NOT_RECORD", r3[r3.RECORD = 1] = "RECORD", r3[r3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 607: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.getSpanContext = t2.setSpanContext = t2.deleteSpan = t2.setSpan = t2.getActiveSpan = t2.getSpan = void 0;
          let n2 = r3(780), a2 = r3(403), i2 = r3(491), o2 = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function s2(e3) {
            return e3.getValue(o2) || void 0;
          }
          function d2(e3, t3) {
            return e3.setValue(o2, t3);
          }
          t2.getSpan = s2, t2.getActiveSpan = function() {
            return s2(i2.ContextAPI.getInstance().active());
          }, t2.setSpan = d2, t2.deleteSpan = function(e3) {
            return e3.deleteValue(o2);
          }, t2.setSpanContext = function(e3, t3) {
            return d2(e3, new a2.NonRecordingSpan(t3));
          }, t2.getSpanContext = function(e3) {
            var t3;
            return null == (t3 = s2(e3)) ? void 0 : t3.spanContext();
          };
        }, 325: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceStateImpl = void 0;
          let n2 = r3(564);
          class a2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t3) {
              let r4 = this._clone();
              return r4._internalState.has(e3) && r4._internalState.delete(e3), r4._internalState.set(e3, t3), r4;
            }
            unset(e3) {
              let t3 = this._clone();
              return t3._internalState.delete(e3), t3;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t3) => (e3.push(t3 + "=" + this.get(t3)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t3) => {
                let r4 = t3.trim(), a3 = r4.indexOf("=");
                if (-1 !== a3) {
                  let i2 = r4.slice(0, a3), o2 = r4.slice(a3 + 1, t3.length);
                  (0, n2.validateKey)(i2) && (0, n2.validateValue)(o2) && e4.set(i2, o2);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new a2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t2.TraceStateImpl = a2;
        }, 564: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.validateValue = t2.validateKey = void 0;
          let r3 = "[_0-9a-z-*/]", n2 = `[a-z]${r3}{0,255}`, a2 = `[a-z0-9]${r3}{0,240}@[a-z]${r3}{0,13}`, i2 = RegExp(`^(?:${n2}|${a2})$`), o2 = /^[ -~]{0,255}[!-~]$/, s2 = /,|=/;
          t2.validateKey = function(e3) {
            return i2.test(e3);
          }, t2.validateValue = function(e3) {
            return o2.test(e3) && !s2.test(e3);
          };
        }, 98: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createTraceState = void 0;
          let n2 = r3(325);
          t2.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.INVALID_SPAN_CONTEXT = t2.INVALID_TRACEID = t2.INVALID_SPANID = void 0;
          let n2 = r3(475);
          t2.INVALID_SPANID = "0000000000000000", t2.INVALID_TRACEID = "00000000000000000000000000000000", t2.INVALID_SPAN_CONTEXT = { traceId: t2.INVALID_TRACEID, spanId: t2.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanKind = void 0, (r3 = t2.SpanKind || (t2.SpanKind = {}))[r3.INTERNAL = 0] = "INTERNAL", r3[r3.SERVER = 1] = "SERVER", r3[r3.CLIENT = 2] = "CLIENT", r3[r3.PRODUCER = 3] = "PRODUCER", r3[r3.CONSUMER = 4] = "CONSUMER";
        }, 139: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.wrapSpanContext = t2.isSpanContextValid = t2.isValidSpanId = t2.isValidTraceId = void 0;
          let n2 = r3(476), a2 = r3(403), i2 = /^([0-9a-f]{32})$/i, o2 = /^[0-9a-f]{16}$/i;
          function s2(e3) {
            return i2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function d2(e3) {
            return o2.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t2.isValidTraceId = s2, t2.isValidSpanId = d2, t2.isSpanContextValid = function(e3) {
            return s2(e3.traceId) && d2(e3.spanId);
          }, t2.wrapSpanContext = function(e3) {
            return new a2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanStatusCode = void 0, (r3 = t2.SpanStatusCode || (t2.SpanStatusCode = {}))[r3.UNSET = 0] = "UNSET", r3[r3.OK = 1] = "OK", r3[r3.ERROR = 2] = "ERROR";
        }, 475: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceFlags = void 0, (r3 = t2.TraceFlags || (t2.TraceFlags = {}))[r3.NONE = 0] = "NONE", r3[r3.SAMPLED = 1] = "SAMPLED";
        }, 521: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.VERSION = void 0, t2.VERSION = "1.6.0";
        } }, C = {};
        function E(e2) {
          var t2 = C[e2];
          if (void 0 !== t2) return t2.exports;
          var r3 = C[e2] = { exports: {} }, n2 = true;
          try {
            x[e2].call(r3.exports, r3, r3.exports, E), n2 = false;
          } finally {
            n2 && delete C[e2];
          }
          return r3.exports;
        }
        E.ab = "/ROOT/node_modules/next/dist/compiled/@opentelemetry/api/";
        var O = {};
        Object.defineProperty(O, "__esModule", { value: true }), O.trace = O.propagation = O.metrics = O.diag = O.context = O.INVALID_SPAN_CONTEXT = O.INVALID_TRACEID = O.INVALID_SPANID = O.isValidSpanId = O.isValidTraceId = O.isSpanContextValid = O.createTraceState = O.TraceFlags = O.SpanStatusCode = O.SpanKind = O.SamplingDecision = O.ProxyTracerProvider = O.ProxyTracer = O.defaultTextMapSetter = O.defaultTextMapGetter = O.ValueType = O.createNoopMeter = O.DiagLogLevel = O.DiagConsoleLogger = O.ROOT_CONTEXT = O.createContextKey = O.baggageEntryMetadataFromString = void 0, s = E(369), Object.defineProperty(O, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return s.baggageEntryMetadataFromString;
        } }), d = E(780), Object.defineProperty(O, "createContextKey", { enumerable: true, get: function() {
          return d.createContextKey;
        } }), Object.defineProperty(O, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return d.ROOT_CONTEXT;
        } }), l = E(972), Object.defineProperty(O, "DiagConsoleLogger", { enumerable: true, get: function() {
          return l.DiagConsoleLogger;
        } }), u = E(957), Object.defineProperty(O, "DiagLogLevel", { enumerable: true, get: function() {
          return u.DiagLogLevel;
        } }), c = E(102), Object.defineProperty(O, "createNoopMeter", { enumerable: true, get: function() {
          return c.createNoopMeter;
        } }), _ = E(901), Object.defineProperty(O, "ValueType", { enumerable: true, get: function() {
          return _.ValueType;
        } }), p = E(194), Object.defineProperty(O, "defaultTextMapGetter", { enumerable: true, get: function() {
          return p.defaultTextMapGetter;
        } }), Object.defineProperty(O, "defaultTextMapSetter", { enumerable: true, get: function() {
          return p.defaultTextMapSetter;
        } }), f = E(125), Object.defineProperty(O, "ProxyTracer", { enumerable: true, get: function() {
          return f.ProxyTracer;
        } }), h = E(846), Object.defineProperty(O, "ProxyTracerProvider", { enumerable: true, get: function() {
          return h.ProxyTracerProvider;
        } }), g = E(996), Object.defineProperty(O, "SamplingDecision", { enumerable: true, get: function() {
          return g.SamplingDecision;
        } }), y = E(357), Object.defineProperty(O, "SpanKind", { enumerable: true, get: function() {
          return y.SpanKind;
        } }), m = E(847), Object.defineProperty(O, "SpanStatusCode", { enumerable: true, get: function() {
          return m.SpanStatusCode;
        } }), w = E(475), Object.defineProperty(O, "TraceFlags", { enumerable: true, get: function() {
          return w.TraceFlags;
        } }), v = E(98), Object.defineProperty(O, "createTraceState", { enumerable: true, get: function() {
          return v.createTraceState;
        } }), b = E(139), Object.defineProperty(O, "isSpanContextValid", { enumerable: true, get: function() {
          return b.isSpanContextValid;
        } }), Object.defineProperty(O, "isValidTraceId", { enumerable: true, get: function() {
          return b.isValidTraceId;
        } }), Object.defineProperty(O, "isValidSpanId", { enumerable: true, get: function() {
          return b.isValidSpanId;
        } }), S = E(476), Object.defineProperty(O, "INVALID_SPANID", { enumerable: true, get: function() {
          return S.INVALID_SPANID;
        } }), Object.defineProperty(O, "INVALID_TRACEID", { enumerable: true, get: function() {
          return S.INVALID_TRACEID;
        } }), Object.defineProperty(O, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return S.INVALID_SPAN_CONTEXT;
        } }), r2 = E(67), Object.defineProperty(O, "context", { enumerable: true, get: function() {
          return r2.context;
        } }), n = E(506), Object.defineProperty(O, "diag", { enumerable: true, get: function() {
          return n.diag;
        } }), a = E(886), Object.defineProperty(O, "metrics", { enumerable: true, get: function() {
          return a.metrics;
        } }), i = E(939), Object.defineProperty(O, "propagation", { enumerable: true, get: function() {
          return i.propagation;
        } }), o = E(845), Object.defineProperty(O, "trace", { enumerable: true, get: function() {
          return o.trace;
        } }), O.default = { context: r2.context, diag: n.diag, metrics: a.metrics, propagation: i.propagation, trace: o.trace }, t.exports = O;
      })();
    }, 41424, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2, r2, n, a, i = {};
        i.parse = function(t2, r3) {
          if ("string" != typeof t2) throw TypeError("argument str must be a string");
          for (var a2 = {}, i2 = t2.split(n), o = (r3 || {}).decode || e2, s = 0; s < i2.length; s++) {
            var d = i2[s], l = d.indexOf("=");
            if (!(l < 0)) {
              var u = d.substr(0, l).trim(), c = d.substr(++l, d.length).trim();
              '"' == c[0] && (c = c.slice(1, -1)), void 0 == a2[u] && (a2[u] = function(e3, t3) {
                try {
                  return t3(e3);
                } catch (t4) {
                  return e3;
                }
              }(c, o));
            }
          }
          return a2;
        }, i.serialize = function(e3, t2, n2) {
          var i2 = n2 || {}, o = i2.encode || r2;
          if ("function" != typeof o) throw TypeError("option encode is invalid");
          if (!a.test(e3)) throw TypeError("argument name is invalid");
          var s = o(t2);
          if (s && !a.test(s)) throw TypeError("argument val is invalid");
          var d = e3 + "=" + s;
          if (null != i2.maxAge) {
            var l = i2.maxAge - 0;
            if (isNaN(l) || !isFinite(l)) throw TypeError("option maxAge is invalid");
            d += "; Max-Age=" + Math.floor(l);
          }
          if (i2.domain) {
            if (!a.test(i2.domain)) throw TypeError("option domain is invalid");
            d += "; Domain=" + i2.domain;
          }
          if (i2.path) {
            if (!a.test(i2.path)) throw TypeError("option path is invalid");
            d += "; Path=" + i2.path;
          }
          if (i2.expires) {
            if ("function" != typeof i2.expires.toUTCString) throw TypeError("option expires is invalid");
            d += "; Expires=" + i2.expires.toUTCString();
          }
          if (i2.httpOnly && (d += "; HttpOnly"), i2.secure && (d += "; Secure"), i2.sameSite) switch ("string" == typeof i2.sameSite ? i2.sameSite.toLowerCase() : i2.sameSite) {
            case true:
            case "strict":
              d += "; SameSite=Strict";
              break;
            case "lax":
              d += "; SameSite=Lax";
              break;
            case "none":
              d += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return d;
        }, e2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, a = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, t.exports = i;
      })();
    }, 99734, (e, t, r) => {
      (() => {
        "use strict";
        let e2, r2, n, a, i;
        var o = { 993: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function a2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function i2(e4, t3, n3, i3, o3) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var s3 = new a2(n3, i3 || e4, o3), d2 = r3 ? r3 + t3 : t3;
            return e4._events[d2] ? e4._events[d2].fn ? e4._events[d2] = [e4._events[d2], s3] : e4._events[d2].push(s3) : (e4._events[d2] = s3, e4._eventsCount++), e4;
          }
          function o2(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function s2() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), s2.prototype.eventNames = function() {
            var e4, n3, a3 = [];
            if (0 === this._eventsCount) return a3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && a3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? a3.concat(Object.getOwnPropertySymbols(e4)) : a3;
          }, s2.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var a3 = 0, i3 = n3.length, o3 = Array(i3); a3 < i3; a3++) o3[a3] = n3[a3].fn;
            return o3;
          }, s2.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, s2.prototype.emit = function(e4, t3, n3, a3, i3, o3) {
            var s3 = r3 ? r3 + e4 : e4;
            if (!this._events[s3]) return false;
            var d2, l2, u = this._events[s3], c = arguments.length;
            if (u.fn) {
              switch (u.once && this.removeListener(e4, u.fn, void 0, true), c) {
                case 1:
                  return u.fn.call(u.context), true;
                case 2:
                  return u.fn.call(u.context, t3), true;
                case 3:
                  return u.fn.call(u.context, t3, n3), true;
                case 4:
                  return u.fn.call(u.context, t3, n3, a3), true;
                case 5:
                  return u.fn.call(u.context, t3, n3, a3, i3), true;
                case 6:
                  return u.fn.call(u.context, t3, n3, a3, i3, o3), true;
              }
              for (l2 = 1, d2 = Array(c - 1); l2 < c; l2++) d2[l2 - 1] = arguments[l2];
              u.fn.apply(u.context, d2);
            } else {
              var _, p = u.length;
              for (l2 = 0; l2 < p; l2++) switch (u[l2].once && this.removeListener(e4, u[l2].fn, void 0, true), c) {
                case 1:
                  u[l2].fn.call(u[l2].context);
                  break;
                case 2:
                  u[l2].fn.call(u[l2].context, t3);
                  break;
                case 3:
                  u[l2].fn.call(u[l2].context, t3, n3);
                  break;
                case 4:
                  u[l2].fn.call(u[l2].context, t3, n3, a3);
                  break;
                default:
                  if (!d2) for (_ = 1, d2 = Array(c - 1); _ < c; _++) d2[_ - 1] = arguments[_];
                  u[l2].fn.apply(u[l2].context, d2);
              }
            }
            return true;
          }, s2.prototype.on = function(e4, t3, r4) {
            return i2(this, e4, t3, r4, false);
          }, s2.prototype.once = function(e4, t3, r4) {
            return i2(this, e4, t3, r4, true);
          }, s2.prototype.removeListener = function(e4, t3, n3, a3) {
            var i3 = r3 ? r3 + e4 : e4;
            if (!this._events[i3]) return this;
            if (!t3) return o2(this, i3), this;
            var s3 = this._events[i3];
            if (s3.fn) s3.fn !== t3 || a3 && !s3.once || n3 && s3.context !== n3 || o2(this, i3);
            else {
              for (var d2 = 0, l2 = [], u = s3.length; d2 < u; d2++) (s3[d2].fn !== t3 || a3 && !s3[d2].once || n3 && s3[d2].context !== n3) && l2.push(s3[d2]);
              l2.length ? this._events[i3] = 1 === l2.length ? l2[0] : l2 : o2(this, i3);
            }
            return this;
          }, s2.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && o2(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, s2.prototype.off = s2.prototype.removeListener, s2.prototype.addListener = s2.prototype.on, s2.prefixed = r3, s2.EventEmitter = s2, e3.exports = s2;
        }, 213: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 574: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, a2 = e4.length;
            for (; a2 > 0; ) {
              let i2 = a2 / 2 | 0, o2 = n2 + i2;
              0 >= r3(e4[o2], t3) ? (n2 = ++o2, a2 -= i2 + 1) : a2 = i2;
            }
            return n2;
          };
        }, 821: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(574);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let a2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(a2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 816: (e3, t2, r3) => {
          let n2 = r3(213);
          class a2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let i2 = (e4, t3, r4) => new Promise((i3, o2) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void i3(e4);
            let s2 = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  i3(r4());
                } catch (e5) {
                  o2(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, s3 = r4 instanceof Error ? r4 : new a2(n3);
              "function" == typeof e4.cancel && e4.cancel(), o2(s3);
            }, t3);
            n2(e4.then(i3, o2), () => {
              clearTimeout(s2);
            });
          });
          e3.exports = i2, e3.exports.default = i2, e3.exports.TimeoutError = a2;
        } }, s = {};
        function d(e3) {
          var t2 = s[e3];
          if (void 0 !== t2) return t2.exports;
          var r3 = s[e3] = { exports: {} }, n2 = true;
          try {
            o[e3](r3, r3.exports, d), n2 = false;
          } finally {
            n2 && delete s[e3];
          }
          return r3.exports;
        }
        d.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var l = {};
        Object.defineProperty(l, "__esModule", { value: true }), e2 = d(993), r2 = d(816), n = d(821), a = () => {
        }, i = new r2.TimeoutError(), l.default = class extends e2 {
          constructor(e3) {
            var t2, r3, i2, o2;
            if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = a, this._resolveIdle = a, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: n.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (r3 = null == (t2 = e3.intervalCap) ? void 0 : t2.toString()) ? r3 : ""}\` (${typeof e3.intervalCap})`);
            if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (o2 = null == (i2 = e3.interval) ? void 0 : i2.toString()) ? o2 : ""}\` (${typeof e3.interval})`);
            this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
          }
          get _doesIntervalAllowAnother() {
            return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
          }
          get _doesConcurrentAllowAnother() {
            return this._pendingCount < this._concurrency;
          }
          _next() {
            this._pendingCount--, this._tryToStartAnother(), this.emit("next");
          }
          _resolvePromises() {
            this._resolveEmpty(), this._resolveEmpty = a, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = a, this.emit("idle"));
          }
          _onResumeInterval() {
            this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
          }
          _isIntervalPaused() {
            let e3 = Date.now();
            if (void 0 === this._intervalId) {
              let t2 = this._intervalEnd - e3;
              if (!(t2 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, t2)), true;
              this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            }
            return false;
          }
          _tryToStartAnother() {
            if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
            if (!this._isPaused) {
              let e3 = !this._isIntervalPaused();
              if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                let t2 = this._queue.dequeue();
                return !!t2 && (this.emit("active"), t2(), e3 && this._initializeIntervalIfNeeded(), true);
              }
            }
            return false;
          }
          _initializeIntervalIfNeeded() {
            this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
              this._onInterval();
            }, this._interval), this._intervalEnd = Date.now() + this._interval);
          }
          _onInterval() {
            0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
          }
          _processQueue() {
            for (; this._tryToStartAnother(); ) ;
          }
          get concurrency() {
            return this._concurrency;
          }
          set concurrency(e3) {
            if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
            this._concurrency = e3, this._processQueue();
          }
          async add(e3, t2 = {}) {
            return new Promise((n2, a2) => {
              let o2 = async () => {
                this._pendingCount++, this._intervalCount++;
                try {
                  let o3 = void 0 === this._timeout && void 0 === t2.timeout ? e3() : r2.default(Promise.resolve(e3()), void 0 === t2.timeout ? this._timeout : t2.timeout, () => {
                    (void 0 === t2.throwOnTimeout ? this._throwOnTimeout : t2.throwOnTimeout) && a2(i);
                  });
                  n2(await o3);
                } catch (e4) {
                  a2(e4);
                }
                this._next();
              };
              this._queue.enqueue(o2, t2), this._tryToStartAnother(), this.emit("add");
            });
          }
          async addAll(e3, t2) {
            return Promise.all(e3.map(async (e4) => this.add(e4, t2)));
          }
          start() {
            return this._isPaused && (this._isPaused = false, this._processQueue()), this;
          }
          pause() {
            this._isPaused = true;
          }
          clear() {
            this._queue = new this._queueClass();
          }
          async onEmpty() {
            if (0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveEmpty;
              this._resolveEmpty = () => {
                t2(), e3();
              };
            });
          }
          async onIdle() {
            if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveIdle;
              this._resolveIdle = () => {
                t2(), e3();
              };
            });
          }
          get size() {
            return this._queue.size;
          }
          sizeBy(e3) {
            return this._queue.filter(e3).length;
          }
          get pending() {
            return this._pendingCount;
          }
          get isPaused() {
            return this._isPaused;
          }
          get timeout() {
            return this._timeout;
          }
          set timeout(e3) {
            this._timeout = e3;
          }
        }, t.exports = l;
      })();
    }, 25085, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { getTestReqInfo: function() {
        return d;
      }, withRequest: function() {
        return s;
      } };
      for (var a in n) Object.defineProperty(r, a, { enumerable: true, get: n[a] });
      let i = new (e.r(78500)).AsyncLocalStorage();
      function o(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function s(e2, t2, r2) {
        let n2 = o(e2, t2);
        return n2 ? i.run(n2, r2) : r2();
      }
      function d(e2, t2) {
        let r2 = i.getStore();
        return r2 || (e2 && t2 ? o(e2, t2) : void 0);
      }
    }, 28325, (e, t, r) => {
      "use strict";
      var n = e.i(51615);
      Object.defineProperty(r, "__esModule", { value: true });
      var a = { handleFetch: function() {
        return l;
      }, interceptFetch: function() {
        return u;
      }, reader: function() {
        return s;
      } };
      for (var i in a) Object.defineProperty(r, i, { enumerable: true, get: a[i] });
      let o = e.r(25085), s = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function d(e2, t2) {
        let { url: r2, method: a2, headers: i2, body: o2, cache: s2, credentials: d2, integrity: l2, mode: u2, redirect: c, referrer: _, referrerPolicy: p } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: a2, headers: [...Array.from(i2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: o2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: s2, credentials: d2, integrity: l2, mode: u2, redirect: c, referrer: _, referrerPolicy: p } };
      }
      async function l(e2, t2) {
        let r2 = (0, o.getTestReqInfo)(t2, s);
        if (!r2) return e2(t2);
        let { testData: a2, proxyPort: i2 } = r2, l2 = await d(a2, t2), u2 = await e2(`http://localhost:${i2}`, { method: "POST", body: JSON.stringify(l2), next: { internal: true } });
        if (!u2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${u2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let c = await u2.json(), { api: _ } = c;
        switch (_) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(e3) {
              let { status: t3, headers: r3, body: a3 } = e3.response;
              return new Response(a3 ? n.Buffer.from(a3, "base64") : null, { status: t3, headers: new Headers(r3) });
            }(c);
          default:
            return _;
        }
      }
      function u(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : l(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 94165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { interceptTestApis: function() {
        return s;
      }, wrapRequestHandler: function() {
        return d;
      } };
      for (var a in n) Object.defineProperty(r, a, { enumerable: true, get: n[a] });
      let i = e.r(25085), o = e.r(28325);
      function s() {
        return (0, o.interceptFetch)(e.g.fetch);
      }
      function d(e2) {
        return (t2, r2) => (0, i.withRequest)(t2, o.reader, () => e2(t2, r2));
      }
    }, 64445, (e, t, r) => {
      var n = { 226: function(t2, r2) {
        !function(n2, a2) {
          "use strict";
          var i2 = "function", o = "undefined", s = "object", d = "string", l = "major", u = "model", c = "name", _ = "type", p = "vendor", f = "version", h = "architecture", g = "console", y = "mobile", m = "tablet", w = "smarttv", v = "wearable", b = "embedded", S = "Amazon", x = "Apple", C = "ASUS", E = "BlackBerry", O = "Browser", T = "Chrome", R = "Firefox", P = "Google", N = "Huawei", M = "Microsoft", L = "Motorola", I = "Opera", A = "Samsung", k = "Sharp", D = "Sony", j = "Xiaomi", q = "Zebra", B = "Facebook", U = "Chromium OS", G = "Mac OS", V = function(e2, t3) {
            var r3 = {};
            for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r3[n3] = t3[n3].concat(e2[n3]) : r3[n3] = e2[n3];
            return r3;
          }, H = function(e2) {
            for (var t3 = {}, r3 = 0; r3 < e2.length; r3++) t3[e2[r3].toUpperCase()] = e2[r3];
            return t3;
          }, $ = function(e2, t3) {
            return typeof e2 === d && -1 !== K(t3).indexOf(K(e2));
          }, K = function(e2) {
            return e2.toLowerCase();
          }, z = function(e2, t3) {
            if (typeof e2 === d) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === o ? e2 : e2.substring(0, 350);
          }, W = function(e2, t3) {
            for (var r3, n3, a3, o2, d2, l2, u2 = 0; u2 < t3.length && !d2; ) {
              var c2 = t3[u2], _2 = t3[u2 + 1];
              for (r3 = n3 = 0; r3 < c2.length && !d2 && c2[r3]; ) if (d2 = c2[r3++].exec(e2)) for (a3 = 0; a3 < _2.length; a3++) l2 = d2[++n3], typeof (o2 = _2[a3]) === s && o2.length > 0 ? 2 === o2.length ? typeof o2[1] == i2 ? this[o2[0]] = o2[1].call(this, l2) : this[o2[0]] = o2[1] : 3 === o2.length ? typeof o2[1] !== i2 || o2[1].exec && o2[1].test ? this[o2[0]] = l2 ? l2.replace(o2[1], o2[2]) : void 0 : this[o2[0]] = l2 ? o2[1].call(this, l2, o2[2]) : void 0 : 4 === o2.length && (this[o2[0]] = l2 ? o2[3].call(this, l2.replace(o2[1], o2[2])) : void 0) : this[o2] = l2 || void 0;
              u2 += 2;
            }
          }, F = function(e2, t3) {
            for (var r3 in t3) if (typeof t3[r3] === s && t3[r3].length > 0) {
              for (var n3 = 0; n3 < t3[r3].length; n3++) if ($(t3[r3][n3], e2)) return "?" === r3 ? void 0 : r3;
            } else if ($(t3[r3], e2)) return "?" === r3 ? void 0 : r3;
            return e2;
          }, X = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Z = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [c, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [c, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [c, f], [/opios[\/ ]+([\w\.]+)/i], [f, [c, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [c, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [c, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [c, "UC" + O]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [c, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [c, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [c, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [c, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [c, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[c, /(.+)/, "$1 Secure " + O], f], [/\bfocus\/([\w\.]+)/i], [f, [c, R + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [c, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [c, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [c, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [c, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [c, "MIUI " + O]], [/fxios\/([-\w\.]+)/i], [f, [c, R]], [/\bqihu|(qi?ho?o?|360)browser/i], [[c, "360 " + O]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[c, /(.+)/, "$1 " + O], f], [/(comodo_dragon)\/([\w\.]+)/i], [[c, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [c, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [c], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[c, B], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [c, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [c, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [c, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [c, T + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[c, T + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [c, "Android " + O]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [c, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [c, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, c], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [c, [f, F, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [c, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[c, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [c, R + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [c, f], [/(cobalt)\/([\w\.]+)/i], [c, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[h, "amd64"]], [/(ia32(?=;))/i], [[h, K]], [/((?:i[346]|x)86)[;\)]/i], [[h, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[h, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[h, "armhf"]], [/windows (ce|mobile); ppc;/i], [[h, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[h, /ower/, "", K]], [/(sun4\w)[;\)]/i], [[h, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[h, K]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [u, [p, A], [_, m]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [u, [p, A], [_, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [u, [p, x], [_, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [u, [p, x], [_, m]], [/(macintosh);/i], [u, [p, x]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [u, [p, k], [_, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [u, [p, N], [_, m]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [u, [p, N], [_, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[u, /_/g, " "], [p, j], [_, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[u, /_/g, " "], [p, j], [_, m]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [u, [p, "OPPO"], [_, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [u, [p, "Vivo"], [_, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [u, [p, "Realme"], [_, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [u, [p, L], [_, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [u, [p, L], [_, m]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [u, [p, "LG"], [_, m]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [u, [p, "LG"], [_, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [u, [p, "Lenovo"], [_, m]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[u, /_/g, " "], [p, "Nokia"], [_, y]], [/(pixel c)\b/i], [u, [p, P], [_, m]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [u, [p, P], [_, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [u, [p, D], [_, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[u, "Xperia Tablet"], [p, D], [_, m]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [u, [p, "OnePlus"], [_, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [u, [p, S], [_, m]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[u, /(.+)/g, "Fire Phone $1"], [p, S], [_, y]], [/(playbook);[-\w\),; ]+(rim)/i], [u, p, [_, m]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [u, [p, E], [_, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [u, [p, C], [_, m]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [u, [p, C], [_, y]], [/(nexus 9)/i], [u, [p, "HTC"], [_, m]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [p, [u, /_/g, " "], [_, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [u, [p, "Acer"], [_, m]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [u, [p, "Meizu"], [_, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [p, u, [_, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [p, u, [_, m]], [/(surface duo)/i], [u, [p, M], [_, m]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [u, [p, "Fairphone"], [_, y]], [/(u304aa)/i], [u, [p, "AT&T"], [_, y]], [/\bsie-(\w*)/i], [u, [p, "Siemens"], [_, y]], [/\b(rct\w+) b/i], [u, [p, "RCA"], [_, m]], [/\b(venue[\d ]{2,7}) b/i], [u, [p, "Dell"], [_, m]], [/\b(q(?:mv|ta)\w+) b/i], [u, [p, "Verizon"], [_, m]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [u, [p, "Barnes & Noble"], [_, m]], [/\b(tm\d{3}\w+) b/i], [u, [p, "NuVision"], [_, m]], [/\b(k88) b/i], [u, [p, "ZTE"], [_, m]], [/\b(nx\d{3}j) b/i], [u, [p, "ZTE"], [_, y]], [/\b(gen\d{3}) b.+49h/i], [u, [p, "Swiss"], [_, y]], [/\b(zur\d{3}) b/i], [u, [p, "Swiss"], [_, m]], [/\b((zeki)?tb.*\b) b/i], [u, [p, "Zeki"], [_, m]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[p, "Dragon Touch"], u, [_, m]], [/\b(ns-?\w{0,9}) b/i], [u, [p, "Insignia"], [_, m]], [/\b((nxa|next)-?\w{0,9}) b/i], [u, [p, "NextBook"], [_, m]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[p, "Voice"], u, [_, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[p, "LvTel"], u, [_, y]], [/\b(ph-1) /i], [u, [p, "Essential"], [_, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [u, [p, "Envizen"], [_, m]], [/\b(trio[-\w\. ]+) b/i], [u, [p, "MachSpeed"], [_, m]], [/\btu_(1491) b/i], [u, [p, "Rotor"], [_, m]], [/(shield[\w ]+) b/i], [u, [p, "Nvidia"], [_, m]], [/(sprint) (\w+)/i], [p, u, [_, y]], [/(kin\.[onetw]{3})/i], [[u, /\./g, " "], [p, M], [_, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [u, [p, q], [_, m]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [u, [p, q], [_, y]], [/smart-tv.+(samsung)/i], [p, [_, w]], [/hbbtv.+maple;(\d+)/i], [[u, /^/, "SmartTV"], [p, A], [_, w]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[p, "LG"], [_, w]], [/(apple) ?tv/i], [p, [u, x + " TV"], [_, w]], [/crkey/i], [[u, T + "cast"], [p, P], [_, w]], [/droid.+aft(\w)( bui|\))/i], [u, [p, S], [_, w]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [u, [p, k], [_, w]], [/(bravia[\w ]+)( bui|\))/i], [u, [p, D], [_, w]], [/(mitv-\w{5}) bui/i], [u, [p, j], [_, w]], [/Hbbtv.*(technisat) (.*);/i], [p, u, [_, w]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[p, z], [u, z], [_, w]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[_, w]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [p, u, [_, g]], [/droid.+; (shield) bui/i], [u, [p, "Nvidia"], [_, g]], [/(playstation [345portablevi]+)/i], [u, [p, D], [_, g]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [u, [p, M], [_, g]], [/((pebble))app/i], [p, u, [_, v]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [u, [p, x], [_, v]], [/droid.+; (glass) \d/i], [u, [p, P], [_, v]], [/droid.+; (wt63?0{2,3})\)/i], [u, [p, q], [_, v]], [/(quest( 2| pro)?)/i], [u, [p, B], [_, v]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [p, [_, b]], [/(aeobc)\b/i], [u, [p, S], [_, b]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [u, [_, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [u, [_, m]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[_, m]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[_, y]], [/(android[-\w\. ]{0,9});.+buil/i], [u, [p, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [c, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [c, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [c, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, c]], os: [[/microsoft (windows) (vista|xp)/i], [c, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [c, [f, F, X]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[c, "Windows"], [f, F, X]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [c, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[c, G], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, c], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [c, f], [/\(bb(10);/i], [f, [c, E]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [c, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [c, R + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [c, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [c, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [c, T + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[c, U], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [c, f], [/(sunos) ?([\w\.\d]*)/i], [[c, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [c, f]] }, Y = function(e2, t3) {
            if (typeof e2 === s && (t3 = e2, e2 = void 0), !(this instanceof Y)) return new Y(e2, t3).getResult();
            var r3 = typeof n2 !== o && n2.navigator ? n2.navigator : void 0, a3 = e2 || (r3 && r3.userAgent ? r3.userAgent : ""), g2 = r3 && r3.userAgentData ? r3.userAgentData : void 0, w2 = t3 ? V(Z, t3) : Z, v2 = r3 && r3.userAgent == a3;
            return this.getBrowser = function() {
              var e3, t4 = {};
              return t4[c] = void 0, t4[f] = void 0, W.call(t4, a3, w2.browser), t4[l] = typeof (e3 = t4[f]) === d ? e3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, v2 && r3 && r3.brave && typeof r3.brave.isBrave == i2 && (t4[c] = "Brave"), t4;
            }, this.getCPU = function() {
              var e3 = {};
              return e3[h] = void 0, W.call(e3, a3, w2.cpu), e3;
            }, this.getDevice = function() {
              var e3 = {};
              return e3[p] = void 0, e3[u] = void 0, e3[_] = void 0, W.call(e3, a3, w2.device), v2 && !e3[_] && g2 && g2.mobile && (e3[_] = y), v2 && "Macintosh" == e3[u] && r3 && typeof r3.standalone !== o && r3.maxTouchPoints && r3.maxTouchPoints > 2 && (e3[u] = "iPad", e3[_] = m), e3;
            }, this.getEngine = function() {
              var e3 = {};
              return e3[c] = void 0, e3[f] = void 0, W.call(e3, a3, w2.engine), e3;
            }, this.getOS = function() {
              var e3 = {};
              return e3[c] = void 0, e3[f] = void 0, W.call(e3, a3, w2.os), v2 && !e3[c] && g2 && "Unknown" != g2.platform && (e3[c] = g2.platform.replace(/chrome os/i, U).replace(/macos/i, G)), e3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return a3;
            }, this.setUA = function(e3) {
              return a3 = typeof e3 === d && e3.length > 350 ? z(e3, 350) : e3, this;
            }, this.setUA(a3), this;
          };
          if (Y.VERSION = "1.0.35", Y.BROWSER = H([c, f, l]), Y.CPU = H([h]), Y.DEVICE = H([u, p, _, g, y, w, m, v, b]), Y.ENGINE = Y.OS = H([c, f]), typeof r2 !== o) t2.exports && (r2 = t2.exports = Y), r2.UAParser = Y;
          else if (typeof define === i2 && define.amd) e.r, void 0 !== Y && e.v(Y);
          else typeof n2 !== o && (n2.UAParser = Y);
          var J = typeof n2 !== o && (n2.jQuery || n2.Zepto);
          if (J && !J.ua) {
            var Q = new Y();
            J.ua = Q.getResult(), J.ua.get = function() {
              return Q.getUA();
            }, J.ua.set = function(e2) {
              Q.setUA(e2);
              var t3 = Q.getResult();
              for (var r3 in t3) J.ua[r3] = t3[r3];
            };
          }
        }(this);
      } }, a = {};
      function i(e2) {
        var t2 = a[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = a[e2] = { exports: {} }, o = true;
        try {
          n[e2].call(r2.exports, r2, r2.exports, i), o = false;
        } finally {
          o && delete a[e2];
        }
        return r2.exports;
      }
      i.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = i(226);
    }, 8946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function a(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var i = Array.isArray;
      function o() {
      }
      var s = Symbol.for("react.transitional.element"), d = Symbol.for("react.portal"), l = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), _ = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), g = Symbol.for("react.activity"), y = Symbol.for("react.view_transition"), m = Symbol.iterator, w = Object.prototype.hasOwnProperty, v = Object.assign;
      function b(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: s, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function S(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === s;
      }
      var x = /\/+/g;
      function C(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function E(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], l2 = 0;
        return !function e3(t3, r3, n3, l3, u2) {
          var c2, _2, p2, f2 = typeof t3;
          ("undefined" === f2 || "boolean" === f2) && (t3 = null);
          var g2 = false;
          if (null === t3) g2 = true;
          else switch (f2) {
            case "bigint":
            case "string":
            case "number":
              g2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case s:
                case d:
                  g2 = true;
                  break;
                case h:
                  return e3((g2 = t3._init)(t3._payload), r3, n3, l3, u2);
              }
          }
          if (g2) return u2 = u2(t3), g2 = "" === l3 ? "." + C(t3, 0) : l3, i(u2) ? (n3 = "", null != g2 && (n3 = g2.replace(x, "$&/") + "/"), e3(u2, r3, n3, "", function(e4) {
            return e4;
          })) : null != u2 && (S(u2) && (c2 = u2, _2 = n3 + (null == u2.key || t3 && t3.key === u2.key ? "" : ("" + u2.key).replace(x, "$&/") + "/") + g2, u2 = b(c2.type, _2, c2.props)), r3.push(u2)), 1;
          g2 = 0;
          var y2 = "" === l3 ? "." : l3 + ":";
          if (i(t3)) for (var w2 = 0; w2 < t3.length; w2++) f2 = y2 + C(l3 = t3[w2], w2), g2 += e3(l3, r3, n3, f2, u2);
          else if ("function" == typeof (w2 = null === (p2 = t3) || "object" != typeof p2 ? null : "function" == typeof (p2 = m && p2[m] || p2["@@iterator"]) ? p2 : null)) for (t3 = w2.call(t3), w2 = 0; !(l3 = t3.next()).done; ) f2 = y2 + C(l3 = l3.value, w2++), g2 += e3(l3, r3, n3, f2, u2);
          else if ("object" === f2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(o, o) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, l3, u2);
            throw Error(a(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return g2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, l2++);
        }), n2;
      }
      function O(e2) {
        if (-1 === e2._status) {
          var t2 = e2._result;
          (t2 = t2()).then(function(t3) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = t3);
          }, function(t3) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = t3);
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function T() {
        return /* @__PURE__ */ new WeakMap();
      }
      function R() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Activity = g, r.Children = { map: E, forEach: function(e2, t2, r2) {
        E(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return E(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return E(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!S(e2)) throw Error(a(143));
        return e2;
      } }, r.Fragment = l, r.Profiler = c, r.StrictMode = u, r.Suspense = p, r.ViewTransition = y, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(T);
          void 0 === (t2 = r2.get(e2)) && (t2 = R(), r2.set(e2, t2)), r2 = 0;
          for (var a2 = arguments.length; r2 < a2; r2++) {
            var i2 = arguments[r2];
            if ("function" == typeof i2 || "object" == typeof i2 && null !== i2) {
              var o2 = t2.o;
              null === o2 && (t2.o = o2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = o2.get(i2)) && (t2 = R(), o2.set(i2, t2));
            } else null === (o2 = t2.p) && (t2.p = o2 = /* @__PURE__ */ new Map()), void 0 === (t2 = o2.get(i2)) && (t2 = R(), o2.set(i2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var s2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = s2;
          } catch (e3) {
            throw (s2 = t2).s = 2, s2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(a(267, e2));
        var n2 = v({}, e2.props), i2 = e2.key;
        if (null != t2) for (o2 in void 0 !== t2.key && (i2 = "" + t2.key), t2) w.call(t2, o2) && "key" !== o2 && "__self" !== o2 && "__source" !== o2 && ("ref" !== o2 || void 0 !== t2.ref) && (n2[o2] = t2[o2]);
        var o2 = arguments.length - 2;
        if (1 === o2) n2.children = r2;
        else if (1 < o2) {
          for (var s2 = Array(o2), d2 = 0; d2 < o2; d2++) s2[d2] = arguments[d2 + 2];
          n2.children = s2;
        }
        return b(e2.type, i2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, a2 = {}, i2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (i2 = "" + t2.key), t2) w.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (a2[n2] = t2[n2]);
        var o2 = arguments.length - 2;
        if (1 === o2) a2.children = r2;
        else if (1 < o2) {
          for (var s2 = Array(o2), d2 = 0; d2 < o2; d2++) s2[d2] = arguments[d2 + 2];
          a2.children = s2;
        }
        if (e2 && e2.defaultProps) for (n2 in o2 = e2.defaultProps) void 0 === a2[n2] && (a2[n2] = o2[n2]);
        return b(e2, i2, a2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: _, render: e2 };
      }, r.isValidElement = S, r.lazy = function(e2) {
        return { $$typeof: h, _payload: { _status: -1, _result: e2 }, _init: O };
      }, r.memo = function(e2, t2) {
        return { $$typeof: f, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.3.0-canary-f93b9fd4-20251217";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(8946);
    }, 15737, (e, t, r) => {
      "use strict";
      t.exports = a, t.exports.preferredCharsets = a;
      var n = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
      function a(e2, t2) {
        var r2 = function(e3) {
          for (var t3 = e3.split(","), r3 = 0, a3 = 0; r3 < t3.length; r3++) {
            var i2 = function(e4, t4) {
              var r4 = n.exec(e4);
              if (!r4) return null;
              var a4 = r4[1], i3 = 1;
              if (r4[2]) for (var o2 = r4[2].split(";"), s2 = 0; s2 < o2.length; s2++) {
                var d = o2[s2].trim().split("=");
                if ("q" === d[0]) {
                  i3 = parseFloat(d[1]);
                  break;
                }
              }
              return { charset: a4, q: i3, i: t4 };
            }(t3[r3].trim(), r3);
            i2 && (t3[a3++] = i2);
          }
          return t3.length = a3, t3;
        }(void 0 === e2 ? "*" : e2 || "");
        if (!t2) return r2.filter(s).sort(i).map(o);
        var a2 = t2.map(function(e3, t3) {
          for (var n2 = { o: -1, q: 0, s: 0 }, a3 = 0; a3 < r2.length; a3++) {
            var i2 = function(e4, t4, r3) {
              var n3 = 0;
              if (t4.charset.toLowerCase() === e4.toLowerCase()) n3 |= 1;
              else if ("*" !== t4.charset) return null;
              return { i: r3, o: t4.i, q: t4.q, s: n3 };
            }(e3, r2[a3], t3);
            i2 && 0 > (n2.s - i2.s || n2.q - i2.q || n2.o - i2.o) && (n2 = i2);
          }
          return n2;
        });
        return a2.filter(s).sort(i).map(function(e3) {
          return t2[a2.indexOf(e3)];
        });
      }
      function i(e2, t2) {
        return t2.q - e2.q || t2.s - e2.s || e2.o - t2.o || e2.i - t2.i || 0;
      }
      function o(e2) {
        return e2.charset;
      }
      function s(e2) {
        return e2.q > 0;
      }
    }, 27819, (e, t, r) => {
      "use strict";
      t.exports = i, t.exports.preferredEncodings = i;
      var n = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
      function a(e2, t2, r2) {
        var n2 = 0;
        if (t2.encoding.toLowerCase() === e2.toLowerCase()) n2 |= 1;
        else if ("*" !== t2.encoding) return null;
        return { encoding: e2, i: r2, o: t2.i, q: t2.q, s: n2 };
      }
      function i(e2, t2, r2) {
        var i2 = function(e3) {
          for (var t3 = e3.split(","), r3 = false, i3 = 1, o2 = 0, s2 = 0; o2 < t3.length; o2++) {
            var d2 = function(e4, t4) {
              var r4 = n.exec(e4);
              if (!r4) return null;
              var a2 = r4[1], i4 = 1;
              if (r4[2]) for (var o3 = r4[2].split(";"), s3 = 0; s3 < o3.length; s3++) {
                var d3 = o3[s3].trim().split("=");
                if ("q" === d3[0]) {
                  i4 = parseFloat(d3[1]);
                  break;
                }
              }
              return { encoding: a2, q: i4, i: t4 };
            }(t3[o2].trim(), o2);
            d2 && (t3[s2++] = d2, r3 = r3 || a("identity", d2), i3 = Math.min(i3, d2.q || 1));
          }
          return r3 || (t3[s2++] = { encoding: "identity", q: i3, i: o2 }), t3.length = s2, t3;
        }(e2 || ""), l = r2 ? function(e3, t3) {
          if (e3.q !== t3.q) return t3.q - e3.q;
          var n2 = r2.indexOf(e3.encoding), a2 = r2.indexOf(t3.encoding);
          return -1 === n2 && -1 === a2 ? t3.s - e3.s || e3.o - t3.o || e3.i - t3.i : -1 !== n2 && -1 !== a2 ? n2 - a2 : -1 === n2 ? 1 : -1;
        } : o;
        if (!t2) return i2.filter(d).sort(l).map(s);
        var u = t2.map(function(e3, t3) {
          for (var r3 = { encoding: e3, o: -1, q: 0, s: 0 }, n2 = 0; n2 < i2.length; n2++) {
            var o2 = a(e3, i2[n2], t3);
            o2 && 0 > (r3.s - o2.s || r3.q - o2.q || r3.o - o2.o) && (r3 = o2);
          }
          return r3;
        });
        return u.filter(d).sort(l).map(function(e3) {
          return t2[u.indexOf(e3)];
        });
      }
      function o(e2, t2) {
        return t2.q - e2.q || t2.s - e2.s || e2.o - t2.o || e2.i - t2.i;
      }
      function s(e2) {
        return e2.encoding;
      }
      function d(e2) {
        return e2.q > 0;
      }
    }, 1980, (e, t, r) => {
      "use strict";
      t.exports = i, t.exports.preferredLanguages = i;
      var n = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
      function a(e2, t2) {
        var r2 = n.exec(e2);
        if (!r2) return null;
        var a2 = r2[1], i2 = r2[2], o2 = a2;
        i2 && (o2 += "-" + i2);
        var s2 = 1;
        if (r2[3]) for (var d2 = r2[3].split(";"), l = 0; l < d2.length; l++) {
          var u = d2[l].split("=");
          "q" === u[0] && (s2 = parseFloat(u[1]));
        }
        return { prefix: a2, suffix: i2, q: s2, i: t2, full: o2 };
      }
      function i(e2, t2) {
        var r2 = function(e3) {
          for (var t3 = e3.split(","), r3 = 0, n3 = 0; r3 < t3.length; r3++) {
            var i2 = a(t3[r3].trim(), r3);
            i2 && (t3[n3++] = i2);
          }
          return t3.length = n3, t3;
        }(void 0 === e2 ? "*" : e2 || "");
        if (!t2) return r2.filter(d).sort(o).map(s);
        var n2 = t2.map(function(e3, t3) {
          for (var n3 = { o: -1, q: 0, s: 0 }, i2 = 0; i2 < r2.length; i2++) {
            var o2 = function(e4, t4, r3) {
              var n4 = a(e4);
              if (!n4) return null;
              var i3 = 0;
              if (t4.full.toLowerCase() === n4.full.toLowerCase()) i3 |= 4;
              else if (t4.prefix.toLowerCase() === n4.full.toLowerCase()) i3 |= 2;
              else if (t4.full.toLowerCase() === n4.prefix.toLowerCase()) i3 |= 1;
              else if ("*" !== t4.full) return null;
              return { i: r3, o: t4.i, q: t4.q, s: i3 };
            }(e3, r2[i2], t3);
            o2 && 0 > (n3.s - o2.s || n3.q - o2.q || n3.o - o2.o) && (n3 = o2);
          }
          return n3;
        });
        return n2.filter(d).sort(o).map(function(e3) {
          return t2[n2.indexOf(e3)];
        });
      }
      function o(e2, t2) {
        return t2.q - e2.q || t2.s - e2.s || e2.o - t2.o || e2.i - t2.i || 0;
      }
      function s(e2) {
        return e2.full;
      }
      function d(e2) {
        return e2.q > 0;
      }
    }, 84974, (e, t, r) => {
      "use strict";
      t.exports = i, t.exports.preferredMediaTypes = i;
      var n = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;
      function a(e2, t2) {
        var r2 = n.exec(e2);
        if (!r2) return null;
        var a2 = /* @__PURE__ */ Object.create(null), i2 = 1, o2 = r2[2], s2 = r2[1];
        if (r2[3]) for (var d2 = function(e3) {
          for (var t3 = e3.split(";"), r3 = 1, n2 = 0; r3 < t3.length; r3++) l(t3[n2]) % 2 == 0 ? t3[++n2] = t3[r3] : t3[n2] += ";" + t3[r3];
          t3.length = n2 + 1;
          for (var r3 = 0; r3 < t3.length; r3++) t3[r3] = t3[r3].trim();
          return t3;
        }(r2[3]).map(u), c = 0; c < d2.length; c++) {
          var _ = d2[c], p = _[0].toLowerCase(), f = _[1], h = f && '"' === f[0] && '"' === f[f.length - 1] ? f.slice(1, -1) : f;
          if ("q" === p) {
            i2 = parseFloat(h);
            break;
          }
          a2[p] = h;
        }
        return { type: s2, subtype: o2, params: a2, q: i2, i: t2 };
      }
      function i(e2, t2) {
        var r2 = function(e3) {
          for (var t3 = function(e4) {
            for (var t4 = e4.split(","), r4 = 1, n4 = 0; r4 < t4.length; r4++) l(t4[n4]) % 2 == 0 ? t4[++n4] = t4[r4] : t4[n4] += "," + t4[r4];
            return t4.length = n4 + 1, t4;
          }(e3), r3 = 0, n3 = 0; r3 < t3.length; r3++) {
            var i2 = a(t3[r3].trim(), r3);
            i2 && (t3[n3++] = i2);
          }
          return t3.length = n3, t3;
        }(void 0 === e2 ? "*/*" : e2 || "");
        if (!t2) return r2.filter(d).sort(o).map(s);
        var n2 = t2.map(function(e3, t3) {
          for (var n3 = { o: -1, q: 0, s: 0 }, i2 = 0; i2 < r2.length; i2++) {
            var o2 = function(e4, t4, r3) {
              var n4 = a(e4), i3 = 0;
              if (!n4) return null;
              if (t4.type.toLowerCase() == n4.type.toLowerCase()) i3 |= 4;
              else if ("*" != t4.type) return null;
              if (t4.subtype.toLowerCase() == n4.subtype.toLowerCase()) i3 |= 2;
              else if ("*" != t4.subtype) return null;
              var o3 = Object.keys(t4.params);
              if (o3.length > 0) if (!o3.every(function(e5) {
                return "*" == t4.params[e5] || (t4.params[e5] || "").toLowerCase() == (n4.params[e5] || "").toLowerCase();
              })) return null;
              else i3 |= 1;
              return { i: r3, o: t4.i, q: t4.q, s: i3 };
            }(e3, r2[i2], t3);
            o2 && 0 > (n3.s - o2.s || n3.q - o2.q || n3.o - o2.o) && (n3 = o2);
          }
          return n3;
        });
        return n2.filter(d).sort(o).map(function(e3) {
          return t2[n2.indexOf(e3)];
        });
      }
      function o(e2, t2) {
        return t2.q - e2.q || t2.s - e2.s || e2.o - t2.o || e2.i - t2.i || 0;
      }
      function s(e2) {
        return e2.type + "/" + e2.subtype;
      }
      function d(e2) {
        return e2.q > 0;
      }
      function l(e2) {
        for (var t2 = 0, r2 = 0; -1 !== (r2 = e2.indexOf('"', r2)); ) t2++, r2++;
        return t2;
      }
      function u(e2) {
        var t2, r2, n2 = e2.indexOf("=");
        return -1 === n2 ? t2 = e2 : (t2 = e2.slice(0, n2), r2 = e2.slice(n2 + 1)), [t2, r2];
      }
    }, 29300, (e, t, r) => {
      "use strict";
      var n = e.r(15737), a = e.r(27819), i = e.r(1980), o = e.r(84974);
      function s(e2) {
        if (!(this instanceof s)) return new s(e2);
        this.request = e2;
      }
      t.exports = s, t.exports.Negotiator = s, s.prototype.charset = function(e2) {
        var t2 = this.charsets(e2);
        return t2 && t2[0];
      }, s.prototype.charsets = function(e2) {
        return n(this.request.headers["accept-charset"], e2);
      }, s.prototype.encoding = function(e2, t2) {
        var r2 = this.encodings(e2, t2);
        return r2 && r2[0];
      }, s.prototype.encodings = function(e2, t2) {
        return a(this.request.headers["accept-encoding"], e2, (t2 || {}).preferred);
      }, s.prototype.language = function(e2) {
        var t2 = this.languages(e2);
        return t2 && t2[0];
      }, s.prototype.languages = function(e2) {
        return i(this.request.headers["accept-language"], e2);
      }, s.prototype.mediaType = function(e2) {
        var t2 = this.mediaTypes(e2);
        return t2 && t2[0];
      }, s.prototype.mediaTypes = function(e2) {
        return o(this.request.headers.accept, e2);
      }, s.prototype.preferredCharset = s.prototype.charset, s.prototype.preferredCharsets = s.prototype.charsets, s.prototype.preferredEncoding = s.prototype.encoding, s.prototype.preferredEncodings = s.prototype.encodings, s.prototype.preferredLanguage = s.prototype.language, s.prototype.preferredLanguages = s.prototype.languages, s.prototype.preferredMediaType = s.prototype.mediaType, s.prototype.preferredMediaTypes = s.prototype.mediaTypes;
    }, 58217, (e) => {
      "use strict";
      let t, r, n, a, i, o;
      async function s() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      let d = null;
      async function l() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        d || (d = s());
        let e10 = await d;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function u(...e10) {
        let t6 = await s();
        try {
          var r2;
          await (null == t6 || null == (r2 = t6.onRequestError) ? void 0 : r2.call(t6, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let c = null;
      function _() {
        return c || (c = l()), c;
      }
      function p(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t6 = new Proxy(function() {
          }, { get(t7, r2) {
            if ("then" === r2) return {};
            throw Object.defineProperty(Error(p(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(p(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r2, n2, a2) {
            if ("function" == typeof a2[0]) return a2[0](t6);
            throw Object.defineProperty(Error(p(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t6 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      _();
      class f extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class h extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class g extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let y = "_N_T_", m = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function w(e10) {
        var t6, r2, n2, a2, i2, o2 = [], s2 = 0;
        function d2() {
          for (; s2 < e10.length && /\s/.test(e10.charAt(s2)); ) s2 += 1;
          return s2 < e10.length;
        }
        for (; s2 < e10.length; ) {
          for (t6 = s2, i2 = false; d2(); ) if ("," === (r2 = e10.charAt(s2))) {
            for (n2 = s2, s2 += 1, d2(), a2 = s2; s2 < e10.length && "=" !== (r2 = e10.charAt(s2)) && ";" !== r2 && "," !== r2; ) s2 += 1;
            s2 < e10.length && "=" === e10.charAt(s2) ? (i2 = true, s2 = a2, o2.push(e10.substring(t6, n2)), t6 = s2) : s2 = n2 + 1;
          } else s2 += 1;
          (!i2 || s2 >= e10.length) && o2.push(e10.substring(t6, e10.length));
        }
        return o2;
      }
      function v(e10) {
        let t6 = {}, r2 = [];
        if (e10) for (let [n2, a2] of e10.entries()) "set-cookie" === n2.toLowerCase() ? (r2.push(...w(a2)), t6[n2] = 1 === r2.length ? r2[0] : r2) : t6[n2] = a2;
        return t6;
      }
      function b(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t6) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t6 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...m, GROUP: { builtinReact: [m.reactServerComponents, m.actionBrowser], serverOnly: [m.reactServerComponents, m.actionBrowser, m.instrument, m.middleware], neutralTarget: [m.apiNode, m.apiEdge], clientOnly: [m.serverSideRendering, m.appPagesBrowser], bundled: [m.reactServerComponents, m.actionBrowser, m.serverSideRendering, m.appPagesBrowser, m.shared, m.instrument, m.middleware], appPages: [m.reactServerComponents, m.serverSideRendering, m.appPagesBrowser, m.actionBrowser] } });
      let S = Symbol("response"), x = Symbol("passThrough"), C = Symbol("waitUntil");
      class E {
        constructor(e10, t6) {
          this[x] = false, this[C] = t6 ? { kind: "external", function: t6 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[S] || (this[S] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[x] = true;
        }
        waitUntil(e10) {
          if ("external" === this[C].kind) return (0, this[C].function)(e10);
          this[C].promises.push(e10);
        }
      }
      class O extends E {
        constructor(e10) {
          var t6;
          super(e10.request, null == (t6 = e10.context) ? void 0 : t6.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new f({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new f({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function T(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function R(e10) {
        let t6 = e10.indexOf("#"), r2 = e10.indexOf("?"), n2 = r2 > -1 && (t6 < 0 || r2 < t6);
        return n2 || t6 > -1 ? { pathname: e10.substring(0, n2 ? r2 : t6), query: n2 ? e10.substring(r2, t6 > -1 ? t6 : void 0) : "", hash: t6 > -1 ? e10.slice(t6) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function P(e10, t6) {
        if (!e10.startsWith("/") || !t6) return e10;
        let { pathname: r2, query: n2, hash: a2 } = R(e10);
        return `${t6}${r2}${n2}${a2}`;
      }
      function N(e10, t6) {
        if (!e10.startsWith("/") || !t6) return e10;
        let { pathname: r2, query: n2, hash: a2 } = R(e10);
        return `${r2}${t6}${n2}${a2}`;
      }
      function M(e10, t6) {
        if ("string" != typeof e10) return false;
        let { pathname: r2 } = R(e10);
        return r2 === t6 || r2.startsWith(t6 + "/");
      }
      let L = /* @__PURE__ */ new WeakMap();
      function I(e10, t6) {
        let r2;
        if (!t6) return { pathname: e10 };
        let n2 = L.get(t6);
        n2 || (n2 = t6.map((e11) => e11.toLowerCase()), L.set(t6, n2));
        let a2 = e10.split("/", 2);
        if (!a2[1]) return { pathname: e10 };
        let i2 = a2[1].toLowerCase(), o2 = n2.indexOf(i2);
        return o2 < 0 ? { pathname: e10 } : (r2 = t6[o2], { pathname: e10 = e10.slice(r2.length + 1) || "/", detectedLocale: r2 });
      }
      let A = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function k(e10, t6) {
        return new URL(String(e10).replace(A, "localhost"), t6 && String(t6).replace(A, "localhost"));
      }
      let D = Symbol("NextURLInternal");
      class j {
        constructor(e10, t6, r2) {
          let n2, a2;
          "object" == typeof t6 && "pathname" in t6 || "string" == typeof t6 ? (n2 = t6, a2 = r2 || {}) : a2 = r2 || t6 || {}, this[D] = { url: k(e10, n2 ?? a2.base), options: a2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t6, r2, n2, a2;
          let i2 = function(e11, t7) {
            let { basePath: r3, i18n: n3, trailingSlash: a3 } = t7.nextConfig ?? {}, i3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : a3 };
            r3 && M(i3.pathname, r3) && (i3.pathname = function(e12, t8) {
              if (!M(e12, t8)) return e12;
              let r4 = e12.slice(t8.length);
              return r4.startsWith("/") ? r4 : `/${r4}`;
            }(i3.pathname, r3), i3.basePath = r3);
            let o3 = i3.pathname;
            if (i3.pathname.startsWith("/_next/data/") && i3.pathname.endsWith(".json")) {
              let e12 = i3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              i3.buildId = e12[0], o3 = "index" !== e12[1] ? `/${e12.slice(1).join("/")}` : "/", true === t7.parseData && (i3.pathname = o3);
            }
            if (n3) {
              let e12 = t7.i18nProvider ? t7.i18nProvider.analyze(i3.pathname) : I(i3.pathname, n3.locales);
              i3.locale = e12.detectedLocale, i3.pathname = e12.pathname ?? i3.pathname, !e12.detectedLocale && i3.buildId && (e12 = t7.i18nProvider ? t7.i18nProvider.analyze(o3) : I(o3, n3.locales)).detectedLocale && (i3.locale = e12.detectedLocale);
            }
            return i3;
          }(this[D].url.pathname, { nextConfig: this[D].options.nextConfig, parseData: true, i18nProvider: this[D].options.i18nProvider }), o2 = function(e11, t7) {
            let r3;
            if (t7?.host && !Array.isArray(t7.host)) r3 = t7.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r3 = e11.hostname;
            }
            return r3.toLowerCase();
          }(this[D].url, this[D].options.headers);
          this[D].domainLocale = this[D].options.i18nProvider ? this[D].options.i18nProvider.detectDomainLocale(o2) : function(e11, t7, r3) {
            if (e11) {
              for (let n3 of (r3 && (r3 = r3.toLowerCase()), e11)) if (t7 === n3.domain?.split(":", 1)[0].toLowerCase() || r3 === n3.defaultLocale.toLowerCase() || n3.locales?.some((e12) => e12.toLowerCase() === r3)) return n3;
            }
          }(null == (t6 = this[D].options.nextConfig) || null == (e10 = t6.i18n) ? void 0 : e10.domains, o2);
          let s2 = (null == (r2 = this[D].domainLocale) ? void 0 : r2.defaultLocale) || (null == (a2 = this[D].options.nextConfig) || null == (n2 = a2.i18n) ? void 0 : n2.defaultLocale);
          this[D].url.pathname = i2.pathname, this[D].defaultLocale = s2, this[D].basePath = i2.basePath ?? "", this[D].buildId = i2.buildId, this[D].locale = i2.locale ?? s2, this[D].trailingSlash = i2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t6;
          return t6 = function(e11, t7, r2, n2) {
            if (!t7 || t7 === r2) return e11;
            let a2 = e11.toLowerCase();
            return !n2 && (M(a2, "/api") || M(a2, `/${t7.toLowerCase()}`)) ? e11 : P(e11, `/${t7}`);
          }((e10 = { basePath: this[D].basePath, buildId: this[D].buildId, defaultLocale: this[D].options.forceLocale ? void 0 : this[D].defaultLocale, locale: this[D].locale, pathname: this[D].url.pathname, trailingSlash: this[D].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t6 = T(t6)), e10.buildId && (t6 = N(P(t6, `/_next/data/${e10.buildId}`), "/" === e10.pathname ? "index.json" : ".json")), t6 = P(t6, e10.basePath), !e10.buildId && e10.trailingSlash ? t6.endsWith("/") ? t6 : N(t6, "/") : T(t6);
        }
        formatSearch() {
          return this[D].url.search;
        }
        get buildId() {
          return this[D].buildId;
        }
        set buildId(e10) {
          this[D].buildId = e10;
        }
        get locale() {
          return this[D].locale ?? "";
        }
        set locale(e10) {
          var t6, r2;
          if (!this[D].locale || !(null == (r2 = this[D].options.nextConfig) || null == (t6 = r2.i18n) ? void 0 : t6.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[D].locale = e10;
        }
        get defaultLocale() {
          return this[D].defaultLocale;
        }
        get domainLocale() {
          return this[D].domainLocale;
        }
        get searchParams() {
          return this[D].url.searchParams;
        }
        get host() {
          return this[D].url.host;
        }
        set host(e10) {
          this[D].url.host = e10;
        }
        get hostname() {
          return this[D].url.hostname;
        }
        set hostname(e10) {
          this[D].url.hostname = e10;
        }
        get port() {
          return this[D].url.port;
        }
        set port(e10) {
          this[D].url.port = e10;
        }
        get protocol() {
          return this[D].url.protocol;
        }
        set protocol(e10) {
          this[D].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t6 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t6}${this.hash}`;
        }
        set href(e10) {
          this[D].url = k(e10), this.analyze();
        }
        get origin() {
          return this[D].url.origin;
        }
        get pathname() {
          return this[D].url.pathname;
        }
        set pathname(e10) {
          this[D].url.pathname = e10;
        }
        get hash() {
          return this[D].url.hash;
        }
        set hash(e10) {
          this[D].url.hash = e10;
        }
        get search() {
          return this[D].url.search;
        }
        set search(e10) {
          this[D].url.search = e10;
        }
        get password() {
          return this[D].url.password;
        }
        set password(e10) {
          this[D].url.password = e10;
        }
        get username() {
          return this[D].url.username;
        }
        set username(e10) {
          this[D].url.username = e10;
        }
        get basePath() {
          return this[D].basePath;
        }
        set basePath(e10) {
          this[D].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new j(String(this), this[D].options);
        }
      }
      var q, B, U, G, V, H, $, K, z, W, F, X, Z, Y, J, Q, ee, et = e.i(28042);
      let er = Symbol("internal request");
      class en extends Request {
        constructor(e10, t6 = {}) {
          const r2 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          b(r2), e10 instanceof Request ? super(e10, t6) : super(r2, t6);
          const n2 = new j(r2, { headers: v(this.headers), nextConfig: t6.nextConfig });
          this[er] = { cookies: new et.RequestCookies(this.headers), nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[er].cookies;
        }
        get nextUrl() {
          return this[er].nextUrl;
        }
        get page() {
          throw new h();
        }
        get ua() {
          throw new g();
        }
        get url() {
          return this[er].url;
        }
      }
      class ea {
        static get(e10, t6, r2) {
          let n2 = Reflect.get(e10, t6, r2);
          return "function" == typeof n2 ? n2.bind(e10) : n2;
        }
        static set(e10, t6, r2, n2) {
          return Reflect.set(e10, t6, r2, n2);
        }
        static has(e10, t6) {
          return Reflect.has(e10, t6);
        }
        static deleteProperty(e10, t6) {
          return Reflect.deleteProperty(e10, t6);
        }
      }
      let ei = Symbol("internal response"), eo = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function es(e10, t6) {
        var r2;
        if (null == e10 || null == (r2 = e10.request) ? void 0 : r2.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r3 = [];
          for (let [n2, a2] of e10.request.headers) t6.set("x-middleware-request-" + n2, a2), r3.push(n2);
          t6.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class ed extends Response {
        constructor(e10, t6 = {}) {
          super(e10, t6);
          const r2 = this.headers, n2 = new Proxy(new et.ResponseCookies(r2), { get(e11, n3, a2) {
            switch (n3) {
              case "delete":
              case "set":
                return (...a3) => {
                  let i2 = Reflect.apply(e11[n3], e11, a3), o2 = new Headers(r2);
                  return i2 instanceof et.ResponseCookies && r2.set("x-middleware-set-cookie", i2.getAll().map((e12) => (0, et.stringifyCookie)(e12)).join(",")), es(t6, o2), i2;
                };
              default:
                return ea.get(e11, n3, a2);
            }
          } });
          this[ei] = { cookies: n2, url: t6.url ? new j(t6.url, { headers: v(r2), nextConfig: t6.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[ei].cookies;
        }
        static json(e10, t6) {
          let r2 = Response.json(e10, t6);
          return new ed(r2.body, r2);
        }
        static redirect(e10, t6) {
          let r2 = "number" == typeof t6 ? t6 : (null == t6 ? void 0 : t6.status) ?? 307;
          if (!eo.has(r2)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n2 = "object" == typeof t6 ? t6 : {}, a2 = new Headers(null == n2 ? void 0 : n2.headers);
          return a2.set("Location", b(e10)), new ed(null, { ...n2, headers: a2, status: r2 });
        }
        static rewrite(e10, t6) {
          let r2 = new Headers(null == t6 ? void 0 : t6.headers);
          return r2.set("x-middleware-rewrite", b(e10)), es(t6, r2), new ed(null, { ...t6, headers: r2 });
        }
        static next(e10) {
          let t6 = new Headers(null == e10 ? void 0 : e10.headers);
          return t6.set("x-middleware-next", "1"), es(e10, t6), new ed(null, { ...e10, headers: t6 });
        }
      }
      function el(e10, t6) {
        let r2 = "string" == typeof t6 ? new URL(t6) : t6, n2 = new URL(e10, t6), a2 = n2.origin === r2.origin;
        return { url: a2 ? n2.toString().slice(r2.origin.length) : n2.toString(), isRelative: a2 };
      }
      let eu = "next-router-prefetch", ec = ["rsc", "next-router-state-tree", eu, "next-hmr-refresh", "next-router-segment-prefetch"], e_ = "_rsc";
      class ep extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new ep();
        }
      }
      class ef extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t6, r2, n2) {
            if ("symbol" == typeof r2) return ea.get(t6, r2, n2);
            let a2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === a2);
            if (void 0 !== i2) return ea.get(t6, i2, n2);
          }, set(t6, r2, n2, a2) {
            if ("symbol" == typeof r2) return ea.set(t6, r2, n2, a2);
            let i2 = r2.toLowerCase(), o2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            return ea.set(t6, o2 ?? r2, n2, a2);
          }, has(t6, r2) {
            if ("symbol" == typeof r2) return ea.has(t6, r2);
            let n2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 !== a2 && ea.has(t6, a2);
          }, deleteProperty(t6, r2) {
            if ("symbol" == typeof r2) return ea.deleteProperty(t6, r2);
            let n2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 === a2 || ea.deleteProperty(t6, a2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t6, r2) {
            switch (t6) {
              case "append":
              case "delete":
              case "set":
                return ep.callable;
              default:
                return ea.get(e11, t6, r2);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new ef(e10);
        }
        append(e10, t6) {
          let r2 = this.headers[e10];
          "string" == typeof r2 ? this.headers[e10] = [r2, t6] : Array.isArray(r2) ? r2.push(t6) : this.headers[e10] = t6;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t6 = this.headers[e10];
          return void 0 !== t6 ? this.merge(t6) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t6) {
          this.headers[e10] = t6;
        }
        forEach(e10, t6) {
          for (let [r2, n2] of this.entries()) e10.call(t6, n2, r2, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t6 = e10.toLowerCase(), r2 = this.get(t6);
            yield [t6, r2];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t6 = e10.toLowerCase();
            yield t6;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t6 = this.get(e10);
            yield t6;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let eh = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class eg {
        disable() {
          throw eh;
        }
        getStore() {
        }
        run() {
          throw eh;
        }
        exit() {
          throw eh;
        }
        enterWith() {
          throw eh;
        }
        static bind(e10) {
          return e10;
        }
      }
      let ey = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function em() {
        return ey ? new ey() : new eg();
      }
      let ew = em();
      class ev extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new ev();
        }
      }
      class eb {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t6, r2) {
            switch (t6) {
              case "clear":
              case "delete":
              case "set":
                return ev.callable;
              default:
                return ea.get(e11, t6, r2);
            }
          } });
        }
      }
      let eS = Symbol.for("next.mutated.cookies");
      class ex {
        static wrap(e10, t6) {
          let r2 = new et.ResponseCookies(new Headers());
          for (let t7 of e10.getAll()) r2.set(t7);
          let n2 = [], a2 = /* @__PURE__ */ new Set(), i2 = () => {
            let e11 = ew.getStore();
            if (e11 && (e11.pathWasRevalidated = 1), n2 = r2.getAll().filter((e12) => a2.has(e12.name)), t6) {
              let e12 = [];
              for (let t7 of n2) {
                let r3 = new et.ResponseCookies(new Headers());
                r3.set(t7), e12.push(r3.toString());
              }
              t6(e12);
            }
          }, o2 = new Proxy(r2, { get(e11, t7, r3) {
            switch (t7) {
              case eS:
                return n2;
              case "delete":
                return function(...t8) {
                  a2.add("string" == typeof t8[0] ? t8[0] : t8[0].name);
                  try {
                    return e11.delete(...t8), o2;
                  } finally {
                    i2();
                  }
                };
              case "set":
                return function(...t8) {
                  a2.add("string" == typeof t8[0] ? t8[0] : t8[0].name);
                  try {
                    return e11.set(...t8), o2;
                  } finally {
                    i2();
                  }
                };
              default:
                return ea.get(e11, t7, r3);
            }
          } });
          return o2;
        }
      }
      function eC(e10, t6) {
        if ("action" !== e10.phase) throw new ev();
      }
      var eE = ((q = eE || {}).handleRequest = "BaseServer.handleRequest", q.run = "BaseServer.run", q.pipe = "BaseServer.pipe", q.getStaticHTML = "BaseServer.getStaticHTML", q.render = "BaseServer.render", q.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", q.renderToResponse = "BaseServer.renderToResponse", q.renderToHTML = "BaseServer.renderToHTML", q.renderError = "BaseServer.renderError", q.renderErrorToResponse = "BaseServer.renderErrorToResponse", q.renderErrorToHTML = "BaseServer.renderErrorToHTML", q.render404 = "BaseServer.render404", q), eO = ((B = eO || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", B.loadComponents = "LoadComponents.loadComponents", B), eT = ((U = eT || {}).getRequestHandler = "NextServer.getRequestHandler", U.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", U.getServer = "NextServer.getServer", U.getServerRequestHandler = "NextServer.getServerRequestHandler", U.createServer = "createServer.createServer", U), eR = ((G = eR || {}).compression = "NextNodeServer.compression", G.getBuildId = "NextNodeServer.getBuildId", G.createComponentTree = "NextNodeServer.createComponentTree", G.clientComponentLoading = "NextNodeServer.clientComponentLoading", G.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", G.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", G.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", G.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", G.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", G.sendRenderResult = "NextNodeServer.sendRenderResult", G.proxyRequest = "NextNodeServer.proxyRequest", G.runApi = "NextNodeServer.runApi", G.render = "NextNodeServer.render", G.renderHTML = "NextNodeServer.renderHTML", G.imageOptimizer = "NextNodeServer.imageOptimizer", G.getPagePath = "NextNodeServer.getPagePath", G.getRoutesManifest = "NextNodeServer.getRoutesManifest", G.findPageComponents = "NextNodeServer.findPageComponents", G.getFontManifest = "NextNodeServer.getFontManifest", G.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", G.getRequestHandler = "NextNodeServer.getRequestHandler", G.renderToHTML = "NextNodeServer.renderToHTML", G.renderError = "NextNodeServer.renderError", G.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", G.render404 = "NextNodeServer.render404", G.startResponse = "NextNodeServer.startResponse", G.route = "route", G.onProxyReq = "onProxyReq", G.apiResolver = "apiResolver", G.internalFetch = "internalFetch", G), eP = ((V = eP || {}).startServer = "startServer.startServer", V), eN = ((H = eN || {}).getServerSideProps = "Render.getServerSideProps", H.getStaticProps = "Render.getStaticProps", H.renderToString = "Render.renderToString", H.renderDocument = "Render.renderDocument", H.createBodyResult = "Render.createBodyResult", H), eM = (($ = eM || {}).renderToString = "AppRender.renderToString", $.renderToReadableStream = "AppRender.renderToReadableStream", $.getBodyResult = "AppRender.getBodyResult", $.fetch = "AppRender.fetch", $), eL = ((K = eL || {}).executeRoute = "Router.executeRoute", K), eI = ((z = eI || {}).runHandler = "Node.runHandler", z), eA = ((W = eA || {}).runHandler = "AppRouteRouteHandlers.runHandler", W), ek = ((F = ek || {}).generateMetadata = "ResolveMetadata.generateMetadata", F.generateViewport = "ResolveMetadata.generateViewport", F), eD = ((X = eD || {}).execute = "Middleware.execute", X);
      let ej = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), eq = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function eB(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let eU = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: eG, propagation: eV, trace: eH, SpanStatusCode: e$, SpanKind: eK, ROOT_CONTEXT: ez } = t = e.r(59110);
      class eW extends Error {
        constructor(e10, t6) {
          super(), this.bubble = e10, this.result = t6;
        }
      }
      let eF = (e10, t6) => {
        "object" == typeof t6 && null !== t6 && t6 instanceof eW && t6.bubble ? e10.setAttribute("next.bubble", true) : (t6 && (e10.recordException(t6), e10.setAttribute("error.type", t6.name)), e10.setStatus({ code: e$.ERROR, message: null == t6 ? void 0 : t6.message })), e10.end();
      }, eX = /* @__PURE__ */ new Map(), eZ = t.createContextKey("next.rootSpanId"), eY = 0, eJ = { set(e10, t6, r2) {
        e10.push({ key: t6, value: r2 });
      } }, eQ = (n = new class e {
        getTracerInstance() {
          return eH.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return eG;
        }
        getTracePropagationData() {
          let e10 = eG.active(), t6 = [];
          return eV.inject(e10, t6, eJ), t6;
        }
        getActiveScopeSpan() {
          return eH.getSpan(null == eG ? void 0 : eG.active());
        }
        withPropagatedContext(e10, t6, r2) {
          let n2 = eG.active();
          if (eH.getSpanContext(n2)) return t6();
          let a2 = eV.extract(n2, e10, r2);
          return eG.with(a2, t6);
        }
        trace(...e10) {
          let [t6, r2, n2] = e10, { fn: a2, options: i2 } = "function" == typeof r2 ? { fn: r2, options: {} } : { fn: n2, options: { ...r2 } }, o2 = i2.spanName ?? t6;
          if (!ej.has(t6) && "1" !== process.env.NEXT_OTEL_VERBOSE || i2.hideSpan) return a2();
          let s2 = this.getSpanContext((null == i2 ? void 0 : i2.parentSpan) ?? this.getActiveScopeSpan());
          s2 || (s2 = (null == eG ? void 0 : eG.active()) ?? ez);
          let d2 = s2.getValue(eZ), l2 = "number" != typeof d2 || !eX.has(d2), u2 = eY++;
          return i2.attributes = { "next.span_name": o2, "next.span_type": t6, ...i2.attributes }, eG.with(s2.setValue(eZ, u2), () => this.getTracerInstance().startActiveSpan(o2, i2, (e11) => {
            let r3;
            eU && t6 && eq.has(t6) && (r3 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n3 = false, o3 = () => {
              !n3 && (n3 = true, eX.delete(u2), r3 && performance.measure(`${eU}:next-${(t6.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: r3, end: performance.now() }));
            };
            if (l2 && eX.set(u2, new Map(Object.entries(i2.attributes ?? {}))), a2.length > 1) try {
              return a2(e11, (t7) => eF(e11, t7));
            } catch (t7) {
              throw eF(e11, t7), t7;
            } finally {
              o3();
            }
            try {
              let t7 = a2(e11);
              if (eB(t7)) return t7.then((t8) => (e11.end(), t8)).catch((t8) => {
                throw eF(e11, t8), t8;
              }).finally(o3);
              return e11.end(), o3(), t7;
            } catch (t7) {
              throw eF(e11, t7), o3(), t7;
            }
          }));
        }
        wrap(...e10) {
          let t6 = this, [r2, n2, a2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return ej.has(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n2;
            "function" == typeof e11 && "function" == typeof a2 && (e11 = e11.apply(this, arguments));
            let i2 = arguments.length - 1, o2 = arguments[i2];
            if ("function" != typeof o2) return t6.trace(r2, e11, () => a2.apply(this, arguments));
            {
              let n3 = t6.getContext().bind(eG.active(), o2);
              return t6.trace(r2, e11, (e12, t7) => (arguments[i2] = function(e13) {
                return null == t7 || t7(e13), n3.apply(this, arguments);
              }, a2.apply(this, arguments)));
            }
          } : a2;
        }
        startSpan(...e10) {
          let [t6, r2] = e10, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t6, r2, n2);
        }
        getSpanContext(e10) {
          return e10 ? eH.setSpan(eG.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = eG.active().getValue(eZ);
          return eX.get(e10);
        }
        setRootSpanAttribute(e10, t6) {
          let r2 = eG.active().getValue(eZ), n2 = eX.get(r2);
          n2 && !n2.has(e10) && n2.set(e10, t6);
        }
        withSpan(e10, t6) {
          let r2 = eH.setSpan(eG.active(), e10);
          return eG.with(r2, t6);
        }
      }(), () => n), e0 = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(e0);
      class e1 {
        constructor(e10, t6, r2, n2) {
          var a2;
          const i2 = e10 && function(e11, t7) {
            let r3 = ef.from(e11.headers);
            return { isOnDemandRevalidate: r3.get("x-prerender-revalidate") === t7.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t6, e10).isOnDemandRevalidate, o2 = null == (a2 = r2.get(e0)) ? void 0 : a2.value;
          this._isEnabled = !!(!i2 && o2 && e10 && o2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n2;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: e0, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: e0, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function e3(e10, t6) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r2 = e10.headers["x-middleware-set-cookie"], n2 = new Headers();
          for (let e11 of w(r2)) n2.append("set-cookie", e11);
          for (let e11 of new et.ResponseCookies(n2).getAll()) t6.set(e11);
        }
      }
      let e2 = em();
      class e4 extends Error {
        constructor(e10, t6) {
          super(`Invariant: ${e10.endsWith(".") ? e10 : e10 + "."} This is a bug in Next.js.`, t6), this.name = "InvariantError";
        }
      }
      var e5 = e.i(99734);
      e.i(51615);
      process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let e9 = Symbol.for("@next/cache-handlers-map"), e6 = Symbol.for("@next/cache-handlers-set"), e7 = globalThis;
      function e8() {
        if (e7[e9]) return e7[e9].entries();
      }
      async function te(e10, t6) {
        if (!e10) return t6();
        let r2 = tt(e10);
        try {
          return await t6();
        } finally {
          var n2, a2;
          let t7, i2, o2 = (n2 = r2, a2 = tt(e10), t7 = new Set(n2.pendingRevalidatedTags.map((e11) => {
            let t8 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return `${e11.tag}:${t8}`;
          })), i2 = new Set(n2.pendingRevalidateWrites), { pendingRevalidatedTags: a2.pendingRevalidatedTags.filter((e11) => {
            let r3 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return !t7.has(`${e11.tag}:${r3}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(a2.pendingRevalidates).filter(([e11]) => !(e11 in n2.pendingRevalidates))), pendingRevalidateWrites: a2.pendingRevalidateWrites.filter((e11) => !i2.has(e11)) });
          await tn(e10, o2);
        }
      }
      function tt(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function tr(e10, t6, r2) {
        if (0 === e10.length) return;
        let n2 = function() {
          if (e7[e6]) return e7[e6].values();
        }(), a2 = [], i2 = /* @__PURE__ */ new Map();
        for (let t7 of e10) {
          let e11, r3 = t7.profile;
          for (let [t8] of i2) if ("string" == typeof t8 && "string" == typeof r3 && t8 === r3 || "object" == typeof t8 && "object" == typeof r3 && JSON.stringify(t8) === JSON.stringify(r3) || t8 === r3) {
            e11 = t8;
            break;
          }
          let n3 = e11 || r3;
          i2.has(n3) || i2.set(n3, []), i2.get(n3).push(t7.tag);
        }
        for (let [e11, s2] of i2) {
          let i3;
          if (e11) {
            let t7;
            if ("object" == typeof e11) t7 = e11;
            else if ("string" == typeof e11) {
              var o2;
              if (!(t7 = null == r2 || null == (o2 = r2.cacheLifeProfiles) ? void 0 : o2[e11])) throw Object.defineProperty(Error(`Invalid profile provided "${e11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            t7 && (i3 = { expire: t7.expire });
          }
          for (let t7 of n2 || []) e11 ? a2.push(null == t7.updateTags ? void 0 : t7.updateTags.call(t7, s2, i3)) : a2.push(null == t7.updateTags ? void 0 : t7.updateTags.call(t7, s2));
          t6 && a2.push(t6.revalidateTag(s2, i3));
        }
        await Promise.all(a2);
      }
      async function tn(e10, t6) {
        let r2 = (null == t6 ? void 0 : t6.pendingRevalidatedTags) ?? e10.pendingRevalidatedTags ?? [], n2 = (null == t6 ? void 0 : t6.pendingRevalidates) ?? e10.pendingRevalidates ?? {}, a2 = (null == t6 ? void 0 : t6.pendingRevalidateWrites) ?? e10.pendingRevalidateWrites ?? [];
        return Promise.all([tr(r2, e10.incrementalCache, e10), ...Object.values(n2), ...a2]);
      }
      let ta = em();
      class ti {
        constructor({ waitUntil: e10, onClose: t6, onTaskError: r2 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t6, this.onTaskError = r2, this.callbackQueue = new e5.default(), this.callbackQueue.pause();
        }
        after(e10) {
          if (eB(e10)) this.waitUntil || to(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          var t6;
          this.waitUntil || to();
          let r2 = e2.getStore();
          r2 && this.workUnitStores.add(r2);
          let n2 = ta.getStore(), a2 = n2 ? n2.rootTaskSpawnPhase : null == r2 ? void 0 : r2.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let i2 = (t6 = async () => {
            try {
              await ta.run({ rootTaskSpawnPhase: a2 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, ey ? ey.bind(t6) : eg.bind(t6));
          this.callbackQueue.add(i2);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = ew.getStore();
          if (!e10) throw Object.defineProperty(new e4("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return te(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t6) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t6), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t6);
          } catch (e11) {
            console.error(Object.defineProperty(new e4("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function to() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function ts(e10) {
        let t6, r2 = { then: (n2, a2) => (t6 || (t6 = Promise.resolve(e10())), t6.then((e11) => {
          r2.value = e11;
        }).catch(() => {
        }), t6.then(n2, a2)) };
        return r2;
      }
      class td {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function tl() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let tu = Symbol.for("@next/request-context");
      async function tc(e10, t6, r2) {
        let n2 = /* @__PURE__ */ new Set();
        for (let t7 of ((e11) => {
          let t8 = ["/layout"];
          if (e11.startsWith("/")) {
            let r3 = e11.split("/");
            for (let e12 = 1; e12 < r3.length + 1; e12++) {
              let n3 = r3.slice(0, e12).join("/");
              n3 && (n3.endsWith("/page") || n3.endsWith("/route") || (n3 = `${n3}${!n3.endsWith("/") ? "/" : ""}layout`), t8.push(n3));
            }
          }
          return t8;
        })(e10)) t7 = `${y}${t7}`, n2.add(t7);
        if (t6.pathname && (!r2 || 0 === r2.size)) {
          let e11 = `${y}${t6.pathname}`;
          n2.add(e11);
        }
        n2.has(`${y}/`) && n2.add(`${y}/index`), n2.has(`${y}/index`) && n2.add(`${y}/`);
        let a2 = Array.from(n2);
        return { tags: a2, expirationsByCacheKind: function(e11) {
          let t7 = /* @__PURE__ */ new Map(), r3 = e8();
          if (r3) for (let [n3, a3] of r3) "getExpiration" in a3 && t7.set(n3, ts(async () => a3.getExpiration(e11)));
          return t7;
        }(a2) };
      }
      class t_ extends en {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new f({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new f({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new f({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tp = { keys: (e10) => Array.from(e10.keys()), get: (e10, t6) => e10.get(t6) ?? void 0 }, tf = (e10, t6) => eQ().withPropagatedContext(e10.headers, t6, tp), th = false;
      async function tg(t6) {
        var r2, n2, a2, i2;
        let o2, s2, d2, l2, u2;
        !function() {
          if (!th && (th = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: t7, wrapRequestHandler: r3 } = e.r(94165);
            t7(), tf = r3(tf);
          }
        }(), await _();
        let c2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t6.request.url = t6.request.url.replace(/\.rsc($|\?)/, "$1");
        let p2 = t6.bypassNextUrl ? new URL(t6.request.url) : new j(t6.request.url, { headers: t6.request.headers, nextConfig: t6.request.nextConfig });
        for (let e10 of [...p2.searchParams.keys()]) {
          let t7 = p2.searchParams.getAll(e10), r3 = function(e11) {
            for (let t8 of ["nxtP", "nxtI"]) if (e11 !== t8 && e11.startsWith(t8)) return e11.substring(t8.length);
            return null;
          }(e10);
          if (r3) {
            for (let e11 of (p2.searchParams.delete(r3), t7)) p2.searchParams.append(r3, e11);
            p2.searchParams.delete(e10);
          }
        }
        let f2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in p2 && (f2 = p2.buildId || "", p2.buildId = "");
        let h2 = function(e10) {
          let t7 = new Headers();
          for (let [r3, n3] of Object.entries(e10)) for (let e11 of Array.isArray(n3) ? n3 : [n3]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t7.append(r3, e11));
          return t7;
        }(t6.request.headers), g2 = h2.has("x-nextjs-data"), y2 = "1" === h2.get("rsc");
        g2 && "/index" === p2.pathname && (p2.pathname = "/");
        let m2 = /* @__PURE__ */ new Map();
        if (!c2) for (let e10 of ec) {
          let t7 = h2.get(e10);
          null !== t7 && (m2.set(e10, t7), h2.delete(e10));
        }
        let w2 = p2.searchParams.get(e_), v2 = new t_({ page: t6.page, input: ((l2 = (d2 = "string" == typeof p2) ? new URL(p2) : p2).searchParams.delete(e_), d2 ? l2.toString() : l2).toString(), init: { body: t6.request.body, headers: h2, method: t6.request.method, nextConfig: t6.request.nextConfig, signal: t6.request.signal } });
        g2 && Object.defineProperty(v2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t6.IncrementalCache && (globalThis.__incrementalCache = new t6.IncrementalCache({ CurCacheHandler: t6.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t6.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: tl() }) }));
        let b2 = t6.request.waitUntil ?? (null == (r2 = null == (u2 = globalThis[tu]) ? void 0 : u2.get()) ? void 0 : r2.waitUntil), S2 = new O({ request: v2, page: t6.page, context: b2 ? { waitUntil: b2 } : void 0 });
        if ((o2 = await tf(v2, () => {
          if ("/middleware" === t6.page || "/src/middleware" === t6.page || "/proxy" === t6.page || "/src/proxy" === t6.page) {
            let e10 = S2.waitUntil.bind(S2), r3 = new td();
            return eQ().trace(eD.execute, { spanName: `middleware ${v2.method}`, attributes: { "http.target": v2.nextUrl.pathname, "http.method": v2.method } }, async () => {
              try {
                var n3, a3, i3, o3, d3, l3;
                let u3 = tl(), c3 = await tc("/", v2.nextUrl, null), _2 = (d3 = v2.nextUrl, l3 = (e11) => {
                  s2 = e11;
                }, function(e11, t7, r4, n4, a4, i4, o4, s3, d4, l4, u4, c4) {
                  function _3(e12) {
                    r4 && r4.setHeader("Set-Cookie", e12);
                  }
                  let p4 = {};
                  return { type: "request", phase: e11, implicitTags: i4, url: { pathname: n4.pathname, search: n4.search ?? "" }, rootParams: a4, get headers() {
                    return p4.headers || (p4.headers = function(e12) {
                      let t8 = ef.from(e12);
                      for (let e13 of ec) t8.delete(e13);
                      return ef.seal(t8);
                    }(t7.headers)), p4.headers;
                  }, get cookies() {
                    if (!p4.cookies) {
                      let e12 = new et.RequestCookies(ef.from(t7.headers));
                      e3(t7, e12), p4.cookies = eb.seal(e12);
                    }
                    return p4.cookies;
                  }, set cookies(value) {
                    p4.cookies = value;
                  }, get mutableCookies() {
                    if (!p4.mutableCookies) {
                      var f3, h3;
                      let e12, n5 = (f3 = t7.headers, h3 = o4 || (r4 ? _3 : void 0), e12 = new et.RequestCookies(ef.from(f3)), ex.wrap(e12, h3));
                      e3(t7, n5), p4.mutableCookies = n5;
                    }
                    return p4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!p4.userspaceMutableCookies) {
                      var g3;
                      let e12;
                      g3 = this, p4.userspaceMutableCookies = e12 = new Proxy(g3.mutableCookies, { get(t8, r5, n5) {
                        switch (r5) {
                          case "delete":
                            return function(...r6) {
                              return eC(g3, "cookies().delete"), t8.delete(...r6), e12;
                            };
                          case "set":
                            return function(...r6) {
                              return eC(g3, "cookies().set"), t8.set(...r6), e12;
                            };
                          default:
                            return ea.get(t8, r5, n5);
                        }
                      } });
                    }
                    return p4.userspaceMutableCookies;
                  }, get draftMode() {
                    return p4.draftMode || (p4.draftMode = new e1(d4, t7, this.cookies, this.mutableCookies)), p4.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: l4, serverComponentsHmrCache: u4 || globalThis.__serverComponentsHmrCache, devFallbackParams: null };
                }("action", v2, void 0, d3, {}, c3, l3, null, u3, false, void 0, null)), p3 = function({ page: e11, renderOpts: t7, isPrefetchRequest: r4, buildId: n4, previouslyRevalidatedTags: a4, nonce: i4 }) {
                  var o4;
                  let s3 = !t7.shouldWaitOnAllReady && !t7.supportsDynamicResponse && !t7.isDraftMode && !t7.isPossibleServerAction, d4 = t7.dev ?? false, l4 = d4 || s3 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), u4 = { isStaticGeneration: s3, page: e11, route: (o4 = e11.split("/").reduce((e12, t8, r5, n5) => t8 ? "(" === t8[0] && t8.endsWith(")") || "@" === t8[0] || ("page" === t8 || "route" === t8) && r5 === n5.length - 1 ? e12 : `${e12}/${t8}` : e12, "")).startsWith("/") ? o4 : `/${o4}`, incrementalCache: t7.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t7.cacheLifeProfiles, isBuildTimePrerendering: t7.nextExport, hasReadableErrorStacks: t7.hasReadableErrorStacks, fetchCache: t7.fetchCache, isOnDemandRevalidate: t7.isOnDemandRevalidate, isDraftMode: t7.isDraftMode, isPrefetchRequest: r4, buildId: n4, reactLoadableManifest: (null == t7 ? void 0 : t7.reactLoadableManifest) || {}, assetPrefix: (null == t7 ? void 0 : t7.assetPrefix) || "", nonce: i4, afterContext: function(e12) {
                    let { waitUntil: t8, onClose: r5, onAfterTaskError: n5 } = e12;
                    return new ti({ waitUntil: t8, onClose: r5, onTaskError: n5 });
                  }(t7), cacheComponentsEnabled: t7.cacheComponents, dev: d4, previouslyRevalidatedTags: a4, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t8 = e8();
                    if (t8) for (let [r5, n5] of t8) "refreshTags" in n5 && e12.set(r5, ts(async () => n5.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: ey ? ey.snapshot() : function(e12, ...t8) {
                    return e12(...t8);
                  }, shouldTrackFetchMetrics: l4, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return t7.store = u4, u4;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (a3 = t6.request.nextConfig) || null == (n3 = a3.experimental) ? void 0 : n3.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (o3 = t6.request.nextConfig) || null == (i3 = o3.experimental) ? void 0 : i3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: e10, onClose: r3.onClose.bind(r3), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === v2.headers.get(eu), buildId: f2 ?? "", previouslyRevalidatedTags: [] });
                return await ew.run(p3, () => e2.run(_2, t6.handler, v2, S2));
              } finally {
                setTimeout(() => {
                  r3.dispatchClose();
                }, 0);
              }
            });
          }
          return t6.handler(v2, S2);
        })) && !(o2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        o2 && s2 && o2.headers.set("set-cookie", s2);
        let x2 = null == o2 ? void 0 : o2.headers.get("x-middleware-rewrite");
        if (o2 && x2 && (y2 || !c2)) {
          let e10 = new j(x2, { forceLocale: true, headers: t6.request.headers, nextConfig: t6.request.nextConfig });
          c2 || e10.host !== v2.nextUrl.host || (e10.buildId = f2 || e10.buildId, o2.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r3, isRelative: s3 } = el(e10.toString(), p2.toString());
          !c2 && g2 && o2.headers.set("x-nextjs-rewrite", r3);
          let d3 = !s3 && (null == (i2 = t6.request.nextConfig) || null == (a2 = i2.experimental) || null == (n2 = a2.clientParamParsingOrigins) ? void 0 : n2.some((t7) => new RegExp(t7).test(e10.origin)));
          y2 && (s3 || d3) && (p2.pathname !== e10.pathname && o2.headers.set("x-nextjs-rewritten-path", e10.pathname), p2.search !== e10.search && o2.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (o2 && x2 && y2 && w2) {
          let e10 = new URL(x2);
          e10.searchParams.has(e_) || (e10.searchParams.set(e_, w2), o2.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let E2 = null == o2 ? void 0 : o2.headers.get("Location");
        if (o2 && E2 && !c2) {
          let e10 = new j(E2, { forceLocale: false, headers: t6.request.headers, nextConfig: t6.request.nextConfig });
          o2 = new Response(o2.body, o2), e10.host === p2.host && (e10.buildId = f2 || e10.buildId, o2.headers.set("Location", el(e10, p2).url)), g2 && (o2.headers.delete("Location"), o2.headers.set("x-nextjs-redirect", el(e10.toString(), p2.toString()).url));
        }
        let T2 = o2 || ed.next(), R2 = T2.headers.get("x-middleware-override-headers"), P2 = [];
        if (R2) {
          for (let [e10, t7] of m2) T2.headers.set(`x-middleware-request-${e10}`, t7), P2.push(e10);
          P2.length > 0 && T2.headers.set("x-middleware-override-headers", R2 + "," + P2.join(","));
        }
        return { response: T2, waitUntil: ("internal" === S2[C].kind ? Promise.all(S2[C].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: v2.fetchMetrics };
      }
      e.i(64445), "u" < typeof URLPattern || URLPattern;
      var ty = e.i(40049);
      if (/* @__PURE__ */ new WeakMap(), ty.default.unstable_postpone, false === ("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("needs to bail out of prerendering at this point because it used") && "Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error".includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      function tm(e10, t6, r2) {
        return "string" == typeof e10 ? e10 : e10[t6] || r2;
      }
      function tw(e10) {
        let t6 = function() {
          try {
            return "true" === process.env._next_intl_trailing_slash;
          } catch {
            return false;
          }
        }(), [r2, ...n2] = e10.split("#"), a2 = n2.join("#"), i2 = r2;
        if ("/" !== i2) {
          let e11 = i2.endsWith("/");
          t6 && !e11 ? i2 += "/" : !t6 && e11 && (i2 = i2.slice(0, -1));
        }
        return a2 && (i2 += "#" + a2), i2;
      }
      function tv(e10, t6) {
        let r2 = tw(e10), n2 = tw(t6);
        return tS(r2).test(n2);
      }
      function tb(e10, t6) {
        return "never" !== t6.mode && t6.prefixes?.[e10] || "/" + e10;
      }
      function tS(e10) {
        let t6 = e10.replace(/\/\[\[(\.\.\.[^\]]+)\]\]/g, "(?:/(.*))?").replace(/\[\[(\.\.\.[^\]]+)\]\]/g, "(?:/(.*))?").replace(/\[(\.\.\.[^\]]+)\]/g, "(.+)").replace(/\[([^\]]+)\]/g, "([^/]+)");
        return RegExp(`^${t6}$`);
      }
      function tx(e10) {
        return e10.includes("[[...");
      }
      function tC(e10) {
        return e10.includes("[...");
      }
      function tE(e10) {
        return e10.includes("[");
      }
      function tO(e10, t6) {
        let r2 = e10.split("/"), n2 = t6.split("/"), a2 = Math.max(r2.length, n2.length);
        for (let e11 = 0; e11 < a2; e11++) {
          let t7 = r2[e11], a3 = n2[e11];
          if (!t7 && a3) return -1;
          if (t7 && !a3) return 1;
          if (t7 || a3) {
            if (!tE(t7) && tE(a3)) return -1;
            if (tE(t7) && !tE(a3)) return 1;
            if (!tC(t7) && tC(a3)) return -1;
            if (tC(t7) && !tC(a3)) return 1;
            if (!tx(t7) && tx(a3)) return -1;
            if (tx(t7) && !tx(a3)) return 1;
          }
        }
        return 0;
      }
      function tT(e10, t6, r2, n2) {
        let a2 = "";
        return a2 += function(e11, t7) {
          if (!t7) return e11;
          let r3 = e11 = e11.replace(/\[\[/g, "[").replace(/\]\]/g, "]");
          return Object.entries(t7).forEach(([e12, t8]) => {
            r3 = r3.replace(`[${e12}]`, t8);
          }), r3;
        }(r2, function(e11, t7) {
          let r3 = tw(t7), n3 = tw(e11), a3 = tS(n3).exec(r3);
          if (!a3) return;
          let i2 = {}, o2 = n3.match(/\[([^\]]+)\]/g) ?? [];
          for (let e12 = 1; e12 < a3.length; e12++) {
            let t8 = o2[e12 - 1];
            if (!t8) continue;
            let r4 = t8.replace(/[[\]]/g, ""), n4 = a3[e12] ?? "";
            i2[r4] = n4;
          }
          return i2;
        }(t6, e10)), a2 = tw(a2);
      }
      function tR(e10, t6, r2) {
        e10.endsWith("/") || (e10 += "/");
        let n2 = tP(t6, r2), a2 = RegExp(`^(${n2.map(([, e11]) => e11.replaceAll("/", "\\/")).join("|")})/(.*)`, "i"), i2 = e10.match(a2), o2 = i2 ? "/" + i2[2] : e10;
        return "/" !== o2 && (o2 = tw(o2)), o2;
      }
      function tP(e10, t6, r2 = true) {
        let n2 = e10.map((e11) => [e11, tb(e11, t6)]);
        return r2 && n2.sort((e11, t7) => t7[1].length - e11[1].length), n2;
      }
      function tN(e10, t6, r2, n2) {
        let a2 = tP(t6, r2);
        for (let [t7, r3] of (n2 && a2.sort(([e11], [t8]) => {
          if (e11 === n2.defaultLocale) return -1;
          if (t8 === n2.defaultLocale) return 1;
          let r4 = n2.locales.includes(e11), a3 = n2.locales.includes(t8);
          return r4 && !a3 ? -1 : !r4 && a3 ? 1 : 0;
        }), a2)) {
          let n3, a3;
          if (e10 === r3 || e10.startsWith(r3 + "/")) n3 = a3 = true;
          else {
            let t8 = e10.toLowerCase(), i2 = r3.toLowerCase();
            (t8 === i2 || t8.startsWith(i2 + "/")) && (n3 = false, a3 = true);
          }
          if (a3) return { locale: t7, prefix: r3, matchedPrefix: e10.slice(0, r3.length), exact: n3 };
        }
      }
      function tM(e10, t6, r2) {
        var n2;
        let a2, i2 = e10;
        return t6 && (n2 = i2, a2 = t6, /^\/(\?.*)?$/.test(n2) && (n2 = n2.slice(1)), i2 = a2 += n2), r2 && (i2 += r2), i2;
      }
      function tL(e10) {
        return e10.get("x-forwarded-host") ?? e10.get("host") ?? void 0;
      }
      function tI(e10, t6) {
        return t6.defaultLocale === e10 || t6.locales.includes(e10);
      }
      function tA(e10, t6, r2) {
        let n2;
        return e10 && tI(t6, e10) && (n2 = e10), n2 || (n2 = r2.find((e11) => e11.defaultLocale === t6)), n2 || (n2 = r2.find((e11) => e11.locales.includes(t6))), n2;
      }
      RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)`), RegExp(`\\n\\s+at __next_metadata_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_viewport_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_outlet_boundary__[\\n\\s]`), e.s([], 85835), e.i(85835);
      function tk(e10, t6, r2, n2) {
        let a2 = null == n2 || "number" == typeof n2 || "boolean" == typeof n2 ? n2 : r2(n2), i2 = t6.get(a2);
        return void 0 === i2 && (i2 = e10.call(this, n2), t6.set(a2, i2)), i2;
      }
      function tD(e10, t6, r2) {
        let n2 = Array.prototype.slice.call(arguments, 3), a2 = r2(n2), i2 = t6.get(a2);
        return void 0 === i2 && (i2 = e10.apply(this, n2), t6.set(a2, i2)), i2;
      }
      class tj {
        cache;
        constructor() {
          this.cache = /* @__PURE__ */ Object.create(null);
        }
        get(e10) {
          return this.cache[e10];
        }
        set(e10, t6) {
          this.cache[e10] = t6;
        }
      }
      let tq = { "written-new": [{ paradigmLocales: { _locales: "en en_GB es es_419 pt_BR pt_PT" } }, { $enUS: { _value: "AS+CA+GU+MH+MP+PH+PR+UM+US+VI" } }, { $cnsar: { _value: "HK+MO" } }, { $americas: { _value: "019" } }, { $maghreb: { _value: "MA+DZ+TN+LY+MR+EH" } }, { no: { _desired: "nb", _distance: "1" } }, { bs: { _desired: "hr", _distance: "4" } }, { bs: { _desired: "sh", _distance: "4" } }, { hr: { _desired: "sh", _distance: "4" } }, { sr: { _desired: "sh", _distance: "4" } }, { aa: { _desired: "ssy", _distance: "4" } }, { de: { _desired: "gsw", _distance: "4", _oneway: "true" } }, { de: { _desired: "lb", _distance: "4", _oneway: "true" } }, { no: { _desired: "da", _distance: "8" } }, { nb: { _desired: "da", _distance: "8" } }, { ru: { _desired: "ab", _distance: "30", _oneway: "true" } }, { en: { _desired: "ach", _distance: "30", _oneway: "true" } }, { nl: { _desired: "af", _distance: "20", _oneway: "true" } }, { en: { _desired: "ak", _distance: "30", _oneway: "true" } }, { en: { _desired: "am", _distance: "30", _oneway: "true" } }, { es: { _desired: "ay", _distance: "20", _oneway: "true" } }, { ru: { _desired: "az", _distance: "30", _oneway: "true" } }, { ur: { _desired: "bal", _distance: "20", _oneway: "true" } }, { ru: { _desired: "be", _distance: "20", _oneway: "true" } }, { en: { _desired: "bem", _distance: "30", _oneway: "true" } }, { hi: { _desired: "bh", _distance: "30", _oneway: "true" } }, { en: { _desired: "bn", _distance: "30", _oneway: "true" } }, { zh: { _desired: "bo", _distance: "20", _oneway: "true" } }, { fr: { _desired: "br", _distance: "20", _oneway: "true" } }, { es: { _desired: "ca", _distance: "20", _oneway: "true" } }, { fil: { _desired: "ceb", _distance: "30", _oneway: "true" } }, { en: { _desired: "chr", _distance: "20", _oneway: "true" } }, { ar: { _desired: "ckb", _distance: "30", _oneway: "true" } }, { fr: { _desired: "co", _distance: "20", _oneway: "true" } }, { fr: { _desired: "crs", _distance: "20", _oneway: "true" } }, { sk: { _desired: "cs", _distance: "20" } }, { en: { _desired: "cy", _distance: "20", _oneway: "true" } }, { en: { _desired: "ee", _distance: "30", _oneway: "true" } }, { en: { _desired: "eo", _distance: "30", _oneway: "true" } }, { es: { _desired: "eu", _distance: "20", _oneway: "true" } }, { da: { _desired: "fo", _distance: "20", _oneway: "true" } }, { nl: { _desired: "fy", _distance: "20", _oneway: "true" } }, { en: { _desired: "ga", _distance: "20", _oneway: "true" } }, { en: { _desired: "gaa", _distance: "30", _oneway: "true" } }, { en: { _desired: "gd", _distance: "20", _oneway: "true" } }, { es: { _desired: "gl", _distance: "20", _oneway: "true" } }, { es: { _desired: "gn", _distance: "20", _oneway: "true" } }, { hi: { _desired: "gu", _distance: "30", _oneway: "true" } }, { en: { _desired: "ha", _distance: "30", _oneway: "true" } }, { en: { _desired: "haw", _distance: "20", _oneway: "true" } }, { fr: { _desired: "ht", _distance: "20", _oneway: "true" } }, { ru: { _desired: "hy", _distance: "30", _oneway: "true" } }, { en: { _desired: "ia", _distance: "30", _oneway: "true" } }, { en: { _desired: "ig", _distance: "30", _oneway: "true" } }, { en: { _desired: "is", _distance: "20", _oneway: "true" } }, { id: { _desired: "jv", _distance: "20", _oneway: "true" } }, { en: { _desired: "ka", _distance: "30", _oneway: "true" } }, { fr: { _desired: "kg", _distance: "30", _oneway: "true" } }, { ru: { _desired: "kk", _distance: "30", _oneway: "true" } }, { en: { _desired: "km", _distance: "30", _oneway: "true" } }, { en: { _desired: "kn", _distance: "30", _oneway: "true" } }, { en: { _desired: "kri", _distance: "30", _oneway: "true" } }, { tr: { _desired: "ku", _distance: "30", _oneway: "true" } }, { ru: { _desired: "ky", _distance: "30", _oneway: "true" } }, { it: { _desired: "la", _distance: "20", _oneway: "true" } }, { en: { _desired: "lg", _distance: "30", _oneway: "true" } }, { fr: { _desired: "ln", _distance: "30", _oneway: "true" } }, { en: { _desired: "lo", _distance: "30", _oneway: "true" } }, { en: { _desired: "loz", _distance: "30", _oneway: "true" } }, { fr: { _desired: "lua", _distance: "30", _oneway: "true" } }, { hi: { _desired: "mai", _distance: "20", _oneway: "true" } }, { en: { _desired: "mfe", _distance: "30", _oneway: "true" } }, { fr: { _desired: "mg", _distance: "30", _oneway: "true" } }, { en: { _desired: "mi", _distance: "20", _oneway: "true" } }, { en: { _desired: "ml", _distance: "30", _oneway: "true" } }, { ru: { _desired: "mn", _distance: "30", _oneway: "true" } }, { hi: { _desired: "mr", _distance: "30", _oneway: "true" } }, { id: { _desired: "ms", _distance: "30", _oneway: "true" } }, { en: { _desired: "mt", _distance: "30", _oneway: "true" } }, { en: { _desired: "my", _distance: "30", _oneway: "true" } }, { en: { _desired: "ne", _distance: "30", _oneway: "true" } }, { nb: { _desired: "nn", _distance: "20" } }, { no: { _desired: "nn", _distance: "20" } }, { en: { _desired: "nso", _distance: "30", _oneway: "true" } }, { en: { _desired: "ny", _distance: "30", _oneway: "true" } }, { en: { _desired: "nyn", _distance: "30", _oneway: "true" } }, { fr: { _desired: "oc", _distance: "20", _oneway: "true" } }, { en: { _desired: "om", _distance: "30", _oneway: "true" } }, { en: { _desired: "or", _distance: "30", _oneway: "true" } }, { en: { _desired: "pa", _distance: "30", _oneway: "true" } }, { en: { _desired: "pcm", _distance: "20", _oneway: "true" } }, { en: { _desired: "ps", _distance: "30", _oneway: "true" } }, { es: { _desired: "qu", _distance: "30", _oneway: "true" } }, { de: { _desired: "rm", _distance: "20", _oneway: "true" } }, { en: { _desired: "rn", _distance: "30", _oneway: "true" } }, { fr: { _desired: "rw", _distance: "30", _oneway: "true" } }, { hi: { _desired: "sa", _distance: "30", _oneway: "true" } }, { en: { _desired: "sd", _distance: "30", _oneway: "true" } }, { en: { _desired: "si", _distance: "30", _oneway: "true" } }, { en: { _desired: "sn", _distance: "30", _oneway: "true" } }, { en: { _desired: "so", _distance: "30", _oneway: "true" } }, { en: { _desired: "sq", _distance: "30", _oneway: "true" } }, { en: { _desired: "st", _distance: "30", _oneway: "true" } }, { id: { _desired: "su", _distance: "20", _oneway: "true" } }, { en: { _desired: "sw", _distance: "30", _oneway: "true" } }, { en: { _desired: "ta", _distance: "30", _oneway: "true" } }, { en: { _desired: "te", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tg", _distance: "30", _oneway: "true" } }, { en: { _desired: "ti", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tk", _distance: "30", _oneway: "true" } }, { en: { _desired: "tlh", _distance: "30", _oneway: "true" } }, { en: { _desired: "tn", _distance: "30", _oneway: "true" } }, { en: { _desired: "to", _distance: "30", _oneway: "true" } }, { ru: { _desired: "tt", _distance: "30", _oneway: "true" } }, { en: { _desired: "tum", _distance: "30", _oneway: "true" } }, { zh: { _desired: "ug", _distance: "20", _oneway: "true" } }, { ru: { _desired: "uk", _distance: "20", _oneway: "true" } }, { en: { _desired: "ur", _distance: "30", _oneway: "true" } }, { ru: { _desired: "uz", _distance: "30", _oneway: "true" } }, { fr: { _desired: "wo", _distance: "30", _oneway: "true" } }, { en: { _desired: "xh", _distance: "30", _oneway: "true" } }, { en: { _desired: "yi", _distance: "30", _oneway: "true" } }, { en: { _desired: "yo", _distance: "30", _oneway: "true" } }, { zh: { _desired: "za", _distance: "20", _oneway: "true" } }, { en: { _desired: "zu", _distance: "30", _oneway: "true" } }, { ar: { _desired: "aao", _distance: "10", _oneway: "true" } }, { ar: { _desired: "abh", _distance: "10", _oneway: "true" } }, { ar: { _desired: "abv", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acm", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acq", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acw", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acx", _distance: "10", _oneway: "true" } }, { ar: { _desired: "acy", _distance: "10", _oneway: "true" } }, { ar: { _desired: "adf", _distance: "10", _oneway: "true" } }, { ar: { _desired: "aeb", _distance: "10", _oneway: "true" } }, { ar: { _desired: "aec", _distance: "10", _oneway: "true" } }, { ar: { _desired: "afb", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ajp", _distance: "10", _oneway: "true" } }, { ar: { _desired: "apc", _distance: "10", _oneway: "true" } }, { ar: { _desired: "apd", _distance: "10", _oneway: "true" } }, { ar: { _desired: "arq", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ars", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ary", _distance: "10", _oneway: "true" } }, { ar: { _desired: "arz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "auz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "avl", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayh", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayl", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayn", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ayp", _distance: "10", _oneway: "true" } }, { ar: { _desired: "bbz", _distance: "10", _oneway: "true" } }, { ar: { _desired: "pga", _distance: "10", _oneway: "true" } }, { ar: { _desired: "shu", _distance: "10", _oneway: "true" } }, { ar: { _desired: "ssh", _distance: "10", _oneway: "true" } }, { az: { _desired: "azb", _distance: "10", _oneway: "true" } }, { et: { _desired: "vro", _distance: "10", _oneway: "true" } }, { ff: { _desired: "ffm", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fub", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fue", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuf", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuh", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fui", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuq", _distance: "10", _oneway: "true" } }, { ff: { _desired: "fuv", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gnw", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gui", _distance: "10", _oneway: "true" } }, { gn: { _desired: "gun", _distance: "10", _oneway: "true" } }, { gn: { _desired: "nhd", _distance: "10", _oneway: "true" } }, { iu: { _desired: "ikt", _distance: "10", _oneway: "true" } }, { kln: { _desired: "enb", _distance: "10", _oneway: "true" } }, { kln: { _desired: "eyo", _distance: "10", _oneway: "true" } }, { kln: { _desired: "niq", _distance: "10", _oneway: "true" } }, { kln: { _desired: "oki", _distance: "10", _oneway: "true" } }, { kln: { _desired: "pko", _distance: "10", _oneway: "true" } }, { kln: { _desired: "sgc", _distance: "10", _oneway: "true" } }, { kln: { _desired: "tec", _distance: "10", _oneway: "true" } }, { kln: { _desired: "tuy", _distance: "10", _oneway: "true" } }, { kok: { _desired: "gom", _distance: "10", _oneway: "true" } }, { kpe: { _desired: "gkp", _distance: "10", _oneway: "true" } }, { luy: { _desired: "ida", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lkb", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lko", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lks", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lri", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lrm", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lsm", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lto", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lts", _distance: "10", _oneway: "true" } }, { luy: { _desired: "lwg", _distance: "10", _oneway: "true" } }, { luy: { _desired: "nle", _distance: "10", _oneway: "true" } }, { luy: { _desired: "nyd", _distance: "10", _oneway: "true" } }, { luy: { _desired: "rag", _distance: "10", _oneway: "true" } }, { lv: { _desired: "ltg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bhr", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bjq", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bmm", _distance: "10", _oneway: "true" } }, { mg: { _desired: "bzc", _distance: "10", _oneway: "true" } }, { mg: { _desired: "msh", _distance: "10", _oneway: "true" } }, { mg: { _desired: "skg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "tdx", _distance: "10", _oneway: "true" } }, { mg: { _desired: "tkg", _distance: "10", _oneway: "true" } }, { mg: { _desired: "txy", _distance: "10", _oneway: "true" } }, { mg: { _desired: "xmv", _distance: "10", _oneway: "true" } }, { mg: { _desired: "xmw", _distance: "10", _oneway: "true" } }, { mn: { _desired: "mvf", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bjn", _distance: "10", _oneway: "true" } }, { ms: { _desired: "btj", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bve", _distance: "10", _oneway: "true" } }, { ms: { _desired: "bvu", _distance: "10", _oneway: "true" } }, { ms: { _desired: "coa", _distance: "10", _oneway: "true" } }, { ms: { _desired: "dup", _distance: "10", _oneway: "true" } }, { ms: { _desired: "hji", _distance: "10", _oneway: "true" } }, { ms: { _desired: "id", _distance: "10", _oneway: "true" } }, { ms: { _desired: "jak", _distance: "10", _oneway: "true" } }, { ms: { _desired: "jax", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kvb", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kvr", _distance: "10", _oneway: "true" } }, { ms: { _desired: "kxd", _distance: "10", _oneway: "true" } }, { ms: { _desired: "lce", _distance: "10", _oneway: "true" } }, { ms: { _desired: "lcf", _distance: "10", _oneway: "true" } }, { ms: { _desired: "liw", _distance: "10", _oneway: "true" } }, { ms: { _desired: "max", _distance: "10", _oneway: "true" } }, { ms: { _desired: "meo", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mfa", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mfb", _distance: "10", _oneway: "true" } }, { ms: { _desired: "min", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mqg", _distance: "10", _oneway: "true" } }, { ms: { _desired: "msi", _distance: "10", _oneway: "true" } }, { ms: { _desired: "mui", _distance: "10", _oneway: "true" } }, { ms: { _desired: "orn", _distance: "10", _oneway: "true" } }, { ms: { _desired: "ors", _distance: "10", _oneway: "true" } }, { ms: { _desired: "pel", _distance: "10", _oneway: "true" } }, { ms: { _desired: "pse", _distance: "10", _oneway: "true" } }, { ms: { _desired: "tmw", _distance: "10", _oneway: "true" } }, { ms: { _desired: "urk", _distance: "10", _oneway: "true" } }, { ms: { _desired: "vkk", _distance: "10", _oneway: "true" } }, { ms: { _desired: "vkt", _distance: "10", _oneway: "true" } }, { ms: { _desired: "xmm", _distance: "10", _oneway: "true" } }, { ms: { _desired: "zlm", _distance: "10", _oneway: "true" } }, { ms: { _desired: "zmi", _distance: "10", _oneway: "true" } }, { ne: { _desired: "dty", _distance: "10", _oneway: "true" } }, { om: { _desired: "gax", _distance: "10", _oneway: "true" } }, { om: { _desired: "hae", _distance: "10", _oneway: "true" } }, { om: { _desired: "orc", _distance: "10", _oneway: "true" } }, { or: { _desired: "spv", _distance: "10", _oneway: "true" } }, { ps: { _desired: "pbt", _distance: "10", _oneway: "true" } }, { ps: { _desired: "pst", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qub", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qud", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quf", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qug", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quk", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qul", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qup", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qur", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qus", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quw", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qux", _distance: "10", _oneway: "true" } }, { qu: { _desired: "quy", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qva", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qve", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvi", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvj", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvl", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvm", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvn", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvo", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvp", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvs", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvw", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qvz", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwa", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qwh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qws", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxa", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxc", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxh", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxl", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxn", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxo", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxp", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxr", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxt", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxu", _distance: "10", _oneway: "true" } }, { qu: { _desired: "qxw", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sdc", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sdn", _distance: "10", _oneway: "true" } }, { sc: { _desired: "sro", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aae", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aat", _distance: "10", _oneway: "true" } }, { sq: { _desired: "aln", _distance: "10", _oneway: "true" } }, { syr: { _desired: "aii", _distance: "10", _oneway: "true" } }, { uz: { _desired: "uzs", _distance: "10", _oneway: "true" } }, { yi: { _desired: "yih", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cdo", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cjy", _distance: "10", _oneway: "true" } }, { zh: { _desired: "cpx", _distance: "10", _oneway: "true" } }, { zh: { _desired: "czh", _distance: "10", _oneway: "true" } }, { zh: { _desired: "czo", _distance: "10", _oneway: "true" } }, { zh: { _desired: "gan", _distance: "10", _oneway: "true" } }, { zh: { _desired: "hak", _distance: "10", _oneway: "true" } }, { zh: { _desired: "hsn", _distance: "10", _oneway: "true" } }, { zh: { _desired: "lzh", _distance: "10", _oneway: "true" } }, { zh: { _desired: "mnp", _distance: "10", _oneway: "true" } }, { zh: { _desired: "nan", _distance: "10", _oneway: "true" } }, { zh: { _desired: "wuu", _distance: "10", _oneway: "true" } }, { zh: { _desired: "yue", _distance: "10", _oneway: "true" } }, { "*": { _desired: "*", _distance: "80" } }, { "en-Latn": { _desired: "am-Ethi", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "az-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "bn-Beng", _distance: "10", _oneway: "true" } }, { "zh-Hans": { _desired: "bo-Tibt", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "hy-Armn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ka-Geor", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "km-Khmr", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "kn-Knda", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "lo-Laoo", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ml-Mlym", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "my-Mymr", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ne-Deva", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "or-Orya", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "pa-Guru", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ps-Arab", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "sd-Arab", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "si-Sinh", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ta-Taml", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "te-Telu", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ti-Ethi", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "tk-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "ur-Arab", _distance: "10", _oneway: "true" } }, { "ru-Cyrl": { _desired: "uz-Latn", _distance: "10", _oneway: "true" } }, { "en-Latn": { _desired: "yi-Hebr", _distance: "10", _oneway: "true" } }, { "sr-Cyrl": { _desired: "sr-Latn", _distance: "5" } }, { "zh-Hans": { _desired: "za-Latn", _distance: "10", _oneway: "true" } }, { "zh-Hans": { _desired: "zh-Hani", _distance: "20", _oneway: "true" } }, { "zh-Hant": { _desired: "zh-Hani", _distance: "20", _oneway: "true" } }, { "ar-Arab": { _desired: "ar-Latn", _distance: "20", _oneway: "true" } }, { "bn-Beng": { _desired: "bn-Latn", _distance: "20", _oneway: "true" } }, { "gu-Gujr": { _desired: "gu-Latn", _distance: "20", _oneway: "true" } }, { "hi-Deva": { _desired: "hi-Latn", _distance: "20", _oneway: "true" } }, { "kn-Knda": { _desired: "kn-Latn", _distance: "20", _oneway: "true" } }, { "ml-Mlym": { _desired: "ml-Latn", _distance: "20", _oneway: "true" } }, { "mr-Deva": { _desired: "mr-Latn", _distance: "20", _oneway: "true" } }, { "ta-Taml": { _desired: "ta-Latn", _distance: "20", _oneway: "true" } }, { "te-Telu": { _desired: "te-Latn", _distance: "20", _oneway: "true" } }, { "zh-Hans": { _desired: "zh-Latn", _distance: "20", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Latn", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hani", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hira", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Kana", _distance: "5", _oneway: "true" } }, { "ja-Jpan": { _desired: "ja-Hrkt", _distance: "5", _oneway: "true" } }, { "ja-Hrkt": { _desired: "ja-Hira", _distance: "5", _oneway: "true" } }, { "ja-Hrkt": { _desired: "ja-Kana", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Hani", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Hang", _distance: "5", _oneway: "true" } }, { "ko-Kore": { _desired: "ko-Jamo", _distance: "5", _oneway: "true" } }, { "ko-Hang": { _desired: "ko-Jamo", _distance: "5", _oneway: "true" } }, { "*-*": { _desired: "*-*", _distance: "50" } }, { "ar-*-$maghreb": { _desired: "ar-*-$maghreb", _distance: "4" } }, { "ar-*-$!maghreb": { _desired: "ar-*-$!maghreb", _distance: "4" } }, { "ar-*-*": { _desired: "ar-*-*", _distance: "5" } }, { "en-*-$enUS": { _desired: "en-*-$enUS", _distance: "4" } }, { "en-*-GB": { _desired: "en-*-$!enUS", _distance: "3" } }, { "en-*-$!enUS": { _desired: "en-*-$!enUS", _distance: "4" } }, { "en-*-*": { _desired: "en-*-*", _distance: "5" } }, { "es-*-$americas": { _desired: "es-*-$americas", _distance: "4" } }, { "es-*-$!americas": { _desired: "es-*-$!americas", _distance: "4" } }, { "es-*-*": { _desired: "es-*-*", _distance: "5" } }, { "pt-*-$americas": { _desired: "pt-*-$americas", _distance: "4" } }, { "pt-*-$!americas": { _desired: "pt-*-$!americas", _distance: "4" } }, { "pt-*-*": { _desired: "pt-*-*", _distance: "5" } }, { "zh-Hant-$cnsar": { _desired: "zh-Hant-$cnsar", _distance: "4" } }, { "zh-Hant-$!cnsar": { _desired: "zh-Hant-$!cnsar", _distance: "4" } }, { "zh-Hant-*": { _desired: "zh-Hant-*", _distance: "5" } }, { "*-*-*": { _desired: "*-*-*", _distance: "4" } }] }, tB = { "001": ["001", "001-status-grouping", "002", "005", "009", "011", "013", "014", "015", "017", "018", "019", "021", "029", "030", "034", "035", "039", "053", "054", "057", "061", "142", "143", "145", "150", "151", "154", "155", "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DG", "DJ", "DK", "DM", "DO", "DZ", "EA", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "EU", "EZ", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "IC", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "QO", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "UN", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"], "002": ["002", "002-status-grouping", "011", "014", "015", "017", "018", "202", "AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV", "DJ", "DZ", "EA", "EG", "EH", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "IC", "IO", "KE", "KM", "LR", "LS", "LY", "MA", "MG", "ML", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RE", "RW", "SC", "SD", "SH", "SL", "SN", "SO", "SS", "ST", "SZ", "TD", "TF", "TG", "TN", "TZ", "UG", "YT", "ZA", "ZM", "ZW"], "003": ["003", "013", "021", "029", "AG", "AI", "AW", "BB", "BL", "BM", "BQ", "BS", "BZ", "CA", "CR", "CU", "CW", "DM", "DO", "GD", "GL", "GP", "GT", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PM", "PR", "SV", "SX", "TC", "TT", "US", "VC", "VG", "VI"], "005": ["005", "AR", "BO", "BR", "BV", "CL", "CO", "EC", "FK", "GF", "GS", "GY", "PE", "PY", "SR", "UY", "VE"], "009": ["009", "053", "054", "057", "061", "AC", "AQ", "AS", "AU", "CC", "CK", "CP", "CX", "DG", "FJ", "FM", "GU", "HM", "KI", "MH", "MP", "NC", "NF", "NR", "NU", "NZ", "PF", "PG", "PN", "PW", "QO", "SB", "TA", "TK", "TO", "TV", "UM", "VU", "WF", "WS"], "011": ["011", "BF", "BJ", "CI", "CV", "GH", "GM", "GN", "GW", "LR", "ML", "MR", "NE", "NG", "SH", "SL", "SN", "TG"], "013": ["013", "BZ", "CR", "GT", "HN", "MX", "NI", "PA", "SV"], "014": ["014", "BI", "DJ", "ER", "ET", "IO", "KE", "KM", "MG", "MU", "MW", "MZ", "RE", "RW", "SC", "SO", "SS", "TF", "TZ", "UG", "YT", "ZM", "ZW"], "015": ["015", "DZ", "EA", "EG", "EH", "IC", "LY", "MA", "SD", "TN"], "017": ["017", "AO", "CD", "CF", "CG", "CM", "GA", "GQ", "ST", "TD"], "018": ["018", "BW", "LS", "NA", "SZ", "ZA"], "019": ["003", "005", "013", "019", "019-status-grouping", "021", "029", "419", "AG", "AI", "AR", "AW", "BB", "BL", "BM", "BO", "BQ", "BR", "BS", "BV", "BZ", "CA", "CL", "CO", "CR", "CU", "CW", "DM", "DO", "EC", "FK", "GD", "GF", "GL", "GP", "GS", "GT", "GY", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PE", "PM", "PR", "PY", "SR", "SV", "SX", "TC", "TT", "US", "UY", "VC", "VE", "VG", "VI"], "021": ["021", "BM", "CA", "GL", "PM", "US"], "029": ["029", "AG", "AI", "AW", "BB", "BL", "BQ", "BS", "CU", "CW", "DM", "DO", "GD", "GP", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"], "030": ["030", "CN", "HK", "JP", "KP", "KR", "MN", "MO", "TW"], "034": ["034", "AF", "BD", "BT", "IN", "IR", "LK", "MV", "NP", "PK"], "035": ["035", "BN", "ID", "KH", "LA", "MM", "MY", "PH", "SG", "TH", "TL", "VN"], "039": ["039", "AD", "AL", "BA", "ES", "GI", "GR", "HR", "IT", "ME", "MK", "MT", "PT", "RS", "SI", "SM", "VA", "XK"], "053": ["053", "AU", "CC", "CX", "HM", "NF", "NZ"], "054": ["054", "FJ", "NC", "PG", "SB", "VU"], "057": ["057", "FM", "GU", "KI", "MH", "MP", "NR", "PW", "UM"], "061": ["061", "AS", "CK", "NU", "PF", "PN", "TK", "TO", "TV", "WF", "WS"], 142: ["030", "034", "035", "142", "143", "145", "AE", "AF", "AM", "AZ", "BD", "BH", "BN", "BT", "CN", "CY", "GE", "HK", "ID", "IL", "IN", "IQ", "IR", "JO", "JP", "KG", "KH", "KP", "KR", "KW", "KZ", "LA", "LB", "LK", "MM", "MN", "MO", "MV", "MY", "NP", "OM", "PH", "PK", "PS", "QA", "SA", "SG", "SY", "TH", "TJ", "TL", "TM", "TR", "TW", "UZ", "VN", "YE"], 143: ["143", "KG", "KZ", "TJ", "TM", "UZ"], 145: ["145", "AE", "AM", "AZ", "BH", "CY", "GE", "IL", "IQ", "JO", "KW", "LB", "OM", "PS", "QA", "SA", "SY", "TR", "YE"], 150: ["039", "150", "151", "154", "155", "AD", "AL", "AT", "AX", "BA", "BE", "BG", "BY", "CH", "CQ", "CZ", "DE", "DK", "EE", "ES", "FI", "FO", "FR", "GB", "GG", "GI", "GR", "HR", "HU", "IE", "IM", "IS", "IT", "JE", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SJ", "SK", "SM", "UA", "VA", "XK"], 151: ["151", "BG", "BY", "CZ", "HU", "MD", "PL", "RO", "RU", "SK", "UA"], 154: ["154", "AX", "CQ", "DK", "EE", "FI", "FO", "GB", "GG", "IE", "IM", "IS", "JE", "LT", "LV", "NO", "SE", "SJ"], 155: ["155", "AT", "BE", "CH", "DE", "FR", "LI", "LU", "MC", "NL"], 202: ["011", "014", "017", "018", "202", "AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV", "DJ", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "IO", "KE", "KM", "LR", "LS", "MG", "ML", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RE", "RW", "SC", "SH", "SL", "SN", "SO", "SS", "ST", "SZ", "TD", "TF", "TG", "TZ", "UG", "YT", "ZA", "ZM", "ZW"], 419: ["005", "013", "029", "419", "AG", "AI", "AR", "AW", "BB", "BL", "BO", "BQ", "BR", "BS", "BV", "BZ", "CL", "CO", "CR", "CU", "CW", "DM", "DO", "EC", "FK", "GD", "GF", "GP", "GS", "GT", "GY", "HN", "HT", "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "MX", "NI", "PA", "PE", "PR", "PY", "SR", "SV", "SX", "TC", "TT", "UY", "VC", "VE", "VG", "VI"], EU: ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "EU", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"], EZ: ["AT", "BE", "CY", "DE", "EE", "ES", "EZ", "FI", "FR", "GR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"], QO: ["AC", "AQ", "CP", "DG", "QO", "TA"], UN: ["AD", "AE", "AF", "AG", "AL", "AM", "AO", "AR", "AT", "AU", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BN", "BO", "BR", "BS", "BT", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "ER", "ES", "ET", "FI", "FJ", "FM", "FR", "GA", "GB", "GD", "GE", "GH", "GM", "GN", "GQ", "GR", "GT", "GW", "GY", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IN", "IQ", "IR", "IS", "IT", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MG", "MH", "MK", "ML", "MM", "MN", "MR", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NZ", "OM", "PA", "PE", "PG", "PH", "PK", "PL", "PT", "PW", "PY", "QA", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SI", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SY", "SZ", "TD", "TG", "TH", "TJ", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TZ", "UA", "UG", "UN", "US", "UY", "UZ", "VC", "VE", "VN", "VU", "WS", "YE", "ZA", "ZM", "ZW"] }, tU = /-u(?:-[0-9a-z]{2,8})+/gi;
      function tG(e10, t6, r2 = Error) {
        if (!e10) throw new r2(t6);
      }
      function tV(e10, t6, r2) {
        let [n2, a2, i2] = t6.split("-"), o2 = true;
        if (i2 && "$" === i2[0]) {
          let t7 = "!" !== i2[1], n3 = (t7 ? r2[i2.slice(1)] : r2[i2.slice(2)]).map((e11) => tB[e11] || [e11]).reduce((e11, t8) => [...e11, ...t8], []);
          o2 &&= n3.indexOf(e10.region || "") > -1 == t7;
        } else o2 &&= !e10.region || "*" === i2 || i2 === e10.region;
        return o2 &&= !e10.script || "*" === a2 || a2 === e10.script, o2 &&= !e10.language || "*" === n2 || n2 === e10.language;
      }
      function tH(e10) {
        return [e10.language, e10.script, e10.region].filter(Boolean).join("-");
      }
      function t$(e10, t6, r2) {
        for (let n2 of r2.matches) {
          let a2 = tV(e10, n2.desired, r2.matchVariables) && tV(t6, n2.supported, r2.matchVariables);
          if (n2.oneway || a2 || (a2 = tV(e10, n2.supported, r2.matchVariables) && tV(t6, n2.desired, r2.matchVariables)), a2) {
            let a3 = 10 * n2.distance;
            if (r2.paradigmLocales.indexOf(tH(e10)) > -1 != r2.paradigmLocales.indexOf(tH(t6)) > -1) return a3 - 1;
            return a3;
          }
        }
        throw Error("No matching distance found");
      }
      let tK = (Z = function(e10, t6) {
        let n2 = new Intl.Locale(e10).maximize(), a2 = new Intl.Locale(t6).maximize(), i2 = { language: n2.language, script: n2.script || "", region: n2.region || "" }, o2 = { language: a2.language, script: a2.script || "", region: a2.region || "" }, s2 = 0, d2 = function() {
          if (!r) {
            let e11 = tq["written-new"][0]?.paradigmLocales?._locales.split(" "), t7 = tq["written-new"].slice(1, 5);
            r = { matches: tq["written-new"].slice(5).map((e12) => {
              let t8 = Object.keys(e12)[0], r2 = e12[t8];
              return { supported: t8, desired: r2._desired, distance: +r2._distance, oneway: "true" === r2.oneway };
            }, {}), matchVariables: t7.reduce((e12, t8) => {
              let r2 = Object.keys(t8)[0], n3 = t8[r2];
              return e12[r2.slice(1)] = n3._value.split("+"), e12;
            }, {}), paradigmLocales: [...e11, ...e11.map((e12) => new Intl.Locale(e12.replace(/_/g, "-")).maximize().toString())] };
          }
          return r;
        }();
        return i2.language !== o2.language && (s2 += t$({ language: n2.language, script: "", region: "" }, { language: a2.language, script: "", region: "" }, d2)), i2.script !== o2.script && (s2 += t$({ language: n2.language, script: i2.script, region: "" }, { language: a2.language, script: o2.script, region: "" }, d2)), i2.region !== o2.region && (s2 += t$(i2, o2, d2)), s2;
      }, a = (Y = { serializer: (e10) => `${e10[0]}|${e10[1]}` }).cache ? Y.cache : { create: function() {
        return new tj();
      } }, i = Y && Y.serializer ? Y.serializer : function() {
        return JSON.stringify(arguments);
      }, (Y && Y.strategy ? Y.strategy : function(e10, t6) {
        var r2, n2;
        let a2 = 1 === e10.length ? tk : tD;
        return r2 = t6.cache.create(), n2 = t6.serializer, a2.bind(this, e10, r2, n2);
      })(Z, { cache: a, serializer: i })), tz = /* @__PURE__ */ new WeakMap();
      function tW(e10) {
        return Intl.getCanonicalLocales(e10)[0];
      }
      let tF = /* @__PURE__ */ new WeakMap();
      var tX = e.i(29300);
      function tZ(e10, t6, r2) {
        let n2, a2 = new tX.default({ headers: { "accept-language": e10.get("accept-language") || void 0 } }).languages();
        try {
          var i2;
          let e11 = t6.slice().sort((e12, t7) => t7.length - e12.length);
          i2 = function(e12, t7, r3, n3, a3, i3) {
            let o2, s2;
            if ("lookup" === r3.localeMatcher) o2 = function(e13, t8, r4) {
              let n4 = { locale: "" };
              for (let r5 of t8) {
                let t9 = r5.replace(tU, ""), a4 = function(e14, t10) {
                  let r6 = tF.get(e14);
                  r6 || (r6 = new Set(e14), tF.set(e14, r6));
                  let n5 = t10;
                  for (; ; ) {
                    if (r6.has(n5)) return n5;
                    let e15 = n5.lastIndexOf("-");
                    if (!~e15) return;
                    e15 >= 2 && "-" === n5[e15 - 2] && (e15 -= 2), n5 = n5.slice(0, e15);
                  }
                }(e13, t9);
                if (a4) return n4.locale = a4, r5 !== t9 && (n4.extension = r5.slice(t9.length, r5.length)), n4;
              }
              return n4.locale = r4(), n4;
            }(Array.from(e12), t7, i3);
            else {
              var d2;
              let r4, n4, a4, s3, l3;
              d2 = Array.from(e12), a4 = [], s3 = t7.reduce((e13, t8) => {
                let r5 = t8.replace(tU, "");
                return a4.push(r5), e13[r5] = t8, e13;
              }, {}), (l3 = function(e13, t8, r5 = 838) {
                let n5 = 1 / 0, a5 = { matchedDesiredLocale: "", distances: {} }, i4 = tz.get(t8);
                i4 || (i4 = t8.map((e14) => {
                  try {
                    return Intl.getCanonicalLocales([e14])[0] || e14;
                  } catch {
                    return e14;
                  }
                }), tz.set(t8, i4));
                let o3 = new Set(i4);
                for (let t9 = 0; t9 < e13.length; t9++) {
                  let r6 = e13[t9];
                  if (o3.has(r6)) {
                    let e14 = 0 + 40 * t9;
                    if (a5.distances[r6] = { [r6]: e14 }, e14 < n5 && (n5 = e14, a5.matchedDesiredLocale = r6, a5.matchedSupportedLocale = r6), 0 === t9) return a5;
                  }
                }
                for (let t9 = 0; t9 < e13.length; t9++) {
                  let r6 = e13[t9];
                  try {
                    let e14 = new Intl.Locale(r6).maximize().toString();
                    if (e14 !== r6) {
                      let i5 = function(e15) {
                        let t10 = [], r7 = e15;
                        for (; r7; ) {
                          t10.push(r7);
                          let e16 = r7.lastIndexOf("-");
                          if (-1 === e16) break;
                          r7 = r7.substring(0, e16);
                        }
                        return t10;
                      }(e14);
                      for (let s4 = 0; s4 < i5.length; s4++) {
                        let d3 = i5[s4];
                        if (d3 !== r6 && o3.has(d3)) {
                          let i6;
                          try {
                            i6 = new Intl.Locale(d3).maximize().toString() === e14 ? 0 + 40 * t9 : 10 * s4 + 40 * t9;
                          } catch {
                            i6 = 10 * s4 + 40 * t9;
                          }
                          a5.distances[r6] || (a5.distances[r6] = {}), a5.distances[r6][d3] = i6, i6 < n5 && (n5 = i6, a5.matchedDesiredLocale = r6, a5.matchedSupportedLocale = d3);
                          break;
                        }
                      }
                    }
                  } catch {
                  }
                }
                return a5.matchedSupportedLocale && 0 === n5 || (e13.forEach((e14, r6) => {
                  a5.distances[e14] || (a5.distances[e14] = {}), i4.forEach((i5, o4) => {
                    let s4 = t8[o4], d3 = tK(e14, i5) + 0 + 40 * r6;
                    a5.distances[e14][s4] = d3, d3 < n5 && (n5 = d3, a5.matchedDesiredLocale = e14, a5.matchedSupportedLocale = s4);
                  });
                }), n5 >= r5 && (a5.matchedDesiredLocale = void 0, a5.matchedSupportedLocale = void 0)), a5;
              }(a4, d2)).matchedSupportedLocale && l3.matchedDesiredLocale && (r4 = l3.matchedSupportedLocale, n4 = s3[l3.matchedDesiredLocale].slice(l3.matchedDesiredLocale.length) || void 0), o2 = r4 ? { locale: r4, extension: n4 } : { locale: i3() };
            }
            null == o2 && (o2 = { locale: i3(), extension: "" });
            let l2 = o2.locale, u2 = a3[l2], c2 = { locale: "en", dataLocale: l2 };
            s2 = o2.extension ? function(e13) {
              let t8;
              tG(e13 === e13.toLowerCase(), "Expected extension to be lowercase"), tG("-u-" === e13.slice(0, 3), "Expected extension to be a Unicode locale extension");
              let r4 = [], n4 = [], a4 = e13.length, i4 = 3;
              for (; i4 < a4; ) {
                let o3, s3 = e13.indexOf("-", i4);
                o3 = -1 === s3 ? a4 - i4 : s3 - i4;
                let d3 = e13.slice(i4, i4 + o3);
                tG(o3 >= 2, "Expected a subtag to have at least 2 characters"), void 0 === t8 && 2 != o3 ? -1 === r4.indexOf(d3) && r4.push(d3) : 2 === o3 ? (t8 = { key: d3, value: "" }, void 0 === n4.find((e14) => e14.key === t8?.key) && n4.push(t8)) : t8?.value === "" ? t8.value = d3 : (tG(void 0 !== t8, "Expected keyword to be defined"), t8.value += "-" + d3), i4 += o3 + 1;
              }
              return { attributes: r4, keywords: n4 };
            }(o2.extension).keywords : [];
            let _2 = [];
            for (let e13 of n3) {
              let t8, n4 = u2?.[e13] ?? [];
              tG(Array.isArray(n4), `keyLocaleData for ${e13} must be an array`);
              let a4 = n4[0];
              tG(void 0 === a4 || "string" == typeof a4, "value must be a string or undefined");
              let i4 = s2.find((t9) => t9.key === e13);
              if (i4) {
                let r4 = i4.value;
                "" !== r4 ? n4.indexOf(r4) > -1 && (t8 = { key: e13, value: a4 = r4 }) : n4.indexOf("true") > -1 && (t8 = { key: e13, value: a4 = "true" });
              }
              let o3 = r3[e13];
              tG(null == o3 || "string" == typeof o3, "optionsValue must be a string or undefined"), "string" == typeof o3 && "" === (o3 = function(e14, t9) {
                let r4 = t9.toLowerCase();
                return tG(void 0 !== e14, "ukey must be defined"), r4;
              }(e13.toLowerCase(), o3)) && (o3 = "true"), o3 !== a4 && n4.indexOf(o3) > -1 && (a4 = o3, t8 = void 0), t8 && _2.push(t8), c2[e13] = a4;
            }
            return _2.length > 0 && (l2 = function(e13, t8, r4) {
              tG(-1 === e13.indexOf("-u-"), "Expected locale to not have a Unicode locale extension");
              let n4 = "-u";
              for (let e14 of t8) n4 += `-${e14}`;
              for (let e14 of r4) {
                let { key: t9, value: r5 } = e14;
                n4 += `-${t9}`, "" !== r5 && (n4 += `-${r5}`);
              }
              if ("-u" === n4) return tW(e13);
              let a4 = e13.indexOf("-x-");
              return tW(-1 === a4 ? e13 + n4 : e13.slice(0, a4) + n4 + e13.slice(a4));
            }(l2, [], _2)), c2.locale = l2, c2;
          }(e11, Intl.getCanonicalLocales(a2), { localeMatcher: "best fit" }, [], {}, () => r2).locale, n2 = t6.find((e12) => e12.toLowerCase() === i2.toLowerCase());
        } catch {
        }
        return n2;
      }
      function tY(e10, t6) {
        if (e10.localeCookie && t6.has(e10.localeCookie.name)) {
          let r2 = t6.get(e10.localeCookie.name)?.value;
          if (r2 && e10.locales.includes(r2)) return r2;
        }
      }
      function tJ(e10, t6, r2, n2) {
        let a2;
        return n2 && (a2 = tN(n2, e10.locales, e10.localePrefix)?.locale), !a2 && e10.localeDetection && (a2 = tY(e10, r2)), !a2 && e10.localeDetection && (a2 = tZ(t6, e10.locales, e10.defaultLocale)), a2 || (a2 = e10.defaultLocale), a2;
      }
      let tQ = (o = { ...J = { locales: ["zh", "en"], defaultLocale: "zh" }, localePrefix: "object" == typeof (ee = J.localePrefix) ? ee : { mode: ee || "always" }, localeCookie: !!((Q = J.localeCookie) ?? 1) && { name: "NEXT_LOCALE", sameSite: "lax", ..."object" == typeof Q && Q }, localeDetection: J.localeDetection ?? true, alternateLinks: J.alternateLinks ?? true }, function(e10) {
        var t6, r2;
        let n2;
        try {
          n2 = decodeURI(e10.nextUrl.pathname);
        } catch {
          return ed.next();
        }
        let a2 = n2.replace(/\\/g, "%5C").replace(/\/+/g, "/"), { domain: i2, locale: s2 } = (t6 = e10.headers, r2 = e10.cookies, o.domains ? function(e11, t7, r3, n3) {
          let a3, i3 = function(e12, t8) {
            let r4 = tL(e12);
            if (r4) return t8.find((e13) => e13.domain === r4);
          }(t7, e11.domains);
          if (!i3) return { locale: tJ(e11, t7, r3, n3) };
          if (n3) {
            let t8 = tN(n3, e11.locales, e11.localePrefix, i3)?.locale;
            if (t8) {
              if (!tI(t8, i3)) return { locale: t8, domain: i3 };
              a3 = t8;
            }
          }
          if (!a3 && e11.localeDetection) {
            let t8 = tY(e11, r3);
            t8 && tI(t8, i3) && (a3 = t8);
          }
          if (!a3 && e11.localeDetection) {
            let e12 = tZ(t7, i3.locales, i3.defaultLocale);
            e12 && (a3 = e12);
          }
          return a3 || (a3 = i3.defaultLocale), { locale: a3, domain: i3 };
        }(o, t6, r2, a2) : { locale: tJ(o, t6, r2, a2) }), d2 = i2 ? i2.defaultLocale === s2 : s2 === o.defaultLocale, l2 = o.domains?.filter((e11) => tI(s2, e11)) || [], u2 = null != o.domains && !i2;
        function c2(t7) {
          var r3;
          let n3 = new URL(t7, e10.url);
          e10.nextUrl.basePath && (r3 = n3.pathname, n3.pathname = tw(e10.nextUrl.basePath + r3));
          let a3 = new Headers(e10.headers);
          return a3.set("X-NEXT-INTL-LOCALE", s2), tw(e10.nextUrl.pathname) !== tw(n3.pathname) ? ed.rewrite(n3, { request: { headers: a3 } }) : ed.next({ request: { headers: a3 } });
        }
        function _2(t7, r3) {
          var n3;
          let a3 = new URL(t7, e10.url);
          if (a3.pathname = tw(a3.pathname), l2.length > 0 && !r3 && i2) {
            let e11 = tA(i2, s2, l2);
            e11 && (r3 = e11.domain, e11.defaultLocale === s2 && "as-needed" === o.localePrefix.mode && (a3.pathname = tR(a3.pathname, o.locales, o.localePrefix)));
          }
          return r3 && (a3.host = r3, e10.headers.get("x-forwarded-host")) && (a3.protocol = e10.headers.get("x-forwarded-proto") ?? e10.nextUrl.protocol, a3.port = r3.split(":")[1] ?? e10.headers.get("x-forwarded-port") ?? ""), e10.nextUrl.basePath && (n3 = a3.pathname, a3.pathname = tw(e10.nextUrl.basePath + n3)), w2 = true, ed.redirect(a3.toString());
        }
        let p2 = tR(a2, o.locales, o.localePrefix), f2 = tN(a2, o.locales, o.localePrefix, i2), h2 = null != f2, g2 = "never" === o.localePrefix.mode || d2 && "as-needed" === o.localePrefix.mode, y2, m2, w2, v2 = p2, b2 = o.pathnames;
        if (b2) {
          let t7;
          if ([t7, m2] = function(e11, t8, r3) {
            for (let n3 of Object.keys(e11).sort(tO)) {
              let a3 = e11[n3];
              if ("string" == typeof a3) {
                if (tv(a3, t8)) return [void 0, n3];
              } else {
                let i3 = Object.entries(a3), o2 = i3.findIndex(([e12]) => e12 === r3);
                for (let [r4] of (o2 > 0 && i3.unshift(i3.splice(o2, 1)[0]), i3)) if (tv(tm(e11[n3], r4, n3), t8)) return [r4, n3];
              }
            }
            for (let r4 of Object.keys(e11)) if (tv(r4, t8)) return [void 0, r4];
            return [void 0, void 0];
          }(b2, p2, s2), m2) {
            let r3 = b2[m2], n3 = tm(r3, s2, m2);
            if (tv(n3, p2)) v2 = tT(p2, n3, m2);
            else {
              let a3;
              a3 = t7 ? tm(r3, t7, m2) : m2;
              let i3 = g2 ? void 0 : tb(s2, o.localePrefix);
              y2 = _2(tM(tT(p2, a3, n3), i3, e10.nextUrl.search));
            }
          }
        }
        if (!y2) if ("/" !== v2 || h2) {
          let t7 = tM(v2, `/${s2}`, e10.nextUrl.search);
          if (h2) {
            let r3 = tM(p2, f2.prefix, e10.nextUrl.search);
            if ("never" === o.localePrefix.mode) y2 = _2(tM(p2, void 0, e10.nextUrl.search));
            else if (f2.exact) if (d2 && g2) y2 = _2(tM(p2, void 0, e10.nextUrl.search));
            else if (o.domains) {
              let e11 = tA(i2, f2.locale, l2);
              y2 = i2?.domain === e11?.domain || u2 ? c2(t7) : _2(r3, e11?.domain);
            } else y2 = c2(t7);
            else y2 = _2(r3);
          } else y2 = g2 ? c2(t7) : _2(tM(p2, tb(s2, o.localePrefix), e10.nextUrl.search));
        } else y2 = g2 ? c2(tM(v2, `/${s2}`, e10.nextUrl.search)) : _2(tM(p2, tb(s2, o.localePrefix), e10.nextUrl.search));
        return function(e11, t7, r3, n3, a3) {
          if (!n3.localeCookie) return;
          let { name: i3, ...o2 } = n3.localeCookie, s3 = e11.cookies.has(i3);
          s3 && e11.cookies.get(i3)?.value !== r3 ? t7.cookies.set(i3, r3, { path: e11.nextUrl.basePath || void 0, ...o2 }) : s3 || tZ(e11.headers, a3?.locales || n3.locales, n3.defaultLocale) === r3 || t7.cookies.set(i3, r3, { path: e11.nextUrl.basePath || void 0, ...o2 });
        }(e10, y2, s2, o, i2), !w2 && "never" !== o.localePrefix.mode && o.alternateLinks && o.locales.length > 1 && y2.headers.set("Link", function({ internalTemplateName: e11, localizedPathnames: t7, request: r3, resolvedLocale: n3, routing: a3 }) {
          let i3 = r3.nextUrl.clone(), o2 = tL(r3.headers);
          function s3(e12, t8) {
            var n4;
            return e12.pathname = tw(e12.pathname), r3.nextUrl.basePath && ((e12 = new URL(e12)).pathname = (n4 = e12.pathname, tw(r3.nextUrl.basePath + n4))), `<${e12.toString()}>; rel="alternate"; hreflang="${t8}"`;
          }
          function d3(r4, a4) {
            return t7 && "object" == typeof t7 ? tT(r4, t7[n3] ?? e11, t7[a4] ?? e11) : r4;
          }
          o2 && (i3.port = "", i3.host = o2), i3.protocol = r3.headers.get("x-forwarded-proto") ?? i3.protocol, i3.pathname = tR(i3.pathname, a3.locales, a3.localePrefix);
          let l3 = tP(a3.locales, a3.localePrefix, false).flatMap(([e12, r4]) => {
            let n4;
            function o3(e13) {
              return "/" === e13 ? r4 : r4 + e13;
            }
            if (a3.domains) return a3.domains.filter((t8) => tI(e12, t8)).map((t8) => ((n4 = new URL(i3)).port = "", n4.host = t8.domain, n4.pathname = d3(i3.pathname, e12), e12 === t8.defaultLocale && "always" !== a3.localePrefix.mode || (n4.pathname = o3(n4.pathname)), s3(n4, e12)));
            {
              let r5;
              r5 = t7 && "object" == typeof t7 ? d3(i3.pathname, e12) : i3.pathname, e12 === a3.defaultLocale && "always" !== a3.localePrefix.mode || (r5 = o3(r5)), n4 = new URL(r5, i3);
            }
            return s3(n4, e12);
          });
          if (!a3.domains || 0 === a3.domains.length) {
            let e12 = d3(i3.pathname, a3.defaultLocale);
            if (e12) {
              let t8 = new URL(e12, i3);
              l3.push(s3(t8, "x-default"));
            }
          }
          return l3.join(", ");
        }({ routing: o, internalTemplateName: m2, localizedPathnames: null != m2 && b2 ? b2[m2] : void 0, request: e10, resolvedLocale: s2 })), y2;
      }), t0 = { "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload", "X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "Permissions-Policy": "camera=(), microphone=(), geolocation=()", "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cards.iching.workers.dev https://api.deepseek.com https://api.openai.com;" };
      function t1(e10) {
        let t6 = tQ(e10);
        for (let [e11, r2] of Object.entries(t0)) t6.headers.set(e11, r2);
        return t6;
      }
      e.s(["config", 0, { matcher: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)" }, "default", () => t1], 96592);
      var t3 = e.i(96592);
      Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 });
      let t2 = { ...t3 }, t4 = "/middleware", t5 = t2.middleware || t2.default;
      if ("function" != typeof t5) throw new class extends Error {
        constructor(e10) {
          super(e10), this.stack = "";
        }
      }(`The Middleware file "${t4}" must export a function named \`middleware\` or a default function.`);
      e.s(["default", 0, (e10) => tg({ ...e10, page: t4, handler: async (...e11) => {
        try {
          return await t5(...e11);
        } catch (a2) {
          let t6 = e11[0], r2 = new URL(t6.url), n2 = r2.pathname + r2.search;
          throw await u(a2, { path: n2, method: t6.method, headers: Object.fromEntries(t6.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), a2;
        }
      } })], 58217);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_cb46ab6f.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_cb46ab6f = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_cb46ab6f.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_cb46ab6f.js", { otherChunks: ["chunks/[root-of-the-server]__cfc6ad0d._.js", "chunks/node_modules_340da56f._.js"], runtimeModuleIds: [35825] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = /* @__PURE__ */ new WeakMap();
      function r(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let n = r.prototype, o = Object.prototype.hasOwnProperty, u = "u" > typeof Symbol && Symbol.toStringTag;
      function l(e2, t2, r2) {
        o.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function i(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = s(t2), e2[t2] = r2), r2;
      }
      function s(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function a(e2, t2) {
        l(e2, "__esModule", { value: true }), u && l(e2, u, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          if ("number" == typeof o2) if (0 === o2) l(e2, n2, { value: t2[r2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[r2] ? l(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : l(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      n.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = i(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, a(n2, e2);
      }, n.j = function(e2, r2) {
        var n2, u2;
        let l2, s2, a2;
        null != r2 ? s2 = (l2 = i(this.c, r2)).exports : (l2 = this.m, s2 = this.e);
        let c2 = (n2 = l2, u2 = s2, (a2 = t.get(n2)) || (t.set(n2, a2 = []), n2.exports = n2.namespaceObject = new Proxy(u2, { get(e3, t2) {
          if (o.call(e3, t2) || "default" === t2 || "__esModule" === t2) return Reflect.get(e3, t2);
          for (let e4 of a2) {
            let r3 = Reflect.get(e4, t2);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t2 = Reflect.ownKeys(e3);
          for (let e4 of a2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t2.includes(r3) || t2.push(r3);
          return t2;
        } })), a2);
        "object" == typeof e2 && null !== e2 && c2.push(e2);
      }, n.v = function(e2, t2) {
        (null != t2 ? i(this.c, t2) : this.m).exports = e2;
      }, n.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? i(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let c = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, f = [null, c({}), c([]), c(c)];
      function d(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !f.includes(t3); t3 = c(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), a(t2, n2), t2;
      }
      function p(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function h(e2) {
        let t2 = N(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = d(r2, p(r2), r2 && r2.__esModule);
      }
      function m(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function b(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function y() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      n.i = h, n.A = function(e2) {
        return this.r(e2)(h.bind(this));
      }, n.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, n.r = function(e2) {
        return N(e2, this.m).exports;
      }, n.f = function(e2) {
        function t2(t3) {
          if (t3 = m(t3), o.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = m(t3), o.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let O = Symbol("turbopack queues"), g = Symbol("turbopack exports"), w = Symbol("turbopack error");
      function _(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      n.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: l2, promise: i2 } = y(), s2 = Object.assign(i2, { [g]: r2.exports, [O]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), s2.catch(() => {
          });
        } }), a2 = { get: () => s2, set(e3) {
          e3 !== s2 && (s2[g] = e3);
        } };
        Object.defineProperty(r2, "exports", a2), Object.defineProperty(r2, "namespaceObject", a2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (O in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [g]: {}, [O]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[g] = e5, _(t4);
                }, (e5) => {
                  r4[w] = e5, _(t4);
                }), r4;
              }
            }
            return { [g]: e4, [O]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[w]) throw e4[w];
            return e4[g];
          }), { promise: u3, resolve: l3 } = y(), i3 = Object.assign(() => l3(r3), { queueCount: 0 });
          function s3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (i3.queueCount++, e4.push(i3)));
          }
          return t3.map((e4) => e4[O](s3)), i3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? l2(s2[w] = e3) : u2(s2[g]), _(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let C = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function j(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      C.prototype = URL.prototype, n.U = C, n.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, n.g = globalThis;
      let k = r.prototype;
      var U, R = ((U = R || {})[U.Runtime = 0] = "Runtime", U[U.Parent = 1] = "Parent", U[U.Update = 2] = "Update", U);
      let P = /* @__PURE__ */ new Map();
      n.M = P;
      let v = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
      async function $(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return M(e2, t2, A(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!P.has(e3) || v.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let l2 = r2.moduleChunks || [], i2 = l2.map((e3) => T.get(e3)).filter((e3) => e3);
        if (i2.length > 0) {
          if (i2.length === l2.length) return void await Promise.all(i2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of l2) T.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = M(e2, t2, A(n3));
            T.set(n3, r4), i2.push(r4);
          }
          n2 = Promise.all(i2);
        } else {
          for (let o3 of (n2 = M(e2, t2, A(r2.path)), l2)) T.has(o3) || T.set(o3, n2);
        }
        for (let e3 of o2) v.has(e3) || v.set(e3, n2);
        await n2;
      }
      k.l = function(e2) {
        return $(1, this.m.id, e2);
      };
      let x = Promise.resolve(void 0), E = /* @__PURE__ */ new WeakMap();
      function M(t2, r2, n2) {
        let o2 = e.loadChunkCached(t2, n2), u2 = E.get(o2);
        if (void 0 === u2) {
          let e2 = E.set.bind(E, o2, x);
          u2 = o2.then(e2).catch((e3) => {
            let o3;
            switch (t2) {
              case 0:
                o3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case 1:
                o3 = `from module ${r2}`;
                break;
              case 2:
                o3 = "from an HMR update";
                break;
              default:
                j(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let u3 = Error(`Failed to load chunk ${n2} ${o3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw u3.name = "ChunkLoadError", u3;
          }), E.set(o2, u2);
        }
        return u2;
      }
      function A(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      k.L = function(e2) {
        return M(1, this.m.id, e2);
      }, k.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, k.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, k.b = function(e2) {
        let t2 = new Blob([`self.TURBOPACK_WORKER_LOCATION = ${JSON.stringify(location.origin)};
self.TURBOPACK_CHUNK_SUFFIX = ${JSON.stringify("")};
self.TURBOPACK_NEXT_CHUNK_URLS = ${JSON.stringify(e2.reverse().map(A), null, 2)};
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => self.TURBOPACK_WORKER_LOCATION + c).reverse());`], { type: "text/javascript" });
        return URL.createObjectURL(t2);
      };
      let K = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      n.w = function(t2, r2, n2) {
        return e.loadWebAssembly(1, this.m.id, t2, r2, n2);
      }, n.u = function(t2, r2) {
        return e.loadWebAssemblyModule(1, this.m.id, t2, r2);
      };
      let S = {};
      n.c = S;
      let N = (e2, t2) => {
        let r2 = S[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return q(e2, R.Parent, t2.id);
      };
      function q(e2, t2, n2) {
        let o2 = P.get(e2);
        if ("function" != typeof o2) throw Error(function(e3, t3, r2) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r2}`;
              break;
            case 1:
              n3 = `because it was required from module ${r2}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              j(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, n2));
        let u2 = s(e2), l2 = u2.exports;
        S[e2] = u2;
        let i2 = new r(u2, l2);
        try {
          o2(i2, u2, l2);
        } catch (e3) {
          throw u2.error = e3, e3;
        }
        return u2.namespaceObject && u2.exports !== u2.namespaceObject && d(u2.exports, u2.namespaceObject), u2;
      }
      function L(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          let t3 = decodeURIComponent(("u" > typeof TURBOPACK_NEXT_CHUNK_URLS ? TURBOPACK_NEXT_CHUNK_URLS.pop() : e2.getAttribute("src")).replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3, r3, n3) {
          let o2 = 1;
          for (; o2 < e2.length; ) {
            let t4 = e2[o2], n4 = o2 + 1;
            for (; n4 < e2.length && "function" != typeof e2[n4]; ) n4++;
            if (n4 === e2.length) throw Error("malformed chunk format, expected a factory function");
            if (!r3.has(t4)) {
              let u2 = e2[n4];
              for (Object.defineProperty(u2, "name", { value: "module evaluation" }); o2 < n4; o2++) t4 = e2[o2], r3.set(t4, u2);
            }
            o2 = n4 + 1;
          }
        }(t2, 0, P)), e.registerChunk(n2, r2);
      }
      function B(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : d(n2, p(n2), true);
      }
      n.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? d(t2.default, p(t2), true) : t2;
      }, B.resolve = (e2, t2) => __require.resolve(e2, t2), n.x = B, e = { registerChunk(e2, t2) {
        I.add(e2), function(e3) {
          let t3 = W.get(e3);
          if (null != t3) {
            for (let r2 of t3) r2.requiredChunks.delete(e3), 0 === r2.requiredChunks.size && F(r2.runtimeModuleIds, r2.chunkPath);
            W.delete(e3);
          }
        }(e2), null != t2 && (0 === t2.otherChunks.length ? F(t2.runtimeModuleIds, e2) : function(e3, t3, r2) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r2, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = b(e4);
            if (I.has(t4)) continue;
            n2.add(t4);
            let r3 = W.get(t4);
            null == r3 && (r3 = /* @__PURE__ */ new Set(), W.set(t4, r3)), r3.add(o2);
          }
          0 === o2.requiredChunks.size && F(o2.runtimeModuleIds, o2.chunkPath);
        }(e2, t2.otherChunks.filter((e3) => {
          var t3;
          return t3 = b(e3), K.test(t3);
        }), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      }, async loadWebAssembly(e2, t2, r2, n2, o2) {
        let u2 = await H(r2, n2);
        return await WebAssembly.instantiate(u2, o2);
      }, loadWebAssemblyModule: async (e2, t2, r2, n2) => H(r2, n2) };
      let I = /* @__PURE__ */ new Set(), W = /* @__PURE__ */ new Map();
      function F(e2, t2) {
        for (let r2 of e2) !function(e3, t3) {
          let r3 = S[t3];
          if (r3) {
            if (r3.error) throw r3.error;
            return;
          }
          q(t3, R.Runtime, e3);
        }(t2, r2);
      }
      async function H(e2, t2) {
        let r2;
        try {
          r2 = t2();
        } catch (e3) {
        }
        if (!r2) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
        return r2;
      }
      let X = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: L }, X.forEach(L);
    })();
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*))(\\\\.json)?[\\/#\\?]?$"] }];
    require_root_of_the_server_cfc6ad0d();
    require_node_modules_340da56f();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_cb46ab6f();
  }
});

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [], "qualities": [75], "unoptimized": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": {}, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/root/.openclaw/workspace/developer/iching-app", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "dynamicOnHover": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 1, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": false, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": false, "lockDistDir": true, "isolatedDevBuild": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": false, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "turbopack": { "resolveAlias": { "next-intl/config": "./src/i18n/request.ts" }, "root": "/root/.openclaw/workspace/developer/iching-app" }, "distDirRoot": ".next" };
var BuildId = "mFne5OV1MSQjUt8FwFEar";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/api/ai/interpret", "regex": "^/api/ai/interpret(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/ai/interpret(?:/)?$" }, { "page": "/api/ai-interpret", "regex": "^/api/ai\\-interpret(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/ai\\-interpret(?:/)?$" }, { "page": "/api/auth/register", "regex": "^/api/auth/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/register(?:/)?$" }, { "page": "/api/divination", "regex": "^/api/divination(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/divination(?:/)?$" }, { "page": "/api/favorites", "regex": "^/api/favorites(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/favorites(?:/)?$" }, { "page": "/api/user/preferences", "regex": "^/api/user/preferences(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/user/preferences(?:/)?$" }, { "page": "/api/user/profile", "regex": "^/api/user/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/user/profile(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }], "dynamic": [{ "page": "/api/auth/[...nextauth]", "regex": "^/api/auth/(.+?)(?:/)?$", "routeKeys": { "nxtPnextauth": "nxtPnextauth" }, "namedRegex": "^/api/auth/(?<nxtPnextauth>.+?)(?:/)?$" }, { "page": "/api/divination/[id]", "regex": "^/api/divination/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/divination/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/favorites/[id]", "regex": "^/api/favorites/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/favorites/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/hexagram/[number]", "regex": "^/api/hexagram/([^/]+?)(?:/)?$", "routeKeys": { "nxtPnumber": "nxtPnumber" }, "namedRegex": "^/api/hexagram/(?<nxtPnumber>[^/]+?)(?:/)?$" }, { "page": "/[locale]", "regex": "^/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)(?:/)?$" }, { "page": "/[locale]/auth", "regex": "^/([^/]+?)/auth(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/auth(?:/)?$" }, { "page": "/[locale]/divination", "regex": "^/([^/]+?)/divination(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/divination(?:/)?$" }, { "page": "/[locale]/hexagrams", "regex": "^/([^/]+?)/hexagrams(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/hexagrams(?:/)?$" }, { "page": "/[locale]/history", "regex": "^/([^/]+?)/history(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/history(?:/)?$" }, { "page": "/[locale]/result", "regex": "^/([^/]+?)/result(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/result(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [{ "source": "/(.*)", "headers": [{ "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" }, { "key": "X-Frame-Options", "value": "DENY" }, { "key": "X-Content-Type-Options", "value": "nosniff" }, { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }, { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }, { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cards.iching.workers.dev https://api.deepseek.com https://api.openai.com;" }], "regex": "^(?:/(.*))(?:/)?$" }];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "17150f080b5785420a186c1c885c473d", "previewModeSigningKey": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822", "previewModeEncryptionKey": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/[root-of-the-server]__cfc6ad0d._.js", "server/edge/chunks/node_modules_340da56f._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_cb46ab6f.js"], "name": "middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*))(\\\\.json)?[\\/#\\?]?$", "originalSource": "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } } }, "sortedMiddleware": ["/"], "functions": { "/[locale]/auth/page": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/next-font-manifest.js", "server/server-reference-manifest.js", "server/edge/chunks/ssr/node_modules_aba1968c._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_aeeb2a8e._.js", "server/edge/chunks/ssr/node_modules_d4b91f97._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_1de25341._.js", "server/edge/chunks/ssr/node_modules_next_dist_4be51fa8._.js", "server/edge/chunks/ssr/_9fa9a2af._.js", "server/edge/chunks/ssr/node_modules_6ec2f9a5._.js", "server/edge/chunks/ssr/_2849aa8b._.js", "server/edge/chunks/ssr/node_modules_ea963a87._.js", "server/edge/chunks/ssr/src_77d91046._.js", "server/app/[locale]/auth/page_client-reference-manifest.js", "server/edge/chunks/ssr/_next-internal_server_app_[locale]_auth_page_actions_d5bab714.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_66ff6d9f._.js", "server/edge/chunks/ssr/node_modules_79a247a8._.js", "server/edge/chunks/ssr/[root-of-the-server]__4f155d5c._.js", "server/edge/chunks/ssr/node_modules_next_dist_b615eeeb._.js", "server/edge/chunks/ssr/node_modules_next_dist_40e5b2b5._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_6ae48e70._.js", "server/edge/chunks/ssr/_e7180444._.js", "server/edge/chunks/ssr/[root-of-the-server]__9a08853c._.js", "server/edge/chunks/ssr/node_modules_next_dist_9e149d85._.js", "server/edge/chunks/ssr/node_modules_9e77ad39._.js", "server/edge/chunks/ssr/_15932f02._.js", "server/edge/chunks/ssr/node_modules_next_dist_compiled_2adaed9e._.js", "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_3ee8f1b8.js", "server/app/[locale]/auth/page/react-loadable-manifest.js"], "name": "app/[locale]/auth/page", "page": "/[locale]/auth/page", "matchers": [{ "regexp": "^/(?P<nxtPlocale>[^/]+?)/auth(?:/)?$", "originalSource": "/[locale]/auth" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/[locale]/divination/page": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/next-font-manifest.js", "server/server-reference-manifest.js", "server/edge/chunks/ssr/node_modules_aba1968c._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_aeeb2a8e._.js", "server/edge/chunks/ssr/node_modules_d4b91f97._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_1de25341._.js", "server/edge/chunks/ssr/node_modules_next_dist_4be51fa8._.js", "server/edge/chunks/ssr/_9fa9a2af._.js", "server/edge/chunks/ssr/node_modules_6ec2f9a5._.js", "server/edge/chunks/ssr/_2849aa8b._.js", "server/edge/chunks/ssr/node_modules_ea963a87._.js", "server/edge/chunks/ssr/_a46f1cc2._.js", "server/app/[locale]/divination/page_client-reference-manifest.js", "server/edge/chunks/ssr/_next-internal_server_app_[locale]_divination_page_actions_8c795503.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_66ff6d9f._.js", "server/edge/chunks/ssr/node_modules_79a247a8._.js", "server/edge/chunks/ssr/[root-of-the-server]__4cb29417._.js", "server/edge/chunks/ssr/node_modules_next_dist_b615eeeb._.js", "server/edge/chunks/ssr/node_modules_next_dist_40e5b2b5._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_6ae48e70._.js", "server/edge/chunks/ssr/_88f392e4._.js", "server/edge/chunks/ssr/[root-of-the-server]__9a08853c._.js", "server/edge/chunks/ssr/node_modules_next_dist_9e149d85._.js", "server/edge/chunks/ssr/node_modules_9e77ad39._.js", "server/edge/chunks/ssr/_15932f02._.js", "server/edge/chunks/ssr/node_modules_next_dist_compiled_2adaed9e._.js", "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_263fe367.js", "server/app/[locale]/divination/page/react-loadable-manifest.js"], "name": "app/[locale]/divination/page", "page": "/[locale]/divination/page", "matchers": [{ "regexp": "^/(?P<nxtPlocale>[^/]+?)/divination(?:/)?$", "originalSource": "/[locale]/divination" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/[locale]/hexagrams/page": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/next-font-manifest.js", "server/server-reference-manifest.js", "server/edge/chunks/ssr/node_modules_aba1968c._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_aeeb2a8e._.js", "server/edge/chunks/ssr/node_modules_d4b91f97._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_1de25341._.js", "server/edge/chunks/ssr/node_modules_next_dist_4be51fa8._.js", "server/edge/chunks/ssr/_9fa9a2af._.js", "server/edge/chunks/ssr/node_modules_6ec2f9a5._.js", "server/edge/chunks/ssr/_2849aa8b._.js", "server/edge/chunks/ssr/node_modules_ea963a87._.js", "server/edge/chunks/ssr/_9d3ab140._.js", "server/app/[locale]/hexagrams/page_client-reference-manifest.js", "server/edge/chunks/ssr/_next-internal_server_app_[locale]_hexagrams_page_actions_bdf24304.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_66ff6d9f._.js", "server/edge/chunks/ssr/node_modules_79a247a8._.js", "server/edge/chunks/ssr/[root-of-the-server]__4c406579._.js", "server/edge/chunks/ssr/node_modules_next_dist_b615eeeb._.js", "server/edge/chunks/ssr/node_modules_next_dist_40e5b2b5._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_6ae48e70._.js", "server/edge/chunks/ssr/_f9d1f0f4._.js", "server/edge/chunks/ssr/[root-of-the-server]__9a08853c._.js", "server/edge/chunks/ssr/node_modules_next_dist_9e149d85._.js", "server/edge/chunks/ssr/node_modules_9e77ad39._.js", "server/edge/chunks/ssr/_15932f02._.js", "server/edge/chunks/ssr/node_modules_next_dist_compiled_2adaed9e._.js", "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_e297e5c4.js", "server/app/[locale]/hexagrams/page/react-loadable-manifest.js"], "name": "app/[locale]/hexagrams/page", "page": "/[locale]/hexagrams/page", "matchers": [{ "regexp": "^/(?P<nxtPlocale>[^/]+?)/hexagrams(?:/)?$", "originalSource": "/[locale]/hexagrams" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/[locale]/history/page": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/next-font-manifest.js", "server/server-reference-manifest.js", "server/edge/chunks/ssr/node_modules_aba1968c._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_aeeb2a8e._.js", "server/edge/chunks/ssr/node_modules_d4b91f97._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_1de25341._.js", "server/edge/chunks/ssr/node_modules_next_dist_4be51fa8._.js", "server/edge/chunks/ssr/_9fa9a2af._.js", "server/edge/chunks/ssr/node_modules_6ec2f9a5._.js", "server/edge/chunks/ssr/_2849aa8b._.js", "server/edge/chunks/ssr/node_modules_ea963a87._.js", "server/edge/chunks/ssr/_0cc1e9c1._.js", "server/app/[locale]/history/page_client-reference-manifest.js", "server/edge/chunks/ssr/_next-internal_server_app_[locale]_history_page_actions_a3ed661a.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_66ff6d9f._.js", "server/edge/chunks/ssr/node_modules_79a247a8._.js", "server/edge/chunks/ssr/[root-of-the-server]__9bbbcd4e._.js", "server/edge/chunks/ssr/node_modules_next_dist_b615eeeb._.js", "server/edge/chunks/ssr/node_modules_next_dist_40e5b2b5._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_6ae48e70._.js", "server/edge/chunks/ssr/_2f2c5442._.js", "server/edge/chunks/ssr/[root-of-the-server]__9a08853c._.js", "server/edge/chunks/ssr/node_modules_next_dist_9e149d85._.js", "server/edge/chunks/ssr/node_modules_9e77ad39._.js", "server/edge/chunks/ssr/_15932f02._.js", "server/edge/chunks/ssr/node_modules_next_dist_compiled_2adaed9e._.js", "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_2c80b81a.js", "server/app/[locale]/history/page/react-loadable-manifest.js"], "name": "app/[locale]/history/page", "page": "/[locale]/history/page", "matchers": [{ "regexp": "^/(?P<nxtPlocale>[^/]+?)/history(?:/)?$", "originalSource": "/[locale]/history" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/[locale]/page": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/next-font-manifest.js", "server/server-reference-manifest.js", "server/edge/chunks/ssr/node_modules_aba1968c._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_aeeb2a8e._.js", "server/edge/chunks/ssr/node_modules_d4b91f97._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_1de25341._.js", "server/edge/chunks/ssr/node_modules_next_dist_4be51fa8._.js", "server/edge/chunks/ssr/_9fa9a2af._.js", "server/edge/chunks/ssr/node_modules_6ec2f9a5._.js", "server/edge/chunks/ssr/_2849aa8b._.js", "server/edge/chunks/ssr/node_modules_ea963a87._.js", "server/edge/chunks/ssr/_b7269141._.js", "server/app/[locale]/page_client-reference-manifest.js", "server/edge/chunks/ssr/_next-internal_server_app_[locale]_page_actions_875c2b4a.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_66ff6d9f._.js", "server/edge/chunks/ssr/node_modules_79a247a8._.js", "server/edge/chunks/ssr/[root-of-the-server]__219a299d._.js", "server/edge/chunks/ssr/node_modules_next_dist_b615eeeb._.js", "server/edge/chunks/ssr/node_modules_next_dist_40e5b2b5._.js", "server/edge/chunks/ssr/_a46d4fe2._.js", "server/edge/chunks/ssr/node_modules_next_dist_compiled_2adaed9e._.js", "server/edge/chunks/ssr/node_modules_9e77ad39._.js", "server/edge/chunks/ssr/[root-of-the-server]__9a08853c._.js", "server/edge/chunks/ssr/node_modules_next_dist_9e149d85._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_6ae48e70._.js", "server/edge/chunks/ssr/_15932f02._.js", "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_5d8f5967.js", "server/app/[locale]/page/react-loadable-manifest.js"], "name": "app/[locale]/page", "page": "/[locale]/page", "matchers": [{ "regexp": "^/(?P<nxtPlocale>[^/]+?)(?:/)?$", "originalSource": "/[locale]" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/[locale]/result/page": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/next-font-manifest.js", "server/server-reference-manifest.js", "server/edge/chunks/ssr/node_modules_aba1968c._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_aeeb2a8e._.js", "server/edge/chunks/ssr/node_modules_d4b91f97._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_1de25341._.js", "server/edge/chunks/ssr/node_modules_next_dist_4be51fa8._.js", "server/edge/chunks/ssr/_9fa9a2af._.js", "server/edge/chunks/ssr/node_modules_6ec2f9a5._.js", "server/edge/chunks/ssr/_2849aa8b._.js", "server/edge/chunks/ssr/node_modules_ea963a87._.js", "server/edge/chunks/ssr/_ef037ed2._.js", "server/app/[locale]/result/page_client-reference-manifest.js", "server/edge/chunks/ssr/_next-internal_server_app_[locale]_result_page_actions_f19f7ef3.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_66ff6d9f._.js", "server/edge/chunks/ssr/node_modules_79a247a8._.js", "server/edge/chunks/ssr/[root-of-the-server]__214d2ce4._.js", "server/edge/chunks/ssr/node_modules_next_dist_b615eeeb._.js", "server/edge/chunks/ssr/node_modules_next_dist_40e5b2b5._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_6ae48e70._.js", "server/edge/chunks/ssr/_6069333b._.js", "server/edge/chunks/ssr/[root-of-the-server]__9a08853c._.js", "server/edge/chunks/ssr/node_modules_next_dist_9e149d85._.js", "server/edge/chunks/ssr/node_modules_9e77ad39._.js", "server/edge/chunks/ssr/_15932f02._.js", "server/edge/chunks/ssr/node_modules_next_dist_compiled_2adaed9e._.js", "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_e23363aa.js", "server/app/[locale]/result/page/react-loadable-manifest.js"], "name": "app/[locale]/result/page", "page": "/[locale]/result/page", "matchers": [{ "regexp": "^/(?P<nxtPlocale>[^/]+?)/result(?:/)?$", "originalSource": "/[locale]/result" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/ai-interpret/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/ai-interpret/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_ai-interpret_route_actions_d3564a02.js", "server/edge/chunks/[root-of-the-server]__1bc42bba._.js", "server/edge/chunks/_0953985d._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_3608b8de._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_413caaa3.js"], "name": "app/api/ai-interpret/route", "page": "/api/ai-interpret/route", "matchers": [{ "regexp": "^/api/ai-interpret(?:/)?$", "originalSource": "/api/ai-interpret" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/ai/interpret/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/ai/interpret/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_ai_interpret_route_actions_e7d1f6d1.js", "server/edge/chunks/[root-of-the-server]__54bf67b3._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-app-route_80ae7ec5.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0706858e.js"], "name": "app/api/ai/interpret/route", "page": "/api/ai/interpret/route", "matchers": [{ "regexp": "^/api/ai/interpret(?:/)?$", "originalSource": "/api/ai/interpret" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/auth/[...nextauth]/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/auth/[...nextauth]/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_auth_[___nextauth]_route_actions_5a8b4c61.js", "server/edge/chunks/[root-of-the-server]__f0604f5d._.js", "server/edge/chunks/_0953985d._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_3608b8de._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_d06b85b6.js"], "name": "app/api/auth/[...nextauth]/route", "page": "/api/auth/[...nextauth]/route", "matchers": [{ "regexp": "^/api/auth/(?P<nxtPnextauth>.+?)(?:/)?$", "originalSource": "/api/auth/[...nextauth]" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/auth/register/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/auth/register/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_auth_register_route_actions_c74724be.js", "server/edge/chunks/[root-of-the-server]__5e44ee53._.js", "server/edge/chunks/_0953985d._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_27c97ab7.js"], "name": "app/api/auth/register/route", "page": "/api/auth/register/route", "matchers": [{ "regexp": "^/api/auth/register(?:/)?$", "originalSource": "/api/auth/register" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/divination/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/divination/[id]/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_divination_[id]_route_actions_0a691fa6.js", "server/edge/chunks/[root-of-the-server]__09e032bc._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_af38e016.js"], "name": "app/api/divination/[id]/route", "page": "/api/divination/[id]/route", "matchers": [{ "regexp": "^/api/divination/(?P<nxtPid>[^/]+?)(?:/)?$", "originalSource": "/api/divination/[id]" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/divination/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/divination/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_divination_route_actions_32b1a7c8.js", "server/edge/chunks/[root-of-the-server]__69533469._.js", "server/edge/chunks/_0953985d._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_3608b8de._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_723261d3.js"], "name": "app/api/divination/route", "page": "/api/divination/route", "matchers": [{ "regexp": "^/api/divination(?:/)?$", "originalSource": "/api/divination" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/favorites/[id]/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/favorites/[id]/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_favorites_[id]_route_actions_e57479e6.js", "server/edge/chunks/[root-of-the-server]__18694044._.js", "server/edge/chunks/_0953985d._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_3608b8de._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_e3cb2a1c.js"], "name": "app/api/favorites/[id]/route", "page": "/api/favorites/[id]/route", "matchers": [{ "regexp": "^/api/favorites/(?P<nxtPid>[^/]+?)(?:/)?$", "originalSource": "/api/favorites/[id]" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/favorites/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/favorites/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_favorites_route_actions_b1dc2f3c.js", "server/edge/chunks/[root-of-the-server]__b89eb79a._.js", "server/edge/chunks/_0953985d._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_3608b8de._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_a6e6f85c.js"], "name": "app/api/favorites/route", "page": "/api/favorites/route", "matchers": [{ "regexp": "^/api/favorites(?:/)?$", "originalSource": "/api/favorites" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/hexagram/[number]/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/hexagram/[number]/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_hexagram_[number]_route_actions_e51ffc03.js", "server/edge/chunks/[root-of-the-server]__db632734._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_f9b016e8.js"], "name": "app/api/hexagram/[number]/route", "page": "/api/hexagram/[number]/route", "matchers": [{ "regexp": "^/api/hexagram/(?P<nxtPnumber>[^/]+?)(?:/)?$", "originalSource": "/api/hexagram/[number]" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/user/preferences/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/user/preferences/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_user_preferences_route_actions_cc2922c9.js", "server/edge/chunks/[root-of-the-server]__a7649912._.js", "server/edge/chunks/_0953985d._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_3608b8de._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_d84a1a76.js"], "name": "app/api/user/preferences/route", "page": "/api/user/preferences/route", "matchers": [{ "regexp": "^/api/user/preferences(?:/)?$", "originalSource": "/api/user/preferences" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } }, "/api/user/profile/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/user/profile/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_user_profile_route_actions_f563af4d.js", "server/edge/chunks/[root-of-the-server]__4dc50a91._.js", "server/edge/chunks/_0953985d._.js", "server/edge/chunks/_0f7f3ab7._.js", "server/edge/chunks/node_modules_next_dist_16e7cc16._.js", "server/edge/chunks/_3608b8de._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_36b501b6.js"], "name": "app/api/user/profile/route", "page": "/api/user/profile/route", "matchers": [{ "regexp": "^/api/user/profile(?:/)?$", "originalSource": "/api/user/profile" }], "wasm": [{ "name": "wasm_e57b3293da5c5867", "filePath": "server/edge/chunks/node_modules__prisma_client_query_compiler_fast_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "mFne5OV1MSQjUt8FwFEar", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "94SYsBd5q5g5sEVW/0p1BWqvk4Ru4ORcGq2XqJkqvbc=", "__NEXT_PREVIEW_MODE_ID": "17150f080b5785420a186c1c885c473d", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "738d36866aadcd6eef7e0d3ca68177bfe61850b18f8c9dbbbcb184512a6ce11c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "56ba475f9bcd648ab3cc41fc170434fd8a3315dcd95243eb75c76e4cf6882822" } } } };
var AppPathRoutesManifest = { "/[locale]/auth/page": "/[locale]/auth", "/[locale]/divination/page": "/[locale]/divination", "/[locale]/hexagrams/page": "/[locale]/hexagrams", "/[locale]/history/page": "/[locale]/history", "/[locale]/page": "/[locale]", "/[locale]/result/page": "/[locale]/result", "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/api/ai-interpret/route": "/api/ai-interpret", "/api/ai/interpret/route": "/api/ai/interpret", "/api/auth/[...nextauth]/route": "/api/auth/[...nextauth]", "/api/auth/register/route": "/api/auth/register", "/api/divination/[id]/route": "/api/divination/[id]", "/api/divination/route": "/api/divination", "/api/favorites/[id]/route": "/api/favorites/[id]", "/api/favorites/route": "/api/favorites", "/api/hexagram/[number]/route": "/api/hexagram/[number]", "/api/user/preferences/route": "/api/user/preferences", "/api/user/profile/route": "/api/user/profile", "/favicon.ico/route": "/favicon.ico" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/[locale]": {}, "/[locale]/auth": {}, "/[locale]/divination": {}, "/[locale]/hexagrams": {}, "/[locale]/history": {}, "/[locale]/result": {}, "/api/ai-interpret": {}, "/api/ai/interpret": {}, "/api/auth/[...nextauth]": {}, "/api/auth/register": {}, "/api/divination": {}, "/api/divination/[id]": {}, "/api/favorites": {}, "/api/favorites/[id]": {}, "/api/hexagram/[number]": {}, "/api/user/preferences": {}, "/api/user/profile": {} } };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream2 } from "node:stream/web";

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream2({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {});
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// ../../../../.npm/_npx/72a7346bab235e2f/node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
