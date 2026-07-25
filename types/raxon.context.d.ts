import type { RefObject } from "react";

declare module "@raxonltd/raxon-core" {
  interface RaxonContextType {
    modalAuthRef?: RefObject<{ open: (tab?: "login" | "register") => void } | null>;
  }
}

export {};
