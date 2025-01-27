// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import prisma from '../src/db/prisma.js';
import { hashPassword } from '../src/utils/auth.utils.js';

async function seedCategories() {
    const categories = [
        {
            name: 'Smart Pet Accessories',
            description: 'High-tech accessories for modern pets',
            isActive: true
        },
        {
            name: 'Tech-Enhanced Pet Care',
            description: 'Advanced technology for pet care and monitoring',
            isActive: true
        },
        {
            name: 'Pet Training Devices',
            description: 'Tools and devices for pet training',
            isActive: true
        },
        {
            name: 'Eco-Friendly Pet Products',
            description: 'Sustainable and environmentally friendly pet products',
            isActive: true
        },
        {
            name: 'Customizable Pet Products',
            description: 'Personalized products for your pets',
            isActive: true
        },
        {
            name: 'Health and Wellness',
            description: 'Products for pet health and wellness',
            isActive: true
        }
    ];

    console.log('Starting to seed categories...');

    // check if categories already exist
    try {
        for (const category of categories) {
            const existingCategory = await prisma.category.findFirst({
                where: { name: category.name }
            });

            if (!existingCategory) {
                await prisma.category.create({
                    data: category
                });
                console.log(`Created category: ${category.name}`);
            } else {
                console.log(`Category ${category.name} already exists, skipping...`);
            }
        }
        console.log('Categories seeding completed successfully');
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    }

}

