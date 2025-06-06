export const products = [
  // Please review and update example values (price, weight, origin, flavor, rating, reviews, descriptions) as needed.
  // Note: Image paths are currently external URLs. You might want to download them locally 
  // and update the paths (e.g., to /images/products/new_product.jpg).
  {
    id: 1,
    name: "Charcoal and Camphor Soap",
    description: "Stone-ground Khapli (Emmer) wheat flour, rich in fiber and nutrients. Ideal for soft rotis and healthy baking. Sourced from organic farms.",
    price: 250,
    originalPrice: 290,
    image: "https://fusionmoksha.com/wp-content/uploads/2024/04/characoal_and_camphor_soap_fusion_moksha_4.png",
    category: "Flour",
    weight: 1000, // in grams
    origin: "India",
    flavor: "Nutty and wholesome",
    rating: 4.7,
    reviews: 35,
    reviewList: [
      {
        author: "Priya S.",
        rating: 5,
        text: "Excellent quality flour, makes very soft chapatis!",
        date: "2024-05-20"
      },
      {
        author: "Amit K.",
        rating: 4,
        text: "Good taste and texture. Happy with the purchase.",
        date: "2024-05-18"
      }
    ]
  },
  {
    id: 2,
    name: "Hibiscus Onion Hair Oil",
    description: "Pure A2 Gir cow cultured ghee, made using traditional Bilona methods. Rich aroma, granular texture, and numerous health benefits.",
    price: 850,
    originalPrice: 950,
    image: "https://fusionmoksha.com/wp-content/uploads/2024/04/hibiscus_onion_hair_oil_fusion_moksha_1.png",
    category: "Ghee",
    weight: 500, // in ml
    origin: "India",
    flavor: "Rich, nutty, and aromatic",
    rating: 4.9,
    reviews: 72,
    reviewList: [
      {
        author: "Deepa M.",
        rating: 5,
        text: "Authentic taste and aroma. Best ghee I've used.",
        date: "2024-05-22"
      },
      {
        author: "Rajesh V.",
        rating: 5,
        text: "Very high quality product. Worth the price.",
        date: "2024-05-19"
      }
    ]
  },
  {
    id: 3,
    name: "Lakadong Turmeric",
    description: "A special limited edition Amlaprash, a potent Chyawanprash variant enriched with Amla and other vital herbs for boosting immunity and vitality.",
    price: 600,
    image: "https://fusionmoksha.com/wp-content/uploads/2024/04/lakadong_turmeric_fusion_moksha_4.png",
    category: "Health Supplement",
    weight: 500, // in grams
    origin: "India",
    flavor: "Sweet, tangy, and herbal",
    rating: 4.8,
    reviews: 50,
    reviewList: [
      {
        author: "Sunita P.",
        rating: 5,
        text: "Feeling more energetic after using this. Great taste too!",
        date: "2024-05-25"
      },
      {
        author: "Vikram B.",
        rating: 4,
        text: "Good for immunity, especially during season changes.",
        date: "2024-05-21"
      }
    ]
  },
  {
    id: 4,
    name: "Amla and Reetha Castile Shampoo",
    description: "Natural and unrefined sugarcane jaggery in convenient crushed granular form. A healthy and delicious alternative to refined sugar, rich in minerals.",
    price: 150,
    image: "https://fusionmoksha.com/wp-content/uploads/2024/04/amla_shikakai_shampoo_fusion_moksha_1.png",
    category: "Sweetener",
    weight: 900, // in grams
    origin: "India",
    flavor: "Earthy and caramel-like sweetness",
    rating: 4.6,
    reviews: 40,
    reviewList: [
      {
        author: "Kavita N.",
        rating: 5,
        text: "Love this jaggery! Perfect for my tea and sweets.",
        date: "2024-05-19"
      },
      {
        author: "Rohan G.",
        rating: 4,
        text: "Good quality, dissolves easily. Healthier option.",
        date: "2024-05-17"
      }
    ]
  },
  {
    id: 5,
    name: "Spiced Honey",
    description: "Natural and unrefined sugarcane jaggery in convenient crushed granular form. A healthy and delicious alternative to refined sugar, rich in minerals.",
    price: 150,
    image: "https://fusionmoksha.com/wp-content/uploads/2024/05/honey_spiced_fusion_moksha_1.png",
    category: "Sweetener",
    weight: 900, // in grams
    origin: "India",
    flavor: "Earthy and caramel-like sweetness",
    rating: 4.6,
    reviews: 40,
    reviewList: [
      {
        author: "Kavita N.",
        rating: 5,
        text: "Love this jaggery! Perfect for my tea and sweets.",
        date: "2024-05-19"
      },
      {
        author: "Rohan G.",
        rating: 4,
        text: "Good quality, dissolves easily. Healthier option.",
        date: "2024-05-17"
      }
    ]
  },
  {
    id: 6,
    name: "Multi Floral Honey Sourced from North East",
    description: "Natural and unrefined sugarcane jaggery in convenient crushed granular form. A healthy and delicious alternative to refined sugar, rich in minerals.",
    price: 150,
    image: "https://fusionmoksha.com/wp-content/uploads/2024/05/honey_multi_floral_fusion_moksha_1-1.png",
    category: "Sweetener",
    weight: 900, // in grams
    origin: "India",
    flavor: "Earthy and caramel-like sweetness",
    rating: 4.6,
    reviews: 40,
    reviewList: [
      {
        author: "Kavita N.",
        rating: 5,
        text: "Love this jaggery! Perfect for my tea and sweets.",
        date: "2024-05-19"
      },
      {
        author: "Rohan G.",
        rating: 4,
        text: "Good quality, dissolves easily. Healthier option.",
        date: "2024-05-17"
      }
    ]
  }
];

export const aboutContent = {
  title: "About Fusion Moksha",
  description: "Fusion Moksha is a premium tea and coffee brand based in Assam. We source our products directly from local farmers and ensure the highest quality standards. Our mission is to bring the authentic taste of Assam to your home.",
  features: [
    {
      icon: "☕",
      title: "Premium Quality",
      description: "Only the finest tea leaves and coffee beans"
    },
    {
      icon: "🌿",
      title: "Organic Products",
      description: "100% organic and chemical-free"
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Nationwide shipping in 2-3 days"
    }
  ]
};

export const contactInfo = {
  email: "info@fusionmoksha.com",
  phone: "+91-9031097845",
  address: "H No 4, Guwahati, Assam 781028",
  workingHours: "Mon-Sun: 9:00 AM - 6:00 PM"
};
