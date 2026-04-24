declare module 'opencc-js' {
  export const Locale: {
    from: { cn: unknown; tw: unknown; hk: unknown; jp: unknown };
    to: { cn: unknown; tw: unknown; hk: unknown; jp: unknown };
  };
  export function ConverterFactory(from: unknown, to: unknown): (text: string) => string;
}
