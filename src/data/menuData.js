import setmenu1 from '../assets/set menu/s-1.jpg'
import setmenu2 from '../assets/set menu/s-2.jpg'
import setmenu3 from '../assets/set menu/s-3.jpg'
import appetizers1 from '../assets/app-1.jpg';
import appetizers2 from '../assets/app-2.jpg'
import appetizers3 from '../assets/app3.jpg'
import appetizers4 from '../assets/app-4.jpg'
import appetizers5 from '../assets/app-5.jpg'
import soup1 from '../assets/soups1.jpg'
import soup2 from '../assets/soup-2.jpg'
import soup3 from '../assets/soup-3.jpg'
import soup4 from '../assets/soup-4.jpg'
import soup5 from '../assets/soup-5.jpg'



const menuData = {
  restaurant: {
    name: "ZahMon Cafe & Restaurant",
    location: "Bogra",
    openingHours: {
      saturdayThursday: "11:00 AM - 10:00 PM",
      friday: "02:00 PM - 10:00 PM",
    },
    contact: "+88 01617 005530",
  },

  menu: {
    set_menu: [
      {
        name: "Set Menu 01",
        price: 110,
        items: ["Egg Fried Rice", "Chicken Fry", "Cut Salad"],
        image: setmenu1,
      },
      {
        name: "Set Menu 02",
        price: 115,
        items: ["Egg Fried Rice", "Chicken Masala", "Cut Salad"],
        image: setmenu2,
      },
      {
        name: "Set Menu 03",
        price: 140,
        items: ["Egg Fried Rice", "Chicken Fry", "Vegetable", "Cut Salad"],
        image: setmenu3,
      },
      {
        name: "Set Menu 04",
        price: 160,
        items: ["Egg Fried Rice", "Crispy Chicken Fry", "Vegetable", "Cut Salad"],
        image: setmenu2,
      },
      {
        name: "Set Menu 05",
        price: 165,
        items: ["Egg Fried Rice", "Chicken Fry", "Chicken Masala", "Cut Salad"],
        image: setmenu3,
      },
      {
        name: "Set Menu 06",
        price: 175,
        items: ["Egg Fried Rice", "Chicken Fry", "Chicken Masala", "Vegetable", "Cut Salad"],
        image: setmenu1,
      },
      {
        name: "Set Menu 07",
        price: 180,
        items: ["Egg Fried Rice", "Chicken Fry", "Chicken Chilli Onion", "Vegetable", "Cut Salad"],
        image: setmenu3,
      },
      {
        name: "Set Menu 08",
        price: 200,
        items: ["Egg Fried Rice", "Chicken Fry", "Chicken Sizzling", "Vegetable", "Cut Salad"],
        image: setmenu1,
      },
      {
        name: "Set Menu 09",
        price: 350,
        items: [
          "Thai Soup",
          "Wonton (2 pcs)",
          "Egg Fried Rice",
          "Chicken Fry",
          "Chicken Masala",
          "Vegetable",
          "Cut Salad",
        ],
        image: setmenu2,
      },
    ],

    appetizers_salads: [
      { name: "Desi French Fry", price: 90, image: appetizers2 },
      { name: "Chicken Wonton (6 pcs)", price: 150, image: appetizers3 },
      { name: "Mexican Style Cheese Nachos", price: 230, image: appetizers1 },
      { name: "Szechuan Chicken Cashew Nut Salad", price: 250, image:appetizers4 },
      { name: "Chicken Prawn Cashew Nut Salad", price: 270, image: appetizers5 },
    ],

    soups: [
      { name: "Thai Soup Thick + Wonton (2 pcs)", price: 140, image: soup1 },
      { name: "Chicken Corn Soup", price: 200, image:soup2 },
      { name: "Hot & Sour Soup", price: 220, image: soup3 },
      { name: "Chicken Prawn Mix Thai Soup Thick", price: 260, image: soup4 },
      { name: "Chicken Prawn Clear Soup", price: 250, image: soup5 },
    ],

    pasta: [
      { name: "Mini Pasta Basta", price: 130, image: "/images/pasta/mini-pasta.jpg" },
      { name: "Red Sauce Pasta", price: 200, image: "/images/pasta/red-sauce.jpg" },
      { name: "Pasta Basta", price: 240, image: "/images/pasta/pasta-basta.jpg" },
      { name: "BBQ Pasta", price: 250, image: "/images/pasta/bbq-pasta.jpg" },
      { name: "Naga Pasta Basta", price: 250, image: "/images/pasta/naga-pasta.jpg" },
      { name: "ZahMon Signature Pasta", price: 290, image: "/images/pasta/signature-pasta.jpg" },
    ],

    sandwich_shawarma: [
      { name: "Classic Chicken Sub Sandwich", price: 150, image: "/images/sandwich/sub.jpg" },
      { name: "Classic Chicken Cheese Sub Sandwich", price: 170, image: "/images/sandwich/cheese-sub.jpg" },
      { name: "Naga Classic Chicken Cheese Sub Sandwich", price: 180, image: "/images/sandwich/naga-sub.jpg" },
      { name: "Chicken Roll Shawarma", price: 140, image: "/images/shawarma/roll.jpg" },
      { name: "Chicken Cheese Shawarma", price: 180, image: "/images/shawarma/cheese.jpg" },
    ],

    burger: [
      { name: "Classic Chicken Burger", price: 140, image: "/images/burger/classic.jpg" },
      { name: "Classic Chicken Cheese Burger", price: 155, image: "/images/burger/cheese.jpg" },
      { name: "Mexican Hot Cheese Burger", price: 160, image: "/images/burger/mexican.jpg" },
      { name: "Naga Classic Chicken Cheese Burger", price: 170, image: "/images/burger/naga.jpg" },
      { name: "Classic Chicken Cheese Sub Burger", price: 160, image: "/images/burger/sub.jpg" },
    ],

    chowmein: [
      { name: "Mini Egg Chowmein", price: 120, image: "/images/chowmein/mini.jpg" },
      { name: "Egg Chowmein", price: 170, image: "/images/chowmein/egg.jpg" },
      { name: "Chicken Chowmein", price: 190, image: "/images/chowmein/chicken.jpg" },
      { name: "Chicken Prawn Mix Chowmein", price: 220, image: "/images/chowmein/prawn.jpg" },
      { name: "American Chopsuey", price: 250, image: "/images/chowmein/chopsuey.jpg" },
      { name: "ZahMon Signature Chowmein", price: 270, image: "/images/chowmein/signature.jpg" },
    ],

    biryani: [
      { name: "Plain Khichuri with Chicken Curry", price: 150, image: "/images/biryani/khichuri.jpg" },
      { name: "Shahi Chicken Dum Biryani", price: 160, image: "/images/biryani/chicken.jpg" },
      { name: "Shahi Morog Polao", price: 165, image: "/images/biryani/polao.jpg" },
      { name: "Shahi Beef Dum Biryani", price: 210, image: "/images/biryani/beef.jpg" },
      { name: "Shahi Chicken Hyderabadi Dum Biryani", price: 215, image: "/images/biryani/hyderabadi.jpg" },
    ],

    fried_rice: [
      { name: "Vegetable Fried Rice", price: 160, image: "/images/fried-rice/veg.jpg" },
      { name: "Egg Fried Rice", price: 170, image: "/images/fried-rice/egg.jpg" },
      { name: "Chicken Fried Rice", price: 180, image: "/images/fried-rice/chicken.jpg" },
      { name: "Chicken Prawn Mixed Fried Rice", price: 200, image: "/images/fried-rice/prawn.jpg" },
      { name: "ZahMon Signature Fried Rice", price: 230, image: "/images/fried-rice/signature.jpg" },
    ],

    fried_chicken: [
      { name: "Thai Chicken Fry (1 pc)", price: 60, image: "/images/chicken/thai-1.jpg" },
      { name: "Crispy Chicken Fry (1 pc)", price: 70, image: "/images/chicken/crispy-1.jpg" },
      { name: "Thai Chicken Fry (6 pcs)", price: 250, image: "/images/chicken/thai-6.jpg" },
      { name: "Crispy Chicken Fry (6 pcs)", price: 270, image: "/images/chicken/crispy-6.jpg" },
      { name: "Chicken Masala Curry", price: 220, image: "/images/chicken/masala.jpg" },
      { name: "Chicken Chilli Onion", price: 220, image: "/images/chicken/chilli.jpg" },
      { name: "Chicken Sizzling", price: 250, image: "/images/chicken/sizzling.jpg" },
    ],

    prawn_vegetable: [
      { name: "Prawn Chilli Onion", price: 235, image: "/images/prawn/chilli.jpg" },
      { name: "Prawn Masala", price: 245, image: "/images/prawn/masala.jpg" },
      { name: "Prawn Sizzling", price: 260, image: "/images/prawn/sizzling.jpg" },
      { name: "Chinese Mixed Vegetable", price: 180, image: "/images/vegetable/mixed.jpg" },
      { name: "Chicken Vegetable", price: 190, image: "/images/vegetable/chicken.jpg" },
      { name: "Chicken Prawn Thai Mixed Vegetable", price: 220, image: "/images/vegetable/thai-mix.jpg" },
    ],

    beverages: [
      { name: "Hot Coffee", price: 60, image: "/images/beverage/hot-coffee.jpg" },
      { name: "Black Coffee", price: 50, image: "/images/beverage/black-coffee.jpg" },
      { name: "Cold Coffee", price: 130, image: "/images/beverage/cold-coffee.jpg" },
      { name: "Soft Drinks Two Layer", price: 70, image: "/images/beverage/soft-drink.jpg" },
      { name: "Lemon Juice", price: 60, image: "/images/beverage/lemon.jpg" },
      { name: "Lassi (Sweet / Salt)", price: 140, image: "/images/beverage/lassi.jpg" },
      { name: "Milkshake", price: 140, image: "/images/beverage/milkshake.jpg" },
      { name: "ZahMon Signature Faluda", price: 190, image: "/images/beverage/faluda.jpg" },
    ],
  },
};

export default menuData;
