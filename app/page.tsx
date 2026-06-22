"use client";

import { HOME_DATA } from "@/core/constant/home.constant";
import { useRaxon } from "@raxonltd/raxon-core";
import { useCart } from "@/core/hook/use.cart";

import {
  SectionHomeHero,
  SectionHomeValues,
  SectionHomeCollection,
  SectionHomePicks,
  SectionHomeRitual,
  SectionHomePalette,
  SectionHomeProducts,
  SectionHomeStory,
  SectionHomeTestimonials,
} from "@/core/theme/section/home";


import CartDrawer from "@/core/component/cart.drawer";

export default function Home() {
  const {
    addedItems,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    totalPrice,
  } = useCart();

  const { branch } = useRaxon();
  branch?.socialMediaLinks;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F1E9] text-[#5C4638] selection:bg-[#C9A99A] selection:text-[#F8F1E9]">
      <div className="border-y border-[#D9C5B0]/50 bg-[#EDE0D1]/60 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-14 gap-y-2 px-8 text-[11px] font-light tracking-[2.5px] text-[#8B6B57]/80">
          {(HOME_DATA?.TRUST_ITEMS ?? []).map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>

      <SectionHomeHero />
      <SectionHomeValues />
      <SectionHomeCollection />
      <SectionHomePicks />
      <SectionHomeRitual />
      <SectionHomeProducts />
      <SectionHomeStory />
      <SectionHomeTestimonials />
      <SectionHomePalette />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={addedItems}
        onRemove={removeFromCart}
        totalPrice={totalPrice}
        cartCount={cartCount}
      />
    </div>
  );
}
