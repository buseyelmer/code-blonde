import { useRaxon } from "@raxonltd/raxon-core";
import _ from "lodash";

export default function SectionHomeCollection() {

    const {collection} = useRaxon();
    return <>
    
      {/* Collections Section - Enhanced from Theme/1 */}
      <section id='koleksiyon' className='py-20 lg:py-28'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mb-14 text-center'>
            <p className='text-xs tracking-[0.3em] uppercase text-[#A17E65]'>Koleksiyonlar</p>
            <h2 className='mt-3 font-serif text-4xl text-[#5C4638] lg:text-5xl'>Nude Serileri</h2>
            <p className='mx-auto mt-4 max-w-lg text-[#8B6B57]'>Her ten tonuna özel tasarlanmış üç imza koleksiyon</p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {collection.map((col, idx) => {
                let firstMediaRelation = _.first(col.mediaRelateds);
                let imagePath = `${process.env.NEXT_PUBLIC_STORAGE_URL}/${firstMediaRelation?.media?.relativePath}`;
                return (
                  <a key={col.id} href='#urunler' className='group relative overflow-hidden rounded-2xl' style={{ animationDelay: `${idx * 100}ms` }}>
                    {/* Background image with overlay */}
                    <div
                      className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-105 relative"
                      style={{
                        backgroundImage: `url('${imagePath}'), linear-gradient(145deg, #E8D5C4 0%, #C4A484 100%)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Overlay gradient on image */}
                      <div className='absolute inset-0 bg-gradient-to-t from-[#5C4638]/60 via-transparent to-transparent pointer-events-none' />
                    </div>
                    <div className='absolute inset-x-0 bottom-0 p-8'>
                      <p className='text-xs tracking-[0.25em] uppercase text-white/70'>{col.title}</p>
                      <h3 className='mt-2 font-serif text-3xl text-white'>{col.title}</h3>
                      <p className='mt-2 text-sm text-white/80 max-w-[200px]'>{col.description}</p>
                      <span className='mt-4 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/90 opacity-0 transition-opacity group-hover:opacity-100'>
                        İncele
                        <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </span>
                    </div>
                  </a>
                );
            })}
       
          </div>
        </div>
      </section>
    </>
}