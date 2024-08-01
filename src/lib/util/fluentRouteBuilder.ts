import { redirect } from "next/navigation";

type AsyncFunction = (...args: any[]) => Promise<any>;

type GuardOpts = {
  redirect?: string;
};

export class GuardError extends Error {}
export class FluentRouteBuilder<
  F extends AsyncFunction,
  G extends Function,
  M extends Function,
> {
  constructor(
    private f?: F,
    private g?: G,
    private m?: M,
    private guardOpts?: GuardOpts,
  ) {}

  guard<NG extends Function>(
    guardFn: NG,
    opts: GuardOpts,
  ): FluentRouteBuilder<F, NG, M> {
    return new FluentRouteBuilder<F, NG, M>(this.f, guardFn, this.m, opts);
  }
  // middleware<NM extends Function>(middlewareFn: NM): NextRouteHelper<F, G, NM> {
  //   return new NextRouteHelper<F, G, NM>(this.f, this.g, middlewareFn);
  // }

  function<NF extends AsyncFunction>(fn: NF): FluentRouteBuilder<NF, G, M> {
    return new FluentRouteBuilder<NF, G, M>(fn, this.g, this.m, this.guardOpts);
  }

  build(): F {
    if (!this.f) throw new Error("f is not defined");
    const innerF = this.f;
    const innerG = this.g;

    return (async (...args) => {
      if (innerG) {
        try {
          await innerG();
        } catch (e: any) {
          console.log("CATTCHED");
          console.log({ e, guardOpts: this.guardOpts });
          if (e instanceof GuardError && this.guardOpts?.redirect) {
            redirect(this.guardOpts.redirect);
          } else {
            throw e;
          }
        }
      }
      return await innerF(...args);
    }) as F;
  }

  route<NF extends AsyncFunction>(fn: NF): NF {
    return this.function(fn).build();
  }
}

class FactoryGetter {
  get routeBuilder() {
    return new FluentRouteBuilder();
  }
}
const factoryGetter = new FactoryGetter();
export const routeBuilder = factoryGetter.routeBuilder;
