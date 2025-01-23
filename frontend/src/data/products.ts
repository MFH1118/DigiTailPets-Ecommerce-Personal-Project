// src/data/products.ts

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    stock: number;
    rating: number;
    brand: string;
  }
  
  const petProducts: Product[] = [
    {
      id: "dog-food-1",
      name: "Premium Dog Food",
      price: 49.99,
      image: "/api/placeholder/200/200",
      description: "High-quality dry dog food for all breeds",
      category: "Dog Food",
      stock: 100,
      rating: 4.5,
      brand: "PawPerfect"
    },
    {
      id: "cat-toy-1",
      name: "Interactive Cat Wand",
      price: 12.99,
      image: "/api/placeholder/200/200",
      description: "Engaging feather toy for active cats",
      category: "Cat Toys",
      stock: 150,
      rating: 4.8,
      brand: "Whiskers"
    },
    {
      id: "fish-tank-1",
      name: "Aquarium Starter Kit",
      price: 89.99,
      image: "/api/placeholder/200/200",
      description: "10-gallon complete aquarium setup",
      category: "Fish Supplies",
      stock: 30,
      rating: 4.2,
      brand: "AquaLife"
    },
    {
        id: "fish-tank-2",
        name: "Aquarium Starter Kit 2",
        price: 199.99,
        image: "/api/placeholder/200/200",
        description: "20-gallon complete aquarium setup",
        category: "Fish Supplies",
        stock: 35,
        rating: 4.6,
        brand: "AquaLife"
    },
    {
        id: "fish-tank-3",
        name: "Aquarium Starter Kit 3",
        price: 299.99,
        image: "/api/placeholder/200/200",
        description: "20-gallon complete aquarium setup",
        category: "Fish Supplies",
        stock: 35,
        rating: 4.6,
        brand: "AquaLife"
    }
  ];
  
  export const getProducts = (section: string): Product[] => {
    // Simulate different product sections with the same base products
    return petProducts.map(product => ({
      ...product,
      id: `${section}-${product.id}`,
      price: section === 'featured' ? product.price * 1.1 : product.price
    }));
  };
  
  export const getFeaturedProducts = () => getProducts('featured');
  export const getNewReleases = () => getProducts('new');
  export const getEssentials = () => getProducts('essentials');