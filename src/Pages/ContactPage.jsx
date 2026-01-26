import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const ContactPage = () => {
  const contactInfo = [
    { icon: <FaPhone />, title: "Call Us", detail: "+1 (555) 123-4567", color: "bg-orange-100 text-orange-600" },
    { icon: <FaEnvelope />, title: "Email Us", detail: "hello@zahmoncafe.com", color: "bg-blue-100 text-blue-600" },
    { icon: <FaMapMarkerAlt />, title: "Visit Us", detail: "123 Coffee Lane, Brew City", color: "bg-green-100 text-green-600" },
    { icon: <FaClock />, title: "Open Hours", detail: "Daily: 7AM - 10PM", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1: UNIQUE HERO */}
      <section className="relative py-20 px-6 bg-orange-600 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4"
          >
            LET'S CHAT <span className="text-gray-900 not-italic">OVER COFFEE</span>
          </motion.h1>
          <p className="text-orange-100 font-bold max-w-xl mx-auto">
            Whether you have a question, a suggestion, or just want to say hi, our doors (and inbox) are always open.
          </p>
        </div>
        {/* Background Decorative Text */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10 pointer-events-none">
          <h2 className="text-[20vw] font-black text-white select-none leading-none">ZAHMON</h2>
        </div>
      </section>

      {/* SECTION 2: INFO GRID (4 SECTIONS) */}
      <section className="py-16 px-6 -mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {contactInfo.map((info, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 flex flex-col items-center text-center"
            >
              <div className={`text-2xl p-4 rounded-2xl mb-4 ${info.color}`}>
                {info.icon}
              </div>
              <h3 className="font-black text-gray-900 mb-1">{info.title}</h3>
              <p className="text-gray-500 font-medium text-sm">{info.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: BRUTALIST CONTACT FORM */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-6">BECOME A <span className="text-orange-600">REGULAR.</span></h2>
          <p className="text-gray-600 mb-8 font-medium">
            We reply to all messages within 24 hours. Grab a cup and tell us what's on your mind!
          </p>
          <div className="flex space-x-4">
            {[<FaInstagram />, <FaFacebook />, <FaWhatsapp />].map((icon, i) => (
              <button key={i} className="text-2xl w-12 h-12 flex items-center justify-center bg-gray-900 text-white rounded-full hover:bg-orange-600 transition-colors">
                {icon}
              </button>
            ))}
          </div>
        </div>

        <motion.form 
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          className="bg-gray-50 p-8 rounded-[40px] border-2 border-dashed border-gray-200"
        >
          <div className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full p-4 rounded-2xl bg-white border border-gray-100 focus:border-orange-500 outline-none font-bold" />
            <input type="email" placeholder="Email Address" className="w-full p-4 rounded-2xl bg-white border border-gray-100 focus:border-orange-500 outline-none font-bold" />
            <textarea rows="4" placeholder="How can we help?" className="w-full p-4 rounded-2xl bg-white border border-gray-100 focus:border-orange-500 outline-none font-bold resize-none"></textarea>
            <button className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
              Send Message
            </button>
          </div>
        </motion.form>
      </section>

      {/* SECTION 4: FULL-WIDTH INTERACTIVE MAP */}
      <section className="h-[400px] w-full bg-gray-100 relative overflow-hidden group">
        {/* Placeholder for real map integration like Google Maps or Leaflet */}
        <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 font-black text-xl italic group-hover:scale-110 transition-transform duration-500">[ GOOGLE MAPS INTERACTIVE ]</p>
        </div>
        <div className="absolute top-6 left-6 bg-white p-6 rounded-2xl shadow-xl z-10 hidden md:block border-l-4 border-orange-600">
          <p className="text-xs font-black text-orange-600 uppercase">Main Roastery</p>
          <p className="text-gray-900 font-bold">Downtown Brew District</p>
        </div>
      </section>

      {/* SECTION 5: FOOTER QUOTE */}
      <section className="py-20 text-center">
        <motion.div 
            whileInView={{ scale: [0.9, 1] }}
            className="inline-block px-10 py-6 border-2 border-orange-600 rounded-full italic text-2xl font-black text-orange-600"
        >
            "Life begins after coffee."
        </motion.div>
      </section>
    </div>
  );
};

export default ContactPage;