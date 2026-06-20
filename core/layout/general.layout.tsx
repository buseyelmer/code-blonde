import { RaxonProvider } from "@raxonltd/raxon-core";

export default function GeneralLayout({ children }: { children: React.ReactNode }) {
  return <RaxonProvider apiKey={process.env.NEXT_PUBLIC_API_KEY ?? ''} apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ''}>
    {children}
  </RaxonProvider>
}