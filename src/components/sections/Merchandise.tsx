"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Tag,
  Box,
  Crown,
  Sparkles,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useMerchandise } from "@/hooks/use-supabase-data";

// ============================================================
// Merchandise section — style mirip dengan Partners section.
// Reads from /api/merchandise (Supabase).
// ============================================================

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  apparel: Package,
  accessories: Tag,
  equipment: Box,
  bundle: Crown,
};

const CATEGORY_COLORS: Record<string, string> = {
  apparel: "from-[#FC7166] to-[#E54B40]",
  accessories: "from-[#FD8656] to-[#E56A1F]",
  equipment: "from-[#F39F23] to-[#C97D0E]",
  bundle: "from-[#884D3E] to-[#51343F]",
};

const CATEGORY_LABELS: Record<string, string> = {
  apparel: "Apparel",
  accessories: "Accessories",
  equipment: "Equipment",
  bundle: "Bundle",
};

export function Merchandise() {
  const { items, loading, source } = useMerchandise();

  // Group by category
  const byCategory = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryOrder = ["bundle", "apparel", "equipment", "accessories"];

  return (
    <section id="merchandise" className="relative py-4 lg:py-6 bg-[#FAEDE9] overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-40 -z-10" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#FC7166]/15 blur-3xl -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FC7166]/15 border border-[#FC7166]/30 mb-4">
            <ShoppingBag className="h-3.5 w-3.5 text-[#FC7166]" />
            <span
              className="text-xs font-bold text-[#FC7166] tracking-wide uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Official Merchandise {source === "supabase" ? "· Live" : "· Demo"}
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0E0F14] mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Merch <span className="text-gradient-brand">Riana On The Move</span>
          </h2>
          <p className="text-base text-[#884D3E] max-w-2xl mx-auto">
            Dukung perjalanan Road to MURI dengan merchandise resmi.
            Setiap pembelian turut mewujudkan rekor sejarah Zumba Step Terbesar di Indonesia.
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-[#FC7166] border-t-transparent rounded-full" />
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-[#0E0F14]/30" />
            <p className="text-[#0E0F14]/50">Belum ada merchandise tersedia.</p>
          </div>
        )}

        {/* Items grouped by category */}
        {!loading && items.length > 0 && (
          <div className="space-y-6">
            {categoryOrder.map((cat) => {
              const catItems = byCategory[cat] || [];
              if (catItems.length === 0) return null;
              const CatIcon = CATEGORY_ICONS[cat] || Package;
              return (
                <div key={cat}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${CATEGORY_COLORS[cat]} flex items-center justify-center`}>
                      <CatIcon className="h-4 w-4 text-white" />
                    </div>
                    <h3
                      className="text-xl font-black text-[#0E0F14]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {CATEGORY_LABELS[cat]}
                    </h3>
                    <span className="text-xs text-[#0E0F14]/40 font-mono">({catItems.length})</span>
                  </div>

                  {/* Items grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {catItems.map((item, i) => (
                      <MerchCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {!loading && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-[#FC7166]/10 to-[#FD8656]/10 border border-[#FC7166]/20">
              <Sparkles className="h-4 w-4 text-[#FC7166]" />
              <span className="text-sm text-[#0E0F14] font-bold">
                VIP Ticket holder mendapat merchandise eksklusif di setiap kota!
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// MerchCard — single merchandise item
// ============================================================
function MerchCard({ item, index }: { item: MerchItem; index: number }) {
  const CatIcon = CATEGORY_ICONS[item.category] || Package;
  const discount = item.original_price && item.original_price > item.price
    ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
    : 0;
  const stockPct = item.stock > 0 ? Math.min(Math.round((item.sold / (item.stock + item.sold)) * 100), 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className={`group relative rounded-2xl bg-white border-2 transition-all overflow-hidden ${
        item.is_exclusive
          ? "border-[#FC7166]/40 hover:border-[#FC7166] hover:shadow-lg"
          : "border-[#FC7166]/15 hover:border-[#FC7166]/40 hover:shadow-md"
      }`}
    >
      {/* Top accent bar */}
      <div className={`h-1 bg-gradient-to-r ${CATEGORY_COLORS[item.category]}`} />

      {/* Image / placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-[#FFF1ED] to-[#FFE0D6] flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[item.category]} flex items-center justify-center shadow-lg`}>
            <CatIcon className="h-8 w-8 text-white" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.is_exclusive && (
            <span className="px-2 py-0.5 rounded-full bg-[#FC7166] text-white text-[9px] font-bold uppercase flex items-center gap-0.5">
              <Crown className="h-2.5 w-2.5" /> VIP
            </span>
          )}
          {item.is_bundle && (
            <span className="px-2 py-0.5 rounded-full bg-[#F39F23] text-[#0E0F14] text-[9px] font-bold uppercase flex items-center gap-0.5">
              <Package className="h-2.5 w-2.5" /> Bundle
            </span>
          )}
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
            -{discount}%
          </div>
        )}

        {/* Sold out overlay */}
        {item.status === "soldout" && (
          <div className="absolute inset-0 bg-[#0E0F14]/70 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-white text-[#0E0F14] text-[10px] font-bold uppercase">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h4
          className="font-black text-[#0E0F14] text-sm leading-tight mb-1 line-clamp-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {item.name}
        </h4>
        <p className="text-[10px] text-[#0E0F14]/60 line-clamp-2 mb-2">{item.description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-base font-black text-[#FC7166]" style={{ fontFamily: "var(--font-display)" }}>
            {item.price === 0 ? "Gratis" : `Rp ${item.price.toLocaleString("id-ID")}`}
          </span>
          {item.original_price && item.original_price > item.price && (
            <span className="text-[10px] text-[#0E0F14]/40 line-through">
              Rp {item.original_price.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        {/* Sold / stock indicator */}
        {item.sold > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-[#0E0F14]/50">
            <Star className="h-2.5 w-2.5 text-[#F39F23]" />
            <span>{item.sold} terjual</span>
            {item.stock > 0 && <span>· {item.stock} tersisa</span>}
          </div>
        )}

        {/* Stock progress bar (only if stock low) */}
        {item.stock > 0 && item.stock < 20 && (
          <div className="mt-1.5">
            <div className="h-1 rounded-full bg-[#FFE0D6] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FC7166] to-[#FD8656] rounded-full"
                style={{ width: `${stockPct}%` }}
              />
            </div>
            <div className="text-[9px] text-[#FC7166] font-bold mt-0.5 flex items-center gap-0.5">
              <CheckCircle2 className="h-2 w-2" />
              Hampir habis!
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
