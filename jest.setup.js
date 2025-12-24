// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Firebase
jest.mock("@/lib/firebase", () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  },
  db: {},
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Response for API tests
if (typeof Response === "undefined") {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.init = init;
      this.status = init.status || 200;
      this.statusText = init.statusText || "OK";

      // Create a proper headers object with get method
      const headerEntries = Object.entries(init.headers || {});
      this.headers = new Map(headerEntries);

      // Ensure get method works properly (Map already has get, but add case-insensitive support)
      const originalGet = this.headers.get.bind(this.headers);
      this.headers.get = (name) => {
        // Try exact match first
        let value = originalGet(name);
        if (value !== undefined) return value;

        // Try case-insensitive match
        const lowerName = name.toLowerCase();
        for (const [key, val] of this.headers.entries()) {
          if (key.toLowerCase() === lowerName) {
            return val;
          }
        }
        return null;
      };
    }

    static json(data, init = {}) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          "content-type": "application/json",
          ...(init.headers || {}),
        },
      });
    }

    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return String(this.body);
    }
  };
}

// Mock Request for API tests - use a minimal mock that doesn't conflict with NextRequest
if (typeof Request === "undefined") {
  global.Request = class Request {
    constructor(input, init = {}) {
      this._url = typeof input === "string" ? input : input.url;
      this._init = init;
    }

    get url() {
      return this._url;
    }

    get method() {
      return this._init.method || "GET";
    }

    get headers() {
      const headers = this._init.headers || {};
      return {
        get: (key) => headers[key] || null,
        has: (key) => key in headers,
        entries: () => Object.entries(headers),
      };
    }

    async json() {
      return this._init.body ? JSON.parse(this._init.body) : {};
    }

    async text() {
      return this._init.body || "";
    }

    clone() {
      return new Request(this._url, this._init);
    }
  };
}

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
