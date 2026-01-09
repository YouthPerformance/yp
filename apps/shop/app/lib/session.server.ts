import { createCookieSessionStorage, type Session } from "@shopify/remix-oxygen";

export class HydrogenSession {
  constructor(
    private sessionStorage: ReturnType<typeof createCookieSessionStorage>,
    private session: Session,
  ) {}

  static async init(request: Request, secrets: string[]) {
    const sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "yp_session",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets,
        secure: process.env.NODE_ENV === "production",
      },
    });

    const session = await sessionStorage.getSession(request.headers.get("Cookie"));

    return new HydrogenSession(sessionStorage, session);
  }

  get has() {
    return this.session.has;
  }

  get get() {
    return this.session.get;
  }

  get flash() {
    return this.session.flash;
  }

  get unset() {
    return this.session.unset;
  }

  get set() {
    return this.session.set;
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}
