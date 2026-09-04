// نقشه کارخانه — ایمبد OpenStreetMap (بدون نیاز به کلید API)
// مختصات دقیق محل کارخانه: 32.424151, 48.310498
const MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=48.3064,32.4199,48.3146,32.4284&layer=mapnik&marker=32.424151,48.310498";

export default function MapSection() {
  return (
    <section
      className="bg-bg pb-20 lg:pb-28"
      aria-label="نقشه موقعیت کارخانه در اندیمشک"
    >
      <div className="container-site">
        <div className="relative h-[320px] w-full overflow-hidden rounded-sm border border-black/5 bg-white">
          <iframe
            src={MAP_EMBED_URL}
            title="نقشه کارخانه سازه افزار فتح — اندیمشک، شهرک صنعتی شماره ۲"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}