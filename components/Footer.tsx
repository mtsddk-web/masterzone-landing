export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <nav className="flex flex-wrap justify-center gap-6 mb-4">
          <a
            href="https://masterzone.edu.pl"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            masterzone.edu.pl
          </a>
          <a
            href="https://masterzone.edu.pl/blog/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Blog
          </a>
          <a
            href="https://www.youtube.com/@masterzonepro"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            YouTube
          </a>
          <a
            href="https://www.skool.com/masterzone"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Skool
          </a>
          <a
            href="mailto:kontakt@masterzone.edu.pl"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            kontakt@masterzone.edu.pl
          </a>
        </nav>
        <p className="text-xs text-gray-400">
          &copy; 2026 MasterZone &middot; Stworzone przez Mateusza Dudka i Radka Pustelnika
        </p>
      </div>
    </footer>
  );
}
