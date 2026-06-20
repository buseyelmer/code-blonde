import { Collection } from "@raxonltd/raxon-core/interface/prisma.interface";
import first from "lodash/first";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ItemCollection({ collection }: { collection: Collection }) {

    let mobileMedia = collection.mediaRelateds?.find(it => it.tag.includes('mobile'))?.media?.relativePath;
    let webMedia = collection.mediaRelateds?.find(it => it.tag.includes('web'))?.media?.relativePath;
    let defaultMedia = mobileMedia ?? webMedia ?? first(collection.mediaRelateds)?.media?.relativePath;

    const imageUrl = defaultMedia ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${defaultMedia}` : 'https://placehold.co/800x1000';

  return (
    <Link key={collection.id} href={`/koleksiyon/${collection.id}`} className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer">
              <Image src={imageUrl} alt={collection.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-semibold tracking-tight text-white mb-2">{collection.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-white/90">{collection.shortDescription}</p>
                <span className="inline-flex items-center gap-2 border-b border-white pb-1 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition-all group-hover:gap-4">
                  Koleksiyonu Keşfet
                  <ArrowRight size={18} />
                </span>
              </div>
            </Link>
  );
}