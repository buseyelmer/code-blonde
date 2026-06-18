import { CategoryBar } from "./CategoryBar";
import { Header } from "./Header";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 w-full min-w-0 max-w-full overflow-hidden">
      <Header />
      <CategoryBar />
    </div>
  );
}
