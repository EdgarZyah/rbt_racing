import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Loader2, Star } from 'lucide-react';
import ProductCard from '../components/commons/ProductCard';
import { useProduct } from '../hooks/useProduct';
import { useCategory } from '../hooks/useCategory'; // Import useCategory

export default function Product() {
  const location = useLocation();
  const { products, loading: productsLoading, getProducts } = useProduct();
  const { categories, getCategories } = useCategory(); // Ambil kategori dinamis
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Load Produk & Kategori saat mount
  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts, getCategories]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) setSearchQuery(searchParam);
  }, [location.search]);

  // Logic Featured
  const featuredProducts = useMemo(() => 
    products.filter(p => p.featured).slice(0, 4), 
  [products]);

  // Logic Filter & Search
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Filter berdasarkan nama kategori
    const matchesFilter = filter === 'ALL' || p.Category?.name === filter;
    return matchesSearch && matchesFilter;
  });

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage, 
    currentPage * productsPerPage
  );

  const loading = productsLoading;

  return (
    <div className="bg-white min-h-screen pb-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="bg-zinc-900 text-white py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
           <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase mb-4">Our Products</h1>
           <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.4em]">High Quality Equipment</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Featured Section */}
          <div className="mb-24">
            <div className="flex items-center space-x-4 mb-10 pb-4 border-b border-zinc-100">
              <Star className="text-black" size={18} fill="currentColor" />
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Featured Gear</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={`feat-${product.id}`} product={product} />
              ))}
            </div>
          </div>


        {/* Search & Filter Bar */}
        <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md py-6 mb-16 border-b border-zinc-100 flex flex-col md:flex-row gap-6 justify-between items-center transition-all">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-black transition-colors" size={16} />
            <input 
              type="text" placeholder="SEARCH..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-all focus:bg-white"
            />
          </div>
          
          {/* Dynamic Category Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide">
            <button 
                onClick={() => { setFilter('ALL'); setCurrentPage(1); }}
                className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 transition-all border whitespace-nowrap ${filter === 'ALL' ? 'bg-black text-white border-black' : 'text-zinc-400 border-zinc-100 hover:border-black hover:text-black'}`}
              >
                ALL
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => { setFilter(cat.name); setCurrentPage(1); }}
                className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 transition-all border whitespace-nowrap ${filter === cat.name ? 'bg-black text-white border-black' : 'text-zinc-400 border-zinc-100 hover:border-black hover:text-black'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Grid */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-zinc-300 space-y-4">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest italic">Syncing Armory...</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
             <div className="inline-block p-4 border border-zinc-100 rounded-full mb-4 bg-zinc-50">
                <Search size={24} className="text-zinc-300" />
             </div>
             <p className="text-zinc-300 uppercase text-xs font-black tracking-[0.3em]">No Products found in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
}