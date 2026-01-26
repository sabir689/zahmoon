// src/pages/MenuPage.jsx

import MenuTabs from "../components/MenuTabs";



const MenuPage = () => {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Full Menu</h1>
      <MenuTabs></MenuTabs>
    </div>
  );
};

export default MenuPage;
