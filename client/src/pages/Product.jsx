import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Search, Loader2, X, Filter, ChevronRight } from "lucide-react";
import ProductCard from "../components/commons/ProductCard";
import { useProduct } from "../hooks/useProduct";
import { useCategory } from "../hooks/useCategory";

export default function Product() {
  const location = useLocation();
  const { products, loading: productsLoading, getProducts } = useProduct();
  const { categories, getCategories } = useCategory();

  // State untuk input mentah (tanpa jeda)
  const [searchInput, setSearchInput] = useState("");
  // State untuk hasil debounced (yang digunakan untuk memfilter)
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load Initial Data
  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts, getCategories]);

  // Sync Search from URL (if any)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchInput(searchParam);
      setDebouncedQuery(searchParam);
    }
  }, [location.search]);

  // IMPLEMENTASI DEBOUNCER
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 500); // Tunggu 500ms setelah user berhenti mengetik

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // Cegah scroll pada body ketika filter mobile terbuka
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileFilterOpen]);

  // Logic Filter & Search (Menggunakan debouncedQuery)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase());
      
      const matchesFilter = 
        selectedCategories.length === 0 || 
        selectedCategories.includes(p.Category?.name);

      return matchesSearch && matchesFilter;
    });
  }, [products, debouncedQuery, selectedCategories]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedQuery("");
    setSelectedCategories([]);
    setIsMobileFilterOpen(false); // Tutup sidebar mobile saat reset
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        
        {/* Mobile Filter Trigger */}
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="md:hidden w-full mb-8 flex items-center justify-center gap-2 bg-black text-white py-4 text-xs font-black uppercase tracking-widest active:scale-95 transition-transform shadow-xl"
        >
          <Filter size={16} /> Filters & Search
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* --- OVERLAY MOBILE FILTER --- */}
          {isMobileFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileFilterOpen(false)}
            />
          )}

          {/* --- SIDEBAR FILTER --- */}
          <aside className={`
            fixed inset-y-0 left-0 z-0 w-[85vw] max-w-sm bg-white p-6 overflow-y-auto transition-transform duration-300 ease-in-out
            md:relative md:w-64 md:p-0 md:bg-transparent md:overflow-visible md:translate-x-0
            ${isMobileFilterOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          `}>
            {/* Mobile Header Sidebar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 md:hidden">
              <span className="font-black italic uppercase tracking-tighter text-xl">Filters</span>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="md:sticky md:top-28 space-y-10">
              {/* Search Field Inside Sidebar */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Search Inventory</h3>
                  {searchInput !== debouncedQuery && <Loader2 size={10} className="animate-spin text-zinc-400" />}
                </div>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input
                    type="text"
                    placeholder="Keywords..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 py-4 pl-10 pr-4 text-xs font-bold outline-none focus:border-black transition-all"
                  />
                </div>
              </div>

              {/* Dynamic Category List */}
              <div className="space-y-4 text-left">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Categories</h3>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <label 
                      key={cat.id} 
                      className="flex items-center gap-4 cursor-pointer group py-1"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.name)}
                          onChange={() => handleCategoryChange(cat.name)}
                          className="peer appearance-none w-5 h-5 border border-zinc-300 checked:bg-black checked:border-black transition-all"
                        />
                        <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-tight transition-colors ${selectedCategories.includes(cat.name) ? "text-black" : "text-zinc-500 group-hover:text-black"}`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleResetFilters}
                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] border border-zinc-200 text-zinc-600 hover:bg-black hover:text-white transition-all hover:border-black active:scale-95"
              >
                Reset All Parameters
              </button>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <main className="flex-1 w-full overflow-hidden">
            {/* Breadcrumb / Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left flex-wrap">
                <span>Products</span>
                <ChevronRight size={10} />
                <span className="text-black">
                  {selectedCategories.length > 0 ? selectedCategories.join(", ") : "All Equipment"}
                </span>
              </div>
              <span className="text-[10px] font-black text-black bg-zinc-100 px-3 py-1 uppercase tracking-widest self-start sm:self-auto">
                {filteredProducts.length} Units
              </span>
            </div>

            {productsLoading ? (
              <div className="py-32 flex flex-col items-center justify-center text-zinc-300 space-y-4">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest italic">Syncing product...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    showCategory={true} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center bg-zinc-50 border border-dashed border-zinc-200">
                <div className="inline-flex p-4 border border-zinc-100 rounded-full mb-4 bg-white shadow-sm">
                  <Search size={24} className="text-zinc-300" />
                </div>
                <p className="text-zinc-400 uppercase text-xs font-black tracking-[0.2em]">
                  No Product Found
                </p>
                <button 
                  onClick={handleResetFilters}
                  className="mt-4 text-[10px] font-black border-b border-black uppercase tracking-widest hover:text-zinc-500 hover:border-zinc-500 transition-colors pb-1"
                >
                  Clear all parameters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}