const products = [
    {
        name: "Charcoal and Camphor Soap",
        description: "Natural soap made with charcoal and camphor, perfect for skin care.",
        mainTag: "Bestseller",
        additionalTags: ["Natural", "Skin Care"],
        categories: ["Beauty", "Skin Care"],
        brand: "Fusion Moksha",
        origin: "India",
        rating: 4.7,
        reviews: 35,
        mainImage: "https://fusionmoksha.com/wp-content/uploads/2024/04/characoal_and_camphor_soap_fusion_moksha_4.png",
        variants: [
            {
                weight: { value: 100, unit: "g" },
                price: 250,
                originalPrice: 290,
                discountPrice: 250,
                savings: 40,
                savingsPercentage: "14%",
                image: "https://fusionmoksha.com/wp-content/uploads/2024/04/characoal_and_camphor_soap_fusion_moksha_4.png",
                stock: 100
            }
        ],
        defaultVariant: {
            weight: { value: 100, unit: "g" },
            price: 250,
            originalPrice: 290,
            discountPrice: 250,
            savings: 40,
            savingsPercentage: "14%",
            image: "https://fusionmoksha.com/wp-content/uploads/2024/04/characoal_and_camphor_soap_fusion_moksha_4.png"
        },
        reviewList: [
            {
                author: "Priya S.",
                rating: 5,
                text: "Excellent quality soap, great for skin!",
                date: new Date("2024-05-20")
            },
            {
                author: "Amit K.",
                rating: 4,
                text: "Good cleansing effect, love the scent.",
                date: new Date("2024-05-18")
            }
        ]
    },
    {
        name: "Hibiscus Onion Hair Oil",
        description: "Natural hair oil enriched with hibiscus and onion extract for healthy hair growth.",
        mainTag: "Featured",
        additionalTags: ["Herbal", "Hair Growth"],
        categories: ["Beauty", "Hair Care"],
        brand: "Fusion Moksha",
        origin: "India",
        rating: 4.9,
        reviews: 72,
        mainImage: "https://fusionmoksha.com/wp-content/uploads/2024/04/hibiscus_onion_hair_oil_fusion_moksha_1.png",
        variants: [
            {
                weight: { value: 100, unit: "ml" },
                price: 850,
                originalPrice: 950,
                discountPrice: 850,
                savings: 100,
                savingsPercentage: "11%",
                image: "https://fusionmoksha.com/wp-content/uploads/2024/04/hibiscus_onion_hair_oil_fusion_moksha_1.png",
                stock: 150
            }
        ],
        defaultVariant: {
            weight: { value: 100, unit: "ml" },
            price: 850,
            originalPrice: 950,
            discountPrice: 850,
            savings: 100,
            savingsPercentage: "11%",
            image: "https://fusionmoksha.com/wp-content/uploads/2024/04/hibiscus_onion_hair_oil_fusion_moksha_1.png"
        },
        reviewList: [
            {
                author: "Deepa M.",
                rating: 5,
                text: "Amazing results, hair looks healthier!",
                date: new Date("2024-05-22")
            },
            {
                author: "Rajesh V.",
                rating: 5,
                text: "Best hair oil I've tried, highly recommended.",
                date: new Date("2024-05-21")
            }
        ]
    },
    {
        name: "Lakadong Turmeric",
        description: "Premium turmeric powder from Meghalaya, rich in curcumin and antioxidants.",
        mainTag: "Bestseller",
        additionalTags: ["Organic", "Premium Quality"],
        categories: ["Herb", "Health Supplement"],
        brand: "Fusion Moksha",
        origin: "Meghalaya, India",
        rating: 4.8,
        reviews: 50,
        mainImage: "https://fusionmoksha.com/wp-content/uploads/2024/04/lakadong_turmeric_fusion_moksha_4.png",
        variants: [
            {
                weight: { value: 100, unit: "g" },
                price: 600,
                originalPrice: 750,
                discountPrice: 600,
                savings: 150,
                savingsPercentage: "20%",
                image: "https://fusionmoksha.com/wp-content/uploads/2024/04/lakadong_turmeric_fusion_moksha_4.png",
                stock: 200
            }
        ],
        defaultVariant: {
            weight: { value: 100, unit: "g" },
            price: 600,
            originalPrice: 750,
            discountPrice: 600,
            savings: 150,
            savingsPercentage: "20%",
            image: "https://fusionmoksha.com/wp-content/uploads/2024/04/lakadong_turmeric_fusion_moksha_4.png"
        },
        reviewList: [
            {
                author: "Sunita P.",
                rating: 5,
                text: "Best turmeric quality, very effective.",
                date: new Date("2024-05-25")
            },
            {
                author: "Vikram B.",
                rating: 4,
                text: "Good quality, worth the price.",
                date: new Date("2024-05-21")
            }
        ]
    },
    {
        name: "Amla and Reetha Castile Shampoo",
        description: "Natural shampoo made with amla and reetha extracts for healthy hair.",
        mainTag: "New",
        additionalTags: ["Chemical-free", "Herbal"],
        categories: ["Beauty", "Hair Care"],
        brand: "Fusion Moksha",
        origin: "India",
        rating: 4.6,
        reviews: 40,
        mainImage: "https://fusionmoksha.com/wp-content/uploads/2024/04/amla_shikakai_shampoo_fusion_moksha_1.png",
        variants: [
            {
                weight: { value: 200, unit: "ml" },
                price: 150,
                originalPrice: 180,
                discountPrice: 150,
                savings: 30,
                savingsPercentage: "17%",
                image: "https://fusionmoksha.com/wp-content/uploads/2024/04/amla_shikakai_shampoo_fusion_moksha_1.png",
                stock: 120
            }
        ],
        defaultVariant: {
            weight: { value: 200, unit: "ml" },
            price: 150,
            originalPrice: 180,
            discountPrice: 150,
            savings: 30,
            savingsPercentage: "17%",
            image: "https://fusionmoksha.com/wp-content/uploads/2024/04/amla_shikakai_shampoo_fusion_moksha_1.png"
        },
        reviewList: [
            {
                author: "Kavita N.",
                rating: 5,
                text: "Great for hair, makes it soft and shiny.",
                date: new Date("2024-05-19")
            },
            {
                author: "Rohan G.",
                rating: 4,
                text: "Natural and effective, love the scent.",
                date: new Date("2024-05-17")
            }
        ]
    },
    {
        name: "Spiced Honey",
        description: "Premium honey infused with natural spices for a unique flavor.",
        mainTag: "Bestseller",
        additionalTags: ["Organic", "Flavored"],
        categories: ["Sweetener", "Health Supplement"],
        brand: "Fusion Moksha",
        origin: "India",
        rating: 4.6,
        reviews: 40,
        mainImage: "https://fusionmoksha.com/wp-content/uploads/2024/05/honey_spiced_fusion_moksha_1.png",
        variants: [
            {
                weight: { value: 500, unit: "g" },
                price: 150,
                originalPrice: 180,
                discountPrice: 150,
                savings: 30,
                savingsPercentage: "17%",
                image: "https://fusionmoksha.com/wp-content/uploads/2024/05/honey_spiced_fusion_moksha_1.png",
                stock: 80
            }
        ],
        defaultVariant: {
            weight: { value: 500, unit: "g" },
            price: 150,
            originalPrice: 180,
            discountPrice: 150,
            savings: 30,
            savingsPercentage: "17%",
            image: "https://fusionmoksha.com/wp-content/uploads/2024/05/honey_spiced_fusion_moksha_1.png"
        },
        reviewList: [
            {
                author: "Kavita N.",
                rating: 5,
                text: "Delicious honey with perfect spice blend.",
                date: new Date("2024-05-19")
            },
            {
                author: "Rohan G.",
                rating: 4,
                text: "Great taste, natural and healthy.",
                date: new Date("2024-05-17")
            }
        ]
    },
    {
        name: "Multi Floral Honey Sourced from North East",
        description: "Premium honey sourced from the pristine forests of North East India.",
        mainTag: "Featured",
        additionalTags: ["Raw", "Unprocessed"],
        categories: ["Sweetener", "Health Supplement"],
        brand: "Fusion Moksha",
        origin: "North East India",
        rating: 4.6,
        reviews: 40,
        mainImage: "https://fusionmoksha.com/wp-content/uploads/2024/05/honey_multi_floral_fusion_moksha_1-1.png",
        variants: [
            {
                weight: { value: 500, unit: "g" },
                price: 150,
                originalPrice: 180,
                discountPrice: 150,
                savings: 30,
                savingsPercentage: "17%",
                image: "https://fusionmoksha.com/wp-content/uploads/2024/05/honey_multi_floral_fusion_moksha_1-1.png",
                stock: 90
            }
        ],
        defaultVariant: {
            weight: { value: 500, unit: "g" },
            price: 150,
            originalPrice: 180,
            discountPrice: 150,
            savings: 30,
            savingsPercentage: "17%",
            image: "https://fusionmoksha.com/wp-content/uploads/2024/05/honey_multi_floral_fusion_moksha_1-1.png"
        },
        reviewList: [
            {
                author: "Kavita N.",
                rating: 5,
                text: "Best honey I've tried, amazing flavor.",
                date: new Date("2024-05-19")
            },
            {
                author: "Rohan G.",
                rating: 4,
                text: "Pure and natural, great taste.",
                date: new Date("2024-05-17")
            }
        ]
    }
];