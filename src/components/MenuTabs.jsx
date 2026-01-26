import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUtensils } from "react-icons/fa";
import menuData from "../data/menuData";
import MenuCard from "./MenuCard";

const MenuTabs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["all", ...Object.keys(menuData.menu)];


  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 3. FILTER LOGIC: Optimized for "All", Category, and Search
  const filteredItems = useMemo(() => {

    const allItems = Object.values(menuData.menu).flat();

    if (searchQuery.trim()) {
      return allItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === "all") {
      return allItems;
    }

    return menuData.menu[activeTab] || [];
  }, [activeTab, searchQuery]);

  return (
    <div className="bg-white min-h-screen selection:bg-orange-500 selection:text-white">

      {/* SECTION 1: HERO HEADER */}
      <section className="bg-gray-950 py-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070')] bg-cover bg-center" />
        <div className="relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-3 bg-orange-600 rounded-2xl mb-6 shadow-2xl shadow-orange-600/20"
          >
            <FaUtensils className="text-2xl" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black italic tracking-tighter"
          >
            ZahMon <span className="text-orange-500 text-6xl md:text-8xl">Selection</span>
          </motion.h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto uppercase tracking-[0.4em] text-[10px] md:text-xs">
            Bogra's Finest Culinary Experience
          </p>
        </div>
      </section>

      {/* SEARCH & TABS CONTAINER (Non-Sticky Layout) */}
      <div className="bg-white border-b border-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* 1. THE SEARCH BAR */}
          <div className="relative max-w-lg mx-auto">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your favorite dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-gray-800"
            />
          </div>

          {/* 2. TWO-LINE TABS (Scrolls away with page) */}
          <AnimatePresence>
            {!searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="grid grid-cols-3 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-2 md:gap-4 px-1"
              >
                {categories.map((cat) => {
                  const isActive = activeTab === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className="relative px-5 py-2.5 transition-all duration-300 group flex-shrink-0"
                    >
                      <span className={`relative z-10 text-[10px] md:text-xs tracking-widest font-black transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"
                        }`}>
                        {cat.replaceAll("_", " ").toUpperCase()}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="activeTabFill"
                          className="absolute inset-0 bg-orange-600 rounded-xl -z-0 shadow-lg shadow-orange-200"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gray-100 rounded-xl scale-95 opacity-0 group-hover:opacity-100 transition-all duration-200 -z-0" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Result Label */}
          {searchQuery && (
            <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
              Found {filteredItems.length} items matching your search
            </p>
          )}
        </div>
      </div>

      {/* ITEMS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tighter">No dishes found</h3>
            <p className="text-gray-500">Try searching for something else like "Pasta" or "Chicken"</p>
          </div>
        )}
      </section>

      {/* SECTION: MEET THE CHEF */}
      <section className="bg-[#fffaf5] py-24 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="absolute -inset-4 bg-orange-500/10 rounded-[3rem] -rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1583394293214-28dea15ee548?q=80&w=1000"
              className="relative z-10 rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 h-[500px] w-full object-cover"
              alt="Executive Chef"
            />
          </div>
          <div className="md:w-1/2">
            <span className="text-orange-600 font-black uppercase tracking-widest text-sm text-center md:text-left block">Crafting Excellence</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-gray-900 leading-tight text-center md:text-left">
              A Message From Our <br /><span className="italic font-serif text-orange-500">Executive Chef</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 italic text-lg text-center md:text-left">
              "At ZahMon, we don't just cook; we create memories. Every spice used in our pasta and every cut of chicken in our set menus is hand-picked to ensure you taste the heart of Bogra in every bite."
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: DIETARY GUIDE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: "🌶️", title: "Spicy Options", desc: "Look for the chili badge for our signature heat levels." },
            { icon: "🌿", title: "Fresh Ingredients", desc: "All vegetables are sourced daily from local farmers." },
            { icon: "📦", title: "Group Catering", desc: "Perfect portions for meetings and family gatherings." }
          ].map((item, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="font-bold mb-2 text-gray-900 uppercase tracking-tight">{item.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default MenuTabs;