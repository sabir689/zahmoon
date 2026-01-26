import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";


// Data and Components
import MenuCard from "../components/MenuCard";
import menuData from "../data/menuData";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const Home = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);

  // Logic for Menu Sections
  const categories = Object.keys(menuData.menu);
  const [activeTab, setActiveTab] = useState(categories[0]);

  // Logic for Featured Items (top 6 across all categories)
  const featuredItems = useMemo(() => {
    return Object.keys(menuData.menu)
      .map((key) => menuData.menu[key][0])
      .filter(Boolean)
      .slice(0, 6);
  }, []);

  return (
    <div className="overflow-hidden bg-white selection:bg-orange-500 selection:text-white">

      {/* 1. HERO SLIDER SECTION (Parallax + Fade) */}
      <section className="h-screen w-full relative">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {[
            { img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070", title: "ZahMon Cafe", sub: "BOGRA'S CULINARY PRIDE" },
            { img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070", title: "Pure Flavors", sub: "TRADITION MEETS MODERNITY" },
            { img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2070", title: "Great Vibes", sub: "COZY SPACES FOR MEMORIES" }
          ].map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="h-full w-full relative flex items-center justify-center">
                <motion.div
                  style={{ y: yParallax }}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
                  style={{ backgroundImage: `url(${slide.img})` }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                </motion.div>

                <div className="relative z-10 text-center text-white px-4">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block text-orange-500 font-bold tracking-[0.4em] mb-4 text-sm"
                  >
                    {slide.sub}
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-9xl font-black mb-8 italic"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Link to="/menu" className="bg-orange-600 px-12 py-5 rounded-full font-bold text-lg hover:bg-orange-700 transition-all shadow-xl inline-block">
                      Explore Full Menu
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. STATS SECTION */}
      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {["10k+ Happy Clients", "09 Set Menus", "05 Expert Chefs", "08+ Years"].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl text-center group border-t-4 border-transparent hover:border-orange-500 transition-all duration-500"
          >
            <h3 className="text-4xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">{stat.split(' ')[0]}</h3>
            <p className="text-gray-500 font-medium uppercase text-xs tracking-widest mt-2">{stat.split(' ').slice(1).join(' ')}</p>
          </motion.div>
        ))}
      </section>

      {/* 3. CLASSIC MENU LIST SECTION (List layout as requested) */}
      <section className="py-24 bg-[#fffaf5]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">Our <span className="text-orange-600">Delicacies</span></h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Select a category to explore</p>
          </div>

          {/* TAB FILTERS */}
          <div className="relative mb-16">
            {/* Gradient Overlays to indicate more content */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden" />

            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 px-4 pb-2 -mx-4 md:justify-center md:flex-wrap">
              {categories.map((cat) => {
                const isActive = activeTab === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`
            flex-shrink-0 snap-center px-6 py-2 rounded-2xl font-bold transition-all border-2
            ${isActive
                        ? "bg-orange-600 border-orange-600 text-white shadow-lg"
                        : "bg-gray-50 border-transparent text-gray-500 hover:border-orange-200"
                      }
          `}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIST VIEW */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          >
            <AnimatePresence mode="wait">
              {menuData.menu[activeTab].map((item, idx) => (
                <motion.div
                  key={`${activeTab}-${item.name}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col group"
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex-1 border-b border-dashed border-gray-300 mx-4 relative top-[-4px]" />
                    <span className="text-lg font-black text-orange-600">৳{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 italic leading-relaxed">
                    {item.description || "Freshly prepared with authentic ingredients and the finest local spices."}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

          </motion.div>
          <div className="flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link to="/menu" className="bg-orange-600 mt-20 px-12 py-5 rounded-full font-bold text-lg hover:bg-orange-700 transition-all shadow-xl inline-block">
                Explore Full Menu
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE STORY SECTION */}
      <section className="bg-gray-950 py-24 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">Signature Dish</span>
            <h2 className="text-5xl font-black mb-6 leading-tight">The Legendary <br /><span className="text-orange-500 italic">Pasta Basta</span></h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
              Crafted in 2018, our creamy white sauce pasta has become Bogra's most talked-about dish. Infused with a secret blend of local chilies and premium mozzarella.
            </p>
            <Link to="/menu" className="inline-block border-2 border-orange-500 text-orange-500 px-10 py-4 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all">
              Taste the Legend
            </Link>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative"
          >
            <div className="absolute -inset-4 bg-orange-500/20 blur-3xl rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1000"
              className="rounded-3xl shadow-2xl relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-700"
              alt="Signature Pasta"
            />
          </motion.div>
        </div>
      </section>

      {/* 5. CHEF'S RECOMMENDATIONS (Grid View for variety) */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black">Chef's Recommendations</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mt-4" />
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {featuredItems.map((item, index) => (
              <motion.div key={index} variants={fadeInUp} whileHover={{ y: -10 }}>
                <MenuCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* --- NEW SECTION: GALLERY GRID --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-orange-600 font-bold uppercase tracking-[0.3em] text-xs">Visual Journey</span>
              <h2 className="text-5xl font-black mt-2">Captured <span className="text-gray-400 italic">Moments</span></h2>
            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
            <motion.div whileHover={{ scale: 0.98 }} className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl bg-gray-100">
              <img src="https://i.ibb.co.com/8gcsYgH4/Whats-App-Image-2026-01-26-at-8-56-04-PM.jpg" alt="Whats App Image 2026 01 26 at 8 56 04 PM" border="0" className="absolute inset-0 w-full h-full object-cover" alt="Interior" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="relative overflow-hidden rounded-3xl bg-gray-100">
              <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover" alt="Coffee" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="relative overflow-hidden rounded-3xl bg-gray-100">
              <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover" alt="Cooking" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gray-100">
              <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover" alt="Dining" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. TRUST & QUALITY PROMISE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { title: "Fresh Ingredients", desc: "Local produce sourced daily.", icon: "🥗" },
            { title: "Expert Chefs", desc: "10+ years of fusion culinary arts.", icon: "👨‍🍳" },
            { title: "Hygiene First", desc: "5-star cleanliness standards.", icon: "✨" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* --- NEW SECTION: TESTIMONIALS --- */}
      <section className="py-24 bg-gray-950 text-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 italic">What Our <span className="text-orange-500 underline underline-offset-8">Guests</span> Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Samiul Islam", review: "The Pasta Basta is hands down the best in Bogra. The creamy texture is addictive!", stars: 5 },
              { name: "Anika Tabassum", review: "Perfect place for birthday celebrations. The staff is so welcoming and the set menus are great value.", stars: 5 },
              { name: "Rahat Kabir", review: "Authentic flavors and beautiful interior. It’s my go-to spot every weekend.", stars: 4 }
            ].map((test, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="flex text-orange-500 mb-4">
                  {[...Array(test.stars)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">"{test.review}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-black text-sm">{test.name[0]}</div>
                  <h4 className="font-bold text-sm tracking-widest uppercase">{test.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* --- NEW SECTION: THE ZAHMON PROCESS --- */}
      <section className="py-24 bg-[#fffaf5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-orange-600 font-black uppercase tracking-widest text-xs">How it's made</span>
            <h2 className="text-5xl font-black mt-4">From Farm to <span className="text-orange-500 italic">Fork</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Decorative Line (Desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-orange-200 -z-0" />

            {[
              { step: "01", title: "Daily Sourcing", desc: "We pick the freshest vegetables and premium meats every single morning from local Bogra markets.", icon: "🚜" },
              { step: "02", title: "Master Craft", desc: "Our chefs blend 12 secret spices and slow-cook sauces to ensure depth of flavor in every bite.", icon: "🍳" },
              { step: "03", title: "Swift Serving", desc: "Hot, fresh, and beautifully plated dishes delivered to your table within minutes of preparation.", icon: "🍽️" }
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center bg-[#fffaf5] px-4">
                <div className="w-20 h-20 bg-white border-4 border-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-8 shadow-xl">
                  {item.icon}
                </div>
                <span className="text-orange-600 font-black text-4xl opacity-20 block mb-2">{item.step}</span>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CELEBRATION CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 mb-24"
      >
        <div className="bg-orange-600 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform duration-700 group-hover:scale-110" />
          <h2 className="text-4xl md:text-6xl font-black mb-6">Planning a Celebration?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Book your table for birthdays, anniversaries, or corporate events. Custom set menus available for groups.
          </p>
          <a href={`tel:${menuData.restaurant.contact}`} className="bg-white text-orange-600 px-12 py-5 rounded-full font-black text-xl hover:shadow-2xl transition inline-block">
            Call Now: {menuData.restaurant.contact}
          </a>
        </div>
      </motion.section>

      {/* 8. FOOTER */}
      <footer className="bg-gray-950 text-white pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-black text-orange-500 italic mb-6">ZahMon</h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Creating memories through premium flavors since 2018 in the heart of Bogra. Join us for a unique dining experience.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/menu" className="hover:text-orange-500 transition">Our Menu</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Visit Us</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {menuData.restaurant.location}<br />Bogra, Bangladesh
            </p>
            <p className="text-orange-500 text-sm font-bold">{menuData.restaurant.openingHours.saturdayThursday}</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Stay Updated</h4>
            <div className="flex bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <input type="email" placeholder="Your Email" className="bg-transparent p-3 text-sm w-full focus:outline-none" />
              <button className="bg-orange-500 px-4 hover:bg-orange-600 transition">→</button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-10 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} ZahMon Cafe & Restaurant. Developed with Passion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;