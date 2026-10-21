import React, { useEffect, useRef } from 'react';
import { AutocompleteSuggestion } from '../../types/search';
import { Search, Package, Folder, Tag, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

interface SearchAutocompleteDropdownProps {
  isOpen: boolean;
  suggestions: AutocompleteSuggestion[];
  isLoading: boolean;
  query: string;
  selectedIndex: number;
  onSelectSuggestion: (suggestion: AutocompleteSuggestion) => void;
  onClose: () => void;
}

export const SearchAutocompleteDropdown: React.FC<SearchAutocompleteDropdownProps> = ({
  isOpen,
  suggestions,
  isLoading,
  query,
  selectedIndex,
  onSelectSuggestion,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const products = suggestions.filter((s) => s.type === 'product');
  const categories = suggestions.filter((s) => s.type === 'category');
  const brands = suggestions.filter((s) => s.type === 'brand');
  const keywords = suggestions.filter((s) => s.type === 'keyword');

  // Helper to highlight matching text in title
  const renderHighlighted = (text: string, q: string) => {
    if (!q) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, idx) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <span key={idx} className="font-extrabold text-[#f3a847] underline underline-offset-2">
              {part}
            </span>
          ) : (
            <span key={idx}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Search suggestions"
      className="absolute top-full left-0 right-0 mt-1 bg-[#1a2332] border border-[#37475a] rounded-xl shadow-2xl z-50 overflow-hidden text-slate-100 max-h-[460px] overflow-y-auto divide-y divide-slate-800"
    >
      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-3 text-center text-xs text-amber-400 flex items-center justify-center space-x-2 bg-slate-900/50">
          <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Searching catalog suggestions...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && suggestions.length === 0 && query.trim().length > 0 && (
        <div className="p-6 text-center text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">No suggestions found for &quot;{query}&quot;</p>
          <p className="text-[11px] text-slate-500">
            Press Enter to search the full marketplace or check for typos.
          </p>
        </div>
      )}

      {/* Categories & Departments */}
      {categories.length > 0 && (
        <div className="p-2">
          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Folder className="w-3 h-3 text-[#febd69]" />
            <span>Departments</span>
          </div>
          {categories.map((item, idx) => {
            const isSelected = selectedIndex === suggestions.indexOf(item);
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectSuggestion(item)}
                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition ${
                  isSelected ? 'bg-[#febd69] text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Search className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>
                    in <strong className="capitalize">{renderHighlighted(item.title, query)}</strong>
                  </span>
                </div>
                <span className={`text-[10px] ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>Department</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <div className="p-2">
          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Tag className="w-3 h-3 text-sky-400" />
            <span>Brands</span>
          </div>
          {brands.map((item) => {
            const isSelected = selectedIndex === suggestions.indexOf(item);
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectSuggestion(item)}
                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition ${
                  isSelected ? 'bg-[#febd69] text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Tag className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-sky-400'}`} />
                  <span>{renderHighlighted(item.title, query)}</span>
                </div>
                <span className={`text-[10px] ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>Brand Store</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Products list */}
      {products.length > 0 && (
        <div className="p-2">
          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Package className="w-3 h-3 text-emerald-400" />
            <span>Matching Products</span>
          </div>
          {products.map((item) => {
            const isSelected = selectedIndex === suggestions.indexOf(item);
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectSuggestion(item)}
                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between gap-3 text-xs transition ${
                  isSelected ? 'bg-[#febd69] text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-8 h-8 rounded object-cover shrink-0 bg-slate-900 border border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="flex flex-col truncate">
                    <span className="truncate font-semibold">{renderHighlighted(item.title, query)}</span>
                    <span
                      className={`text-[10px] truncate ${isSelected ? 'text-slate-800 font-medium' : 'text-slate-400'}`}
                    >
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {item.price !== undefined && (
                    <span className={`font-mono font-bold text-xs ${isSelected ? 'text-slate-950' : 'text-[#febd69]'}`}>
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                        isSelected ? 'bg-slate-950 text-amber-300' : 'bg-amber-400/20 text-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggested Search Keywords */}
      {keywords.length > 0 && (
        <div className="p-2">
          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Related Search Terms</span>
          </div>
          {keywords.map((item) => {
            const isSelected = selectedIndex === suggestions.indexOf(item);
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectSuggestion(item)}
                className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center justify-between text-xs transition ${
                  isSelected ? 'bg-[#febd69] text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Search className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{renderHighlighted(item.title, query)}</span>
                </div>
                <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} />
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Navigation Tip */}
      <div className="px-3 py-2 bg-slate-950/80 text-[10px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>Navigate with <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700">↓</kbd></span>
          <span>Select <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700 flex-inline items-center"><CornerDownLeft className="w-2.5 h-2.5 inline" /></kbd></span>
        </div>
        <span><kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300 border border-slate-700">ESC</kbd> to close</span>
      </div>
    </div>
  );
};