async function seedProducts() {
    // get all category IDs
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true
        }
    });

    const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));

    const products = [
        {
            name: "GPS Tracker Smart Collar",
            description: "Keep track of your pet's location and activity with our GPS-enabled smart collar.",
            price: 59.99,
            stockQuantity: 50,
            sku: "SMART-COLLAR-001",
            brand: "TrackTail",
            rating: 4.7,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_1.webp",
            categoryId: categoryMap.get("Smart Pet Accessories"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_3.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/gps-tracker/tracker_4.webp"
            ],
            features: [
                {
                    title: "Real-time GPS Tracking",
                    description: "Monitor your pet's location in real-time through our mobile app"
                },
                {
                    title: "Activity Monitoring",
                    description: "Track your pet's daily activity levels and patterns"
                },
                {
                    title: "Geofencing",
                    description: "Set up safe zones and receive alerts when your pet leaves the area"
                }
            ],
            specifications: [
                { key: "Battery Life", value: "Up to 7 days" },
                { key: "Water Resistance", value: "IP67 rated" },
                { key: "Connectivity", value: "4G LTE & Bluetooth" },
                { key: "Weight", value: "35 grams" },
                { key: "Size Range", value: "Adjustable 12-20 inches" }
            ]
        },
        {
            name: "Automatic Pet Feeder",
            description: "Schedule and manage feeding times easily from your phone with our smart feeder.",
            price: 99.99,
            stockQuantity: 40,
            sku: "SMART-FEEDER-001",
            brand: "FeedSmart",
            rating: 4.5,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-feeder/pet-feeder-1.webp",
            categoryId: categoryMap.get("Smart Pet Accessories"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-feeder/pet-feeder-1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-feeder/pet-feeder-2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-feeder/pet-feeder-3.webp"
            ],
            features: [
                {
                    title: "Smart Scheduling",
                    description: "Set up to 6 feeding times per day through the mobile app"
                },
                {
                    title: "Portion Control",
                    description: "Precise portion control from 1/8 cup to 4 cups per meal"
                },
                {
                    title: "Battery Backup",
                    description: "Continues to function during power outages"
                }
            ],
            specifications: [
                { key: "Capacity", value: "6L / 25 cups of dry food" },
                { key: "Power Source", value: "AC with battery backup" },
                { key: "Connectivity", value: "Wi-Fi 2.4GHz" },
                { key: "Material", value: "Food-grade BPA-free plastic" },
                { key: "Dimensions", value: "12 x 8 x 15 inches" }
            ]
        },
        {
            name: "Wi-Fi Pet Camera",
            description: "Monitor and interact with your pet remotely with our high-definition Wi-Fi camera.",
            price: 120.99,
            stockQuantity: 30,
            sku: "PET-CAM-001",
            brand: "EyePet",
            rating: 4.8,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-1.webp",
            categoryId: categoryMap.get("Tech-Enhanced Pet Care"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-3.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-camera/pet-camera-4.webp"
            ],
            features: [
                {
                    title: "Two-Way Audio",
                    description: "Talk to and hear your pet with clear two-way audio"
                },
                {
                    title: "Night Vision",
                    description: "Clear vision up to 30ft in complete darkness"
                },
                {
                    title: "Treat Dispenser",
                    description: "Remote treat dispensing capability"
                }
            ],
            specifications: [
                { key: "Resolution", value: "1080p HD" },
                { key: "Field of View", value: "160° wide-angle" },
                { key: "Night Vision", value: "850nm IR LEDs" },
                { key: "Audio", value: "Two-way with noise cancellation" },
                { key: "Storage", value: "Cloud + Local SD card up to 128GB" }
            ]
        },
        {
            name: "Scat Mat Training Pad",
            description: "Train your pets to avoid areas of your home with this harmless scat mat.",
            price: 44.99,
            stockQuantity: 50,
            sku: "TRAIN-MAT-001",
            brand: "StayAway",
            rating: 4.3,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-1.webp",
            categoryId: categoryMap.get("Pet Training Devices"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-3.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-4.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-5.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/pet-mat/pet-mat-6.webp"
            ],
            features: [
                {
                    title: "Safe Static Pulse",
                    description: "Delivers harmless static pulse to discourage pets"
                },
                {
                    title: "Waterproof Design",
                    description: "Fully waterproof for indoor and outdoor use"
                },
                {
                    title: "Adjustable Sensitivity",
                    description: "Three levels of sensitivity for different pets"
                }
            ],
            specifications: [
                { key: "Size", value: "30 x 16 inches" },
                { key: "Power", value: "3 x AAA batteries" },
                { key: "Material", value: "Pet-safe PVC" },
                { key: "Battery Life", value: "Up to 6 months" },
                { key: "Sensitivity Levels", value: "3 adjustable levels" }
            ]
        },
        {
            name: "Eco-Friendly Dog Bed",
            description: "Made from 100% recycled materials, our eco-friendly bed offers comfort and sustainability.",
            price: 89.99,
            stockQuantity: 20,
            sku: "ECO-BED-001",
            brand: "GreenPaws",
            rating: 4.9,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-1.webp",
            categoryId: categoryMap.get("Eco-Friendly Pet Products"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-3.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-4.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-5.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-bed/dog-bed-6.webp"
            ],
            features: [
                {
                    title: "Recycled Materials",
                    description: "Made from 100% post-consumer recycled plastics"
                },
                {
                    title: "Orthopedic Support",
                    description: "Memory foam provides joint support"
                },
                {
                    title: "Machine Washable",
                    description: "Easy to clean and maintain"
                }
            ],
            specifications: [
                { key: "Size", value: "36 x 28 x 9 inches" },
                { key: "Material", value: "Recycled polyester, memory foam" },
                { key: "Weight Capacity", value: "Up to 100 lbs" },
                { key: "Care", value: "Machine washable cover" },
                { key: "Warranty", value: "2 years" }
            ]
        },
        {
            name: "Recycled Material Cat Toy Set",
            description: "Engage your cat with our environmentally friendly toy set made from recycled materials.",
            price: 19.99,
            stockQuantity: 80,
            sku: "ECO-TOY-001",
            brand: "EcoPlay",
            rating: 4.6,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-1.webp",
            categoryId: categoryMap.get("Eco-Friendly Pet Products"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-3.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-4.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-5.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-toy-set/cat-toy-set-6.webp"
            ],
            features: [
                {
                    title: "Eco-Friendly Materials",
                    description: "Made from recycled and sustainable materials"
                },
                {
                    title: "Interactive Play",
                    description: "Various toys for different play styles"
                },
                {
                    title: "Safe Design",
                    description: "No small parts or harmful materials"
                }
            ],
            specifications: [
                { key: "Set Contents", value: "6 different toys" },
                { key: "Materials", value: "Recycled plastic, organic catnip" },
                { key: "Safety", value: "Non-toxic, pet-safe dyes" },
                { key: "Age Range", value: "All ages" },
                { key: "Package Weight", value: "12 oz" }
            ]
        },
        {
            name: "Personalized Dog Collar",
            description: "Customize with your dog's name and your contact information with stylish fonts and colors.",
            price: 29.99,
            stockQuantity: 60,
            sku: "CUSTOM-COLLAR-001",
            brand: "CollarCustom",
            rating: 4.7,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-1.webp",
            categoryId: categoryMap.get("Customizable Pet Products"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-3.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-4.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-5.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-collar/dog-collar-6.webp"
            ],
            features: [
                {
                    title: "Custom Engraving",
                    description: "Personalized engraving with name and contact info"
                },
                {
                    title: "Adjustable Design",
                    description: "Easy-to-adjust buckle for perfect fit"
                },
                {
                    title: "Reflective Stitching",
                    description: "High-visibility reflective threading for night safety"
                }
            ],
            specifications: [
                { key: "Material", value: "Premium nylon webbing" },
                { key: "Sizes Available", value: "XS to XL" },
                { key: "Width", value: "1 inch" },
                { key: "Buckle Type", value: "Quick-release safety buckle" },
                { key: "Color Options", value: "8 different colors" }
            ]
        },
        {
            name: "Probiotic Dog Supplement",
            description: "Support your dog's digestive health with our vet-approved probiotic supplement.",
            price: 39.99,
            stockQuantity: 55,
            sku: "HEALTH-PROB-001",
            brand: "VitaPup",
            rating: 4.5,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-1.webp",
            categoryId: categoryMap.get("Health and Wellness"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-3.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-4.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-5.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/dog-biotic/dog-biotic-6.webp"
            ],
            features: [
                {
                    title: "Veterinarian Formulated",
                    description: "Developed by pet nutrition experts"
                },
                {
                    title: "Multiple Strains",
                    description: "Contains 6 beneficial probiotic strains"
                },
                {
                    title: "Easy Administration",
                    description: "Chicken-flavored chewable tablets"
                }
            ],
            specifications: [
                { key: "Form", value: "Chewable tablets" },
                { key: "Count", value: "60 tablets per bottle" },
                { key: "Active Ingredients", value: "6 probiotic strains" },
                { key: "CFUs", value: "5 billion per tablet" },
                { key: "Storage", value: "Room temperature stable" }
            ]
        },
        {
            name: "Prescription Diet Cat Food",
            description: "Specially formulated food to manage your cat's health needs prescribed by veterinarians.",
            price: 34.99,
            stockQuantity: 40,
            sku: "HEALTH-DIET-001",
            brand: "HealthBites",
            rating: 4.8,
            mainImage: "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-1.webp",
            categoryId: categoryMap.get("Health and Wellness"),
            images: [
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-1.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-2.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-3.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-4.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-5.webp",
                "https://digitailpets.s3.ap-southeast-2.amazonaws.com/pet-products-images/cat-pres-bag/cat-pres-bag-6.webp"
            ],
            features: [
                {
                    title: "Prescription Formula",
                    description: "Specially formulated for specific health conditions"
                },
                {
                    title: "High-Quality Protein",
                    description: "Premium protein sources for optimal nutrition"
                },
                {
                    title: "Balanced Nutrients",
                    description: "Complete and balanced nutrition for adult cats"
                }
            ],
            specifications: [
                { key: "Package Size", value: "5.5 lb bag" },
                { key: "Life Stage", value: "Adult" },
                { key: "Special Diet", value: "Prescription required" },
                { key: "Protein Content", value: "32% minimum" },
                { key: "Calories", value: "375 kcal/cup" }
            ]
        }
    ];

    console.log('Starting to seed products...');

    try {
        for (const product of products) {
            if (!product.categoryId) {
                console.log(`Skipping product ${product.name} - category not found`);
                continue;
            }

            const existingProduct = await prisma.product.findFirst({
                where: { sku: product.sku }
            });

            if (!existingProduct) {
                await prisma.product.create({
                    data: {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stockQuantity: product.stockQuantity,
                        sku: product.sku,
                        brand: product.brand,
                        rating: product.rating,
                        mainImage: product.mainImage,
                        categoryId: product.categoryId,
                        isActive: true,
                        images: {
                            create: product.images.map((url, index) => ({
                                url,
                                isMain: index === 0,
                                sortOrder: index
                            }))
                        },
                        features: {
                            create: product.features
                        },
                        specifications: {
                            create: product.specifications
                        }
                    }
                });
                console.log(`Created product: ${product.name}`);
            } else {
                console.log(`Product ${product.name} already exists, skipping...`);
            }
        }
        console.log('Products seeding completed successfully');
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
}

