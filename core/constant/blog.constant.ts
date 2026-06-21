export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  coverUrl: string;
  publishedAt: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-nude-ruj-tonu",
    slug: "nude-ruj-tonu-nasil-secilir",
    title: "Nude Ruj Tonu Nasıl Seçilir? Cilt Alt Tonunuza Göre Rehber",
    shortDescription:
      "Sıcak, soğuk ve nötr alt tona göre nude ruj seçimi: dudak renginiz, cilt alt tonunuz ve doğal ışıkta test ipuçları.",
    metaTitle: "Nude Ruj Tonu Nasıl Seçilir? | Code Blonde Blog",
    metaDescription:
      "Cilt alt tonunuza göre nude ruj nasıl seçilir? Sıcak, soğuk ve nötr tenler için ton önerileri ve uzman uygulama ipuçları.",
    metaKeywords: [
      "nude ruj",
      "ruj tonu seçimi",
      "cilt alt tonu",
      "nude makyaj",
      "Code Blonde",
      "dudak makyajı",
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=800&fit=crop&q=80",
    publishedAt: "2026-03-15T10:00:00.000Z",
    content: `
<p>Doğru nude ruj, yüzünüzü soluklaştırmak yerine doğal bir ışıltı verir. Ancak her nude ton herkese uymaz — seçiminizi cilt alt tonunuza göre yapmak fark yaratır.</p>

<h2>Cilt Alt Tonunuzu Belirleyin</h2>
<p>Alt ton üç gruba ayrılır: <strong>sıcak</strong> (sarı veya altın yansıma), <strong>soğuk</strong> (pembe veya mavi yansıma) ve <strong>nötr</strong> (ikisinin dengeli karışımı). Bileğinizdeki damarlarınıza bakın: yeşilimsi damarlar sıcak, mavimsi damarlar soğuk alt tonu işaret eder.</p>

<h2>Sıcak Alt Tonlar İçin</h2>
<p>Karamel, bal ve şeftali tonları dudaklarınızı canlandırır. Turuncu veya kırmızı alt tonlu nude rujlar cildinizle bütünleşir. Kaçınılması gerekenler: pembe veya mor alt tonlu soğuk nude'lar — dudakta soluk veya gri görünebilir.</p>

<h2>Soğuk Alt Tonlar İçin</h2>
<p>Gül kurusu, pudra ve mürdüm nude tonları soğuk tenlerde en doğal görünümü verir. Turuncu-kahve karışımları yerine hafif pembe veya vişne alt tonlu ürünleri tercih edin.</p>

<h2>Doğal Işıkta Test Edin</h2>
<p>Mağaza aydınlatması yanıltıcı olabilir. Ruju çene hattınıza ve dudaklarınıza uygulayıp gün ışığında kontrol edin. Doğru ton, dudak renginizi bir ton koyulaştırır gibi görünür — yapay veya çizgi gibi durmaz.</p>

<h2>Code Blonde Önerisi</h2>
<p>Velvet Nude koleksiyonumuzdaki Poudre ve Sable tonları nötr-sıcak tenler için; Rose Cendré ise soğuk alt tonlarda harika sonuç verir. Tek başına ruj yerine dudak kalemiyle kontür yaparak tonu kişiselleştirebilirsiniz.</p>
    `.trim(),
  },
  {
    id: "blog-cilt-bakim-rutini",
    slug: "makyaj-oncesi-cilt-bakim-rutini",
    title: "Makyaj Öncesi Cilt Bakım Rutini: 5 Adımda Hazırlık",
    shortDescription:
      "Temizlikten nemlendirmeye, fondötenin pürüzsüz oturması için makyaj öncesi cilt hazırlığının 5 temel adımı.",
    metaTitle: "Makyaj Öncesi Cilt Bakım Rutini | Code Blonde Blog",
    metaDescription:
      "Fondötenin pürüzsüz oturması için makyaj öncesi 5 adımlı cilt bakım rutini. Temizlik, tonik, serum, nemlendirici ve SPF rehberi.",
    metaKeywords: [
      "makyaj öncesi cilt bakımı",
      "cilt hazırlığı",
      "fondöten uygulama",
      "nemlendirici",
      "cilt bakım rutini",
      "Code Blonde",
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=800&fit=crop&q=80",
    publishedAt: "2026-03-10T10:00:00.000Z",
    content: `
<p>Kalıcı ve doğal görünen makyajın sırrı, iyi hazırlanmış bir cilt yüzeyindedir. Aşağıdaki 5 adım, fondötenin eşit dağılmasını ve gün boyu taze kalmasını sağlar.</p>

<h2>1. Nazik Temizlik</h2>
<p>Makyaj öncesi cildi yağ ve kalıntılardan arındırın. Sert peelinglerden kaçının; aşırı temizlik cildi kurutarak fondötenin pullanmasına yol açar. Ilık su ve hafif, köpüren bir temizleyici yeterlidir.</p>

<h2>2. Tonik veya Essence</h2>
<p>pH dengesini restore eden bir tonik, sonraki ürünlerin emilimini artırır. Pamukla hafifçe tamponlayın; ovalamayın. Hassas ciltlerde alkol içermeyen formüller tercih edin.</p>

<h2>3. Hafif Serum</h2>
<p>Hyalüronik asit veya niacinamide içeren ince kıvamlı bir serum, nem bariyerini güçlendirir. Yağlı serumlardan kaçının; fondöten kaymasına neden olabilirler. Tam emilim için 1–2 dakika bekleyin.</p>

<h2>4. Nemlendirici</h2>
<p>Cilt tipinize uygun nemlendiriciyi ince bir tabaka halinde uygulayın. Kuru ciltlerde daha zengin, yağlı ciltlerde jel bazlı formüller idealdir. Göz çevresi için ayrı bir göz kremi kullanın — fondöten burada ilk çizgilenmeyi gösterir.</p>

<h2>5. SPF ve Primer</h2>
<p>Gündüz makyajında SPF şart. Nemlendiricinin üzerine güneş koruyucu sürün ve 5 dakika bekleyin. Ardından ihtiyaca göre gözenek doldurucu veya aydınlatıcı primer ekleyin. Primeri parmak uçlarıyla hafifçe bastırarak uygulayın.</p>

<blockquote>Altın kural: Her katmanın emilmesini bekleyin. Acele etmek ürünlerin topaklanmasına ve makyajın erken dağılmasına yol açar.</blockquote>
    `.trim(),
  },
  {
    id: "blog-mat-ruj-ipuclari",
    slug: "mat-ruj-kalisicilik-ipuclari",
    title: "Mat Ruj Kalıcılık İpuçları: Gün Boyu Taze Görünüm",
    shortDescription:
      "Mat rujun çatlamadan kalması için dudak hazırlığı, katmanlama tekniği ve gün içi dokunuş önerileri.",
    metaTitle: "Mat Ruj Kalıcılık İpuçları | Code Blonde Blog",
    metaDescription:
      "Mat ruj nasıl kalıcı olur? Dudak peelingi, primer, katmanlama ve gün içi bakım ipuçlarıyla çatlamayan mat ruj rehberi.",
    metaKeywords: [
      "mat ruj",
      "ruj kalıcılığı",
      "dudak makyajı",
      "mat ruj ipuçları",
      "nude ruj",
      "Code Blonde",
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=800&fit=crop&q=80",
    publishedAt: "2026-03-05T10:00:00.000Z",
    content: `
<p>Mat rujlar şık ve modern bir görünüm sunar; ancak kuru dudaklarda çatlayabilir veya gün ortasında solabilir. Doğru teknikle 8–12 saat kalıcı sonuç almak mümkündür.</p>

<h2>Dudak Hazırlığı</h2>
<p>Haftada bir kez nazik dudak peelingi yapın. Makyaj günü ince bir dudak balmı sürün, 5 dakika bekleyin ve fazlasını kağıt mendille alın. Yağlı bir tabaka bırakmayın — mat ruj bunun üzerinde kayar.</p>

<h2>Dudak Kalemi ile Kontür</h2>
<p>Rujunuzla uyumlu veya bir ton koyu bir dudak kalemiyle dudak çizgisini belirginleştirin. Kalemi tüm dudak yüzeyine hafifçe yayın; bu hem kalıcılığı artırır hem de rengin eşit dağılmasını sağlar.</p>

<h2>Katmanlama Tekniği</h2>
<p>İlk katmanı ince uygulayın, 30 saniye bekleyin, ikinci katmanı ekleyin. Fazla ürün çatlamaya neden olur. Ortadan başlayıp dışa doğru yaymak en doğal sonucu verir.</p>

<h2>Transparan Pudra Dokunuşu</h2>
<p>İsteğe bağlı: tek katman rujdan sonra dudaklar arasına ince bir kağıt mendil koyun, üzerine çok hafif transparan pudra uygulayın, ardından ikinci katman ruju sürün. Bu "sandwich" yöntemi kalıcılığı belirgin şekilde uzatır.</p>

<h2>Gün İçi Bakım</h2>
<p>Mat ruj kurudukça dudaklar gergin hissedebilir. Yanınızda dudak balmı bulundurun; ruju tamamen silmeden sadece orta kısma minik bir miktar uygulayın. Yemek sonrası hafifçe yenileyin — tüm ruju silip baştan sürmek yerine orta kısma dokunuş yeterlidir.</p>
    `.trim(),
  },
  {
    id: "blog-mevsimsel-nude-paleti",
    slug: "mevsimsel-nude-makyaj-paleti",
    title: "Mevsimsel Nude Makyaj Paleti: İlkbahar ve Yaz İçin Ton Önerileri",
    shortDescription:
      "İlkbahar ve yaz aylarında cildinizin tonuna uygun nude fondöten, allık ve ruj kombinasyonları.",
    metaTitle: "Mevsimsel Nude Makyaj Paleti | Code Blonde Blog",
    metaDescription:
      "İlkbahar ve yaz için nude makyaj paleti önerileri. Fondöten, allık ve ruj tonlarını mevsime göre nasıl seçersiniz?",
    metaKeywords: [
      "nude makyaj",
      "mevsimsel makyaj",
      "ilkbahar makyaj",
      "yaz makyajı",
      "fondöten tonu",
      "Code Blonde",
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&h=800&fit=crop&q=80",
    publishedAt: "2026-02-28T10:00:00.000Z",
    content: `
<p>Nude makyaj yıl boyu şıktır; ancak mevsim değişiminde cilt tonunuz ve ışık koşulları farklılaşır. İlkbahar ve yaz aylarında daha aydınlık, taze bir palet tercih etmek doğal görünümü güçlendirir.</p>

<h2>İlkbahar: Taze ve Aydınlık</h2>
<p>Kış sonrası cilt genelde biraz soluk görünür. Hafif pembe veya şeftali alt tonlu fondöten, yüzü canlandırır. Allıkta gül kurusu veya yumuşak mercan tonları idealdir. Dudaklarda parlak olmayan, nemli görünümlü nude veya roze-nude rujlar mevsime uygundur.</p>

<h3>İlkbahar Paleti Önerisi</h3>
<ul>
  <li><strong>Fondöten:</strong> Açık-orta kapsama, sıcak bej veya nötr kum tonu</li>
  <li><strong>Allık:</strong> Yumuşak pembe veya şeftali</li>
  <li><strong>Ruj:</strong> Rose Cendré veya benzeri roze-nude</li>
  <li><strong>Göz:</strong> Bronz veya taupe tek renk, hafif maskara</li>
</ul>

<h2>Yaz: Bronz ve Güneş Öpücüğü</h2>
<p>Yazın cilt genelde daha bronzlaşır. Fondöten tonunuzu bir kademe koyulaştırın veya bronzer ile harmanlayın. Altın yansımalı allık ve bal rengi highlight yaz aylarının vazgeçilmezidir. Dudaklarda turuncu-kahve veya karamel nude tonlar güneşle uyumlu görünür.</p>

<h3>Yaz Paleti Önerisi</h3>
<ul>
  <li><strong>Fondöten:</strong> Hafif formül, bir ton koyu veya bronzer karışımı</li>
  <li><strong>Allık:</strong> Bronz-pembe veya mercan</li>
  <li><strong>Ruj:</strong> Sable veya Café Crème tonları</li>
  <li><strong>Göz:</strong> Bakır veya altın kahve, suya dayanıklı maskara</li>
</ul>

<h2>Mevsim Geçişinde Dikkat</h2>
<p>Ton değiştirirken boyun ve dekolte bölgesini de kontrol edin. Yüz ve boyun arasındaki renk farkı makyajı yapay gösterir. Güneş koruyucu kullanımı yaz aylarında ton seçimini etkiler — bronzlaşan cilde göre fondöteni ayarlayın.</p>
    `.trim(),
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
