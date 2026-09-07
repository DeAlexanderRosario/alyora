declare module 'lucide-react';

declare module 'next/navigation' {
  export function notFound(): never;
  export function redirect(url: string, type?: string): never;
  export function useRouter(): {
    push(href: string): void;
    replace(href: string): void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(href: string): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string | string[]>;
}
