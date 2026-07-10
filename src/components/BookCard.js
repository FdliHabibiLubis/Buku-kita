import Link from "next/link";
import Image from "next/image";

export default function BookCard({ book }) {
  const formattedPrice = `Rp. ${Number(book.price).toLocaleString("id-ID")},00`;

  return (
    <div className="bg-white border-[3px] border-black neobrutal-shadow neobrutal-shadow-hover flex flex-col h-full group">
      <div className="aspect-[3/4] relative overflow-hidden border-b-[3px] border-black bg-zinc-100">
        <img
          src={book.cover_image}
          alt={`Sampul buku ${book.title} oleh ${book.author}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {book.avg_rating > 0 && (
          <div className="absolute top-2 left-2 bg-secondary-container text-on-secondary-container px-2 py-0.5 border-2 border-black text-[10px] font-headline font-bold uppercase flex items-center gap-1 shadow-[1px_1px_0px_#000]">
            <span className="material-symbols-outlined !text-[12px] fill-current">star</span>
            {book.avg_rating}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-xs md:text-sm font-headline font-bold text-on-surface mb-1 leading-tight min-h-[2.25rem] line-clamp-2">
          {book.title} - {book.author}
        </h3>
        <p className="text-primary font-headline font-bold text-sm md:text-base mb-2">
          {formattedPrice}
        </p>
        <Link
          href={`/detail-buku/${book.id}`}
          className="mt-auto w-full text-center py-2 border-[3px] border-primary text-primary font-headline font-bold text-xs uppercase neobrutal-shadow-sm hover:bg-primary hover:text-white transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none inline-block"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}
