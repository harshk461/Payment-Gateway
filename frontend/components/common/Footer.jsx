import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 mt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col gap-4 sm:flex-row items-center justify-between">
        {/* Left: brand + tagline */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Shopwave</span>
          <span className="hidden sm:inline-block">•</span>
          <span className="hidden sm:inline-block">
            Calm shopping & secure payments
          </span>
        </div>

        {/* Right: links */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <button className="hover:text-slate-900">Privacy</button>
          <button className="hover:text-slate-900">Terms</button>
          <button className="hover:text-slate-900">Help</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
