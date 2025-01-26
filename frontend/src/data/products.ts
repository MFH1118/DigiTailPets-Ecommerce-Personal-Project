// src/data/products.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  image: string;
  description: string;
  category: string;
  stock: number;
  rating: number;
  brand: string;
}

const petProducts: Product[] = [
  // Smart Pet Accessories
  {
      id: "smart-collar-1",
      name: "GPS Tracker Smart Collar",
      price: 59.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_3.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_4.webp"
      ],
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_1.webp",
      description: "Keep track of your pet's location and activity with our GPS-enabled smart collar.",
      category: "Smart Pet Accessories",
      stock: 50,
      rating: 4.7,
      brand: "TrackTail"
  },
  {
      id: "smart-feeder-1",
      name: "Automatic Pet Feeder",
      price: 99.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-feeder/pet-feeder-1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-feeder/pet-feeder-2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-feeder/pet-feeder-3.webp"
      ],
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-feeder/pet-feeder-1.webp",
      description: "Schedule and manage feeding times easily from your phone with our smart feeder.",
      category: "Smart Pet Accessories",
      stock: 40,
      rating: 4.5,
      brand: "FeedSmart"
  },
  // Tech-Enhanced Pet Care
  {
      id: "pet-camera-1",
      name: "Wi-Fi Pet Camera",
      price: 120.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-3.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-4.webp"
      ],
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-1.webp",
      description: "Monitor and interact with your pet remotely with our high-definition Wi-Fi camera.",
      category: "Tech-Enhanced Pet Care",
      stock: 30,
      rating: 4.8,
      brand: "EyePet"
  },
  // Pet Training Devices
  {
      id: "training-mat-1",
      name: "Scat Mat Training Pad",
      price: 44.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-3.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-4.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-5.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-6.webp"
      ],
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-1.webp",
      description: "Train your pets to avoid areas of your home with this harmless scat mat.",
      category: "Pet Training Devices",
      stock: 50,
      rating: 4.3,
      brand: "StayAway"
  },
  // Eco-Friendly Pet Products
  {
      id: "eco-bed-1",
      name: "Eco-Friendly Dog Bed",
      price: 89.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-3.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-4.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-5.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-6.webp"
      ],
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-1.webp",
      description: "Made from 100% recycled materials, our eco-friendly bed offers comfort and sustainability.",
      category: "Eco-Friendly Pet Products",
      stock: 20,
      rating: 4.9,
      brand: "GreenPaws"
  },
  {
      id: "eco-toys-1",
      name: "Recycled Material Cat Toy Set",
      price: 19.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-3.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-4.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-5.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-6.webp"
      ],
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-1.webp",
      description: "Engage your cat with our environmentally friendly toy set made from recycled materials.",
      category: "Eco-Friendly Pet Products",
      stock: 80,
      rating: 4.6,
      brand: "EcoPlay"
  },
  // Customizable Pet Products
  {
      id: "custom-collar-1",
      name: "Personalized Dog Collar",
      price: 29.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-3.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-4.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-5.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-6.webp"
      ],      
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-1.webp",
      description: "Customize with your dog's name and your contact information with stylish fonts and colors.",
      category: "Customizable Pet Products",
      stock: 60,
      rating: 4.7,
      brand: "CollarCustom"
  },
  // Health and Wellness
  {
      id: "health-supplement-1",
      name: "Probiotic Dog Supplement",
      price: 39.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-3.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-4.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-5.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-6.webp"
      ],      
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-1.webp",
      description: "Support your dog's digestive health with our vet-approved probiotic supplement.",
      category: "Health and Wellness",
      stock: 55,
      rating: 4.5,
      brand: "VitaPup"
  },
  {
      id: "diet-cat-food-1",
      name: "Prescription Diet Cat Food",
      price: 34.99,
      images: [
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-1.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-2.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-3.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-4.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-5.webp",
        "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-6.webp"
      ],      
      image: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-1.webp",
      description: "Specially formulated food to manage your cat's health needs prescribed by veterinarians.",
      category: "Health and Wellness",
      stock: 40,
      rating: 4.8,
      brand: "HealthBites"
  }
];

export const getProducts = (section: string): Product[] => {
  // Simulate different product sections with the same base products
  return petProducts.map(product => ({
    ...product,
    id: `${section}-${product.id}`,
    price: product.price
  }));
};

export const getFeaturedProducts = () => getProducts('featured');
export const getNewReleases = () => getProducts('new');
export const getEssentials = () => getProducts('essentials');
