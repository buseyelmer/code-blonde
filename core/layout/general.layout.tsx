import { RaxonProvider } from "@raxonltd/raxon-core";
import AppToaster from "@/core/component/app.toaster";
import GuestCartPreserve from "@/core/component/guest.cart.preserve";

export default function GeneralLayout({ children }: { children: React.ReactNode }) {
  return (
    <RaxonProvider apiKey={process.env.NEXT_PUBLIC_API_KEY ?? ""} apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}>
      <GuestCartPreserve />
      {children}
      <AppToaster />
    </RaxonProvider>
  );
}