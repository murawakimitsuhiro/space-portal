export async function flatMapAsync<A, B>(
    xs: Array<A>,
    f: (a: A, i: number) => Promise<Array<B>>,
  ): Promise<Array<B>> {
    const [ys, _] = await xs.reduce(async (o, a) => {
      const [ps, i] = await o;
      return [ps.concat(await f(a, i)), i + 1];
    }, Promise.resolve<[Array<B>, number]>([[], 0]));
    return ys;
  }

export function mapAsync<A, B>(
  xs: Array<A>,
  f: (a: A, i: number) => Promise<B>,
): Promise<Array<B>> {
  return flatMapAsync(xs, async (x, i) => [await f(x, i)]);
}
