export function shouldInjectContentScript(error: unknown): boolean {
  return (
    error instanceof Error &&
    /could not establish connection|receiving end does not exist/i.test(error.message)
  );
}
