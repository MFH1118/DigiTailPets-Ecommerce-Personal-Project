// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import prisma from '../src/db/prisma.js';
import { hashPassword } from '../src/utils/auth.utils.js';

async function seedCategories() {
    const categories = [
        {
            name: 'Dog Food',
            description: 'High-quality nutrition for your canine companions',
            isActive: true
        },
        {
            name: 'Cat Food',
            description: 'Premium nutrition for your feline friends',
            isActive: true
        },
        {
            name: 'Pet Toys',
            description: 'Engaging toys for pets of all kinds',
            isActive: true
        },
        {
            name: 'Pet Accessories',
            description: 'Essential accessories for your pets',
            isActive: true
        },
        {
            name: 'Pet Health',
            description: 'Health and wellness products for pets',
            isActive: true
        },
        {
            name: 'Pet Grooming',
            description: 'Grooming supplies and equipment',
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
        // Dog Food Products
        {
            name: 'Premium Puppy Kibble',
            description: 'Specially formulated for growing puppies',
            price: 29.99,
            stockQuantity: 100,
            sku: 'DOG-FOOD-001',
            categoryId: categoryMap.get('Dog Food'),
            isActive: true,
            imageUrl: 'https://example.com/puppy-kibble.jpg'
        },
        {
            name: 'Adult Dog Food - Chicken & Rice',
            description: 'Complete nutrition for adult dogs',
            price: 34.99,
            stockQuantity: 150,
            sku: 'DOG-FOOD-002',
            categoryId: categoryMap.get('Dog Food'),
            isActive: true,
            imageUrl: 'https://example.com/adult-dog-food.jpg'
        },
        // Cat Food Products
        {
            name: 'Gourmet Cat Food - Salmon',
            description: 'Premium salmon-based cat food',
            price: 24.99,
            stockQuantity: 120,
            sku: 'CAT-FOOD-001',
            categoryId: categoryMap.get('Cat Food'),
            isActive: true,
            imageUrl: 'https://example.com/cat-food-salmon.jpg'
        },
        {
            name: 'Indoor Cat Formula',
            description: 'Specialized nutrition for indoor cats',
            price: 27.99,
            stockQuantity: 100,
            sku: 'CAT-FOOD-002',
            categoryId: categoryMap.get('Cat Food'),
            isActive: true,
            imageUrl: 'https://example.com/indoor-cat-food.jpg'
        },
        // Pet Toys
        {
            name: 'Interactive Ball Toy',
            description: 'Engaging ball toy for dogs',
            price: 12.99,
            stockQuantity: 200,
            sku: 'TOY-001',
            categoryId: categoryMap.get('Pet Toys'),
            isActive: true,
            imageUrl: 'https://example.com/ball-toy.jpg'
        },
        {
            name: 'Cat Wand Toy',
            description: 'Interactive wand toy for cats',
            price: 9.99,
            stockQuantity: 150,
            sku: 'TOY-002',
            categoryId: categoryMap.get('Pet Toys'),
            isActive: true,
            imageUrl: 'https://example.com/wand-toy.jpg'
        },
        // Pet Accessories
        {
            name: 'Adjustable Dog Collar',
            description: 'Comfortable collar for dogs of all sizes',
            price: 14.99,
            stockQuantity: 100,
            sku: 'ACC-001',
            categoryId: categoryMap.get('Pet Accessories'),
            isActive: true,
            imageUrl: 'https://example.com/dog-collar.jpg'
        },
        {
            name: 'Cat Litter Box',
            description: 'Covered litter box for privacy',
            price: 29.99,
            stockQuantity: 75,
            sku: 'ACC-002',
            categoryId: categoryMap.get('Pet Accessories'),
            isActive: true,
            imageUrl: 'https://example.com/litter-box.jpg'
        },
        // Pet Health Products
        {
            name: 'Joint Health Supplements',
            description: 'Support healthy joints in dogs',
            price: 39.99,
            stockQuantity: 80,
            sku: 'HEALTH-001',
            categoryId: categoryMap.get('Pet Health'),
            isActive: true,
            imageUrl: 'https://example.com/joint-supplements.jpg'
        },
        {
            name: 'Cat Hairball Control',
            description: 'Natural hairball relief for cats',
            price: 19.99,
            stockQuantity: 90,
            sku: 'HEALTH-002',
            categoryId: categoryMap.get('Pet Health'),
            isActive: true,
            imageUrl: 'https://example.com/hairball-control.jpg'
        },
        // Pet Grooming Products
        {
            name: 'Professional Dog Shampoo',
            description: 'Gentle, pH-balanced dog shampoo',
            price: 16.99,
            stockQuantity: 120,
            sku: 'GROOM-001',
            categoryId: categoryMap.get('Pet Grooming'),
            isActive: true,
            imageUrl: 'https://example.com/dog-shampoo.jpg'
        },
        {
            name: 'Pet Grooming Brush',
            description: 'Suitable for both cats and dogs',
            price: 21.99,
            stockQuantity: 100,
            sku: 'GROOM-002',
            categoryId: categoryMap.get('Pet Grooming'),
            isActive: true,
            imageUrl: 'https://example.com/grooming-brush.jpg'
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
                        categoryId: product.categoryId,
                        isActive: product.isActive,
                        imageUrl: product.imageUrl
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
        // await seedRoles();
        // await seedAdminUser();
        // await seedCategories();
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