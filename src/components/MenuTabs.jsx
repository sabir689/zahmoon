import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUtensils } from "react-icons/fa";
import menuData from "../data/menuData";
import MenuCard from "./MenuCard";

const MenuTabs = () => {
  // Ensure we start at the top when navigating to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["all", ...Object.keys(menuData.menu)];
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    const allItems = Object.values(menuData.menu).flat();
    if (searchQuery.trim()) {
      return allItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab === "all") return allItems;
    return menuData.menu[activeTab] || [];
  }, [activeTab, searchQuery]);

  return (
    <div className="bg-white min-h-screen selection:bg-orange-500 selection:text-white">
      
      {/* 1. HERO HEADER */}
      <section className="bg-gray-950 py-12 md:py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070')] bg-cover bg-center" />
        <div className="relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 bg-orange-600 rounded-2xl mb-4 shadow-2xl shadow-orange-600/20"
          >
            <FaUtensils className="text-xl md:text-2xl" />
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter">
            ZahMon <span className="text-orange-500">Selection</span>
          </h1>
          <p className="mt-2 text-gray-400 uppercase tracking-[0.3em] text-[10px] md:text-xs">
            Bogra's Finest Culinary Experience
          </p>
        </div>
      </section>

      {/* 2. SEARCH BAR (Sticky on scroll) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 p-4">
        <div className="relative max-w-xl mx-auto">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-800"
          />
        </div>
      </div>

      {/* 3. MAIN CONTENT: SIDE-BY-SIDE LAYOUT */}
      <div className="flex flex-row max-w-7xl mx-auto min-h-screen relative">
        
        {/* LEFT SIDEBAR: Categories */}
        {!searchQuery && (
          <aside className="w-[110px] md:w-64 border-r border-gray-100 bg-gray-50/30 flex-shrink-0">
            <div className="sticky top-20 md:top-24 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar p-2 md:p-6 flex flex-col gap-2">
              <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
                Menu Categories
              </p>
              {categories.map((cat) => {
                const isActive = activeTab === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveTab(cat);
                      // On mobile, scroll to the top of the item list when category changes
                      if (window.innerWidth < 768) {
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }
                    }}
                    className={`text-center md:text-left px-2 py-4 md:px-5 md:py-3 rounded-2xl transition-all duration-300 group ${
                      isActive 
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-200" 
                        : "bg-transparent text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <span className="text-[9px] md:text-xs font-black tracking-tighter md:tracking-widest uppercase block leading-tight">
                      {cat.replaceAll("_", " ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* RIGHT SIDE: Item Grid */}
        <main className="flex-1 p-4 md:p-10 bg-white">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tighter">No items found</h3>
              <p className="text-gray-500 text-sm mt-2">Try searching for something else</p>
            </div>
          )}
        </main>
      </div>

      {/* 4. FOOTER SECTIONS: MEET THE CHEF & GUIDE */}
      <div className="bg-[#fffaf5] border-t border-gray-100">
        <section className="max-w-6xl mx-auto py-20 px-6 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -inset-4 bg-orange-500/10 rounded-[3rem] -rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1583394293214-28dea15ee548?q=80&w=1000"
              className="relative z-10 rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 h-[300px] md:h-[500px] w-full object-cover"
              alt="Executive Chef"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="text-orange-600 font-black uppercase tracking-widest text-xs">Crafting Excellence</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 mb-6 text-gray-900 leading-tight">
              A Message From Our <br /><span className="italic font-serif text-orange-500">Executive Chef</span>
            </h2>
            <p className="text-gray-600 leading-relaxed italic text-base md:text-lg">
              "At ZahMon, we don't just cook; we create memories. Every spice used in our pasta and every cut of chicken in our set menus is hand-picked to ensure you taste the heart of Bogra in every bite."
            </p>
          </div>
        </section>

        <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: "🌶️", title: "Spicy Options", desc: "Look for the chili badge for our signature heat levels." },
              { icon: "🌿", title: "Fresh Ingredients", desc: "All vegetables are sourced daily from local farmers." },
              { icon: "📦", title: "Group Catering", desc: "Perfect portions for meetings and family gatherings." }
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="font-bold mb-2 text-gray-900 uppercase text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuTabs;