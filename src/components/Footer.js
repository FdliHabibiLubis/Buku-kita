import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t-[3px] border-black bg-on-surface text-white py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="text-xl md:text-2xl font-headline font-extrabold text-[#b1c5ff] uppercase tracking-tighter">
          Buku Kita
        </span>
        <p className="text-xs font-body opacity-70">
          &copy; 2026 Buku Kita. Made by Fadli Habibi.
        </p>
      </div>
      <nav className="flex gap-5 text-xs md:text-sm font-body">
        <Link href="#" className="hover:text-secondary-container transition-colors">
          Tentang Kami
        </Link>
        <Link href="#" className="hover:text-secondary-container transition-colors">
          Kebijakan Privasi
        </Link>
        <Link href="#" className="hover:text-secondary-container transition-colors">
          Syarat &amp; Ketentuan
        </Link>
      </nav>
    </footer>
  );
}
