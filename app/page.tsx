"use client";
import { HOME_DATA } from "@/core/constant/home.constant";
import type { Product, Shade } from "@/core/constant/home.constant";
import { useState } from "react";


import SectionHomeHero from "@/core/theme/section/home/section.home.hero";
import SectionHomeCollection from "@/core/theme/section/home/section.home.collection";
import SectionHomeProducts from "@/core/theme/section/home/section.home.products";
import SectionHomePalette from "@/core/theme/section/home/section.home.palette";
import SectionHomePhilosophy from "@/core/theme/section/home/section.home.philosophy";
import SectionHomeStory from "@/core/theme/section/home/section.home.story";
import SectionHomeTestimonials from "@/core/theme/section/home/section.home.testimonials";
import SectionHomeNewsletter from "@/core/theme/section/home/section.home.newsletter";

import CartDrawer from "@/core/component/cart.drawer";
import ProductModal from "@/core/component/product.modal";
import Footer from "@/core/component/footer";

export default function Home() {
  // States------
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<{ product: Product; shade: Shade }[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const currentShade = selectedProduct ? selectedProduct.shades[selectedShadeIndex] : null;

  const addToCart = () => {
    if (!selectedProduct || !currentShade) return;
    setAddedItems((prev) => [...prev, { product: selectedProduct, shade: currentShade }]);
    setCartCount((prev) => prev + 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const removeFromCart = (index: number) => {
    setAddedItems((prev) => prev.filter((_, i) => i !== index));
    setCartCount((prev) => Math.max(0, prev - 1));
  };

  const totalPrice = addedItems.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <div className='min-h-screen bg-[#F8F1E9] text-[#5C4638] overflow-x-hidden selection:bg-[#C9A99A] selection:text-[#F8F1E9]'>
      {/* Top Bar */}
      <div className='border-y border-[#D9C5B0]/50 bg-[#EDE0D1]/60 py-4'>
        <div className='max-w-6xl mx-auto px-8 flex flex-wrap justify-center items-center gap-x-14 gap-y-2 text-[11px] tracking-[2.5px] text-[#8B6B57]/80 font-light'>
          {(HOME_DATA?.TRUST_ITEMS ?? []).map((item) => <div key={item}>{item}</div>)}
        </div>
      </div>

      <SectionHomeHero />
      <SectionHomeCollection />
      
      <SectionHomeProducts 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        setSelectedProduct={setSelectedProduct}
        hoveredProduct={hoveredProduct}
        setHoveredProduct={setHoveredProduct}
      />

      <SectionHomePalette selectedTone={selectedTone} setSelectedTone={setSelectedTone} />
      <SectionHomeStory />
      <SectionHomePhilosophy />
      <SectionHomeTestimonials />
      <SectionHomeNewsletter />

      {selectedProduct && currentShade && (
        <ProductModal 
          product={selectedProduct} 
          currentShade={currentShade} 
          onClose={() => { setSelectedProduct(null); setSelectedShadeIndex(0); }} 
          onAddToCart={addToCart} 
          isAdded={isAdded} 
          setIsCartOpen={setIsCartOpen} 
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={addedItems} 
        onRemove={removeFromCart} 
        totalPrice={totalPrice} 
        cartCount={cartCount}
      />
    
      <Footer />
    </div>
  );
}