async function seedRoles() {
    const roles = [
        {
            name: 'ADMIN',
            description: 'Administrator role with full access'
        },
        {
            name: 'CUSTOMER',
            description: 'Regular customer role'
        }
    ];

    console.log('Starting to seed roles...');

    try {
        for (const role of roles) {
            const existingRole = await prisma.role.findFirst({
                where: { name: role.name }
            });

            if (!existingRole) {
                await prisma.role.create({
                    data: role
                });
                console.log(`Created role: ${role.name}`);
            } else {
                console.log(`Role ${role.name} already exists, skipping...`);
            }
        }
        console.log('Roles seeding completed successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
        throw error;
    }
}

async function seedAdminUser() {
    try {
        const adminRole = await prisma.role.findFirst({
            where: { name: 'ADMIN' }
        });

        if (!adminRole) {
            throw new Error('Admin role not found');
        }

        const existingAdmin = await prisma.user.findFirst({
            where: { email: 'admin@digitailpets.com' }
        });

        if (!existingAdmin) {
            const hashedPassword = await hashPassword('Admin123!@#');
            
            const admin = await prisma.user.create({
                data: {
                    username: 'admin',
                    email: 'admin@digitailpets.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    dateOfBirth: new Date('1990-01-01'),
                    roleId: adminRole.id,
                    isActive: true,
                    authentication: {
                        create: {
                            passwordHash: hashedPassword,
                            loginAttempts: 0
                        }
                    }
                }
            });
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists, skipping...');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
        throw error;
    }
}

// Main seed function
async function main() {
    console.log('Starting seeding...');
    
    try {
        // Comment out the seeding functions you don't want to run
        await seedRoles();
        await seedAdminUser();
        await seedCategories();
        await seedProducts();
        
        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Execute seeding
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });