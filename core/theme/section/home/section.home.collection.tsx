'use client';

import { useRaxon } from '@raxonltd/raxon-core';
import { ItemCollection } from '../../item/item.collection';

export function SectionHomeCollection() {
  const { collection } = useRaxon();

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight mb-4">Özel Koleksiyonlar</h2>
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto">Her anınıza özel, özenle hazırlanmış koleksiyonlarımız</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {collection.map(collection => (
            <ItemCollection key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
