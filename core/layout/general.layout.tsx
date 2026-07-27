import { RaxonProvider } from "@raxonltd/raxon-core";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import AppToaster from "@/core/component/app.toaster";
import GuestCartPreserve from "@/core/component/guest.cart.preserve";
import InitialLoader from "@/core/component/initial.loader";

export default function GeneralLayout({ children }: { children: React.ReactNode }) {
  return (
    <RaxonProvider apiKey={process.env.NEXT_PUBLIC_API_KEY ?? ""} apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}>
      <NuqsAdapter>
        <GuestCartPreserve />
        <InitialLoader>{children}</InitialLoader>
        <AppToaster />
      </NuqsAdapter>
    </RaxonProvider>
  );
}