import { PrismaClient, Role, OrderType, OrderStatus, PaymentStatus, PaymentMethod, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Neon PostgreSQL database seed...");

  // 1. Restaurant Settings
  await prisma.restaurantSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Antigravity Bistro & Kitchen",
      phone: "+91 98765 43210",
      email: "orders@antigravitybistro.com",
      address: "104 Gourmet Square, Tech Boulevard, Silicon District",
      isOpen: true,
      deliveryRadiusKm: 15.0,
      minOrderAmount: 19900, // ₹199.00
      deliveryFee: 4000,     // ₹40.00
      freeDeliveryThreshold: 50000, // ₹500.00
      taxPercentage: 5.0,    // 5% GST
      openingHour: "10:00",
      closingHour: "23:00",
      currencySymbol: "₹",
      currencyCode: "INR",
    },
  });
  console.log("✓ Restaurant settings configured");

  // 2. Users
  const passwordHash = await bcrypt.hash("Admin@123456", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@antigravitybistro.com" },
    update: {},
    create: {
      email: "admin@antigravitybistro.com",
      name: "Head Chef Vikram",
      phone: "+91 98111 22233",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@antigravitybistro.com" },
    update: {},
    create: {
      email: "staff@antigravitybistro.com",
      name: "Kitchen Manager Priya",
      phone: "+91 98222 33344",
      passwordHash,
      role: Role.STAFF,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Arjun Sharma",
      phone: "+91 98333 44455",
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      addresses: {
        create: [
          {
            label: "Home",
            street: "Flat 402, Skyline Residency, 5th Cross",
            landmark: "Near Central Park",
            city: "Bangalore",
            state: "Karnataka",
            postalCode: "560001",
            isDefault: true,
          },
          {
            label: "Work",
            street: "Level 6, Infinity Tech Tower, Ring Road",
            landmark: "Opposite Metro Station",
            city: "Bangalore",
            state: "Karnataka",
            postalCode: "560103",
            isDefault: false,
          },
        ],
      },
    },
  });
  console.log("✓ Demo users created (Admin, Staff, Customer)");

  // 3. Categories & Products
  const categoriesData = [
    {
      name: "Wood-Fired Pizzas",
      slug: "wood-fired-pizzas",
      description: "Authentic Napoli sourdough pizzas baked at 450°C in our stone oven.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
      displayOrder: 1,
      products: [
        {
          name: "Truffle Burrata Margherita",
          slug: "truffle-burrata-margherita",
          description: "San Marzano tomato base, artisanal burrata ball, fresh basil, white truffle drizzle.",
          basePrice: 54900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80",
          isFeatured: true,
          preparationTime: 20,
          variants: [
            { name: "10-inch Medium", priceModifier: 0, isDefault: true },
            { name: "12-inch Large", priceModifier: 15000, isDefault: false },
          ],
          addOns: {
            name: "Pizza Enhancements",
            minSelect: 0,
            maxSelect: 3,
            options: [
              { name: "Extra Fresh Burrata", price: 12000 },
              { name: "Hot Honey Drizzle", price: 4000 },
              { name: "Roasted Garlic Flakes", price: 3000 },
            ],
          },
        },
        {
          name: "Smoked Pepperoni & Hot Honey",
          slug: "smoked-pepperoni-hot-honey",
          description: "Crispy beef & pork pepperoni cups, aged mozzarella, fermented chili hot honey.",
          basePrice: 62900,
          isVeg: false,
          image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
          isFeatured: true,
          preparationTime: 22,
          variants: [
            { name: "10-inch Medium", priceModifier: 0, isDefault: true },
            { name: "12-inch Large", priceModifier: 18000, isDefault: false },
          ],
          addOns: {
            name: "Crust & Cheese",
            minSelect: 0,
            maxSelect: 2,
            options: [
              { name: "Stuffed Cheese Crust", price: 9000 },
              { name: "Jalapeno Poppers on Top", price: 5000 },
            ],
          },
        },
        {
          name: "Quattro Formaggi Bianca",
          slug: "quattro-formaggi-bianca",
          description: "White sauce base, gorgonzola, smoked provolone, parmesan crisps, and mozzarella.",
          basePrice: 57900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&q=80",
          isFeatured: false,
          preparationTime: 18,
          variants: [
            { name: "10-inch Medium", priceModifier: 0, isDefault: true },
            { name: "12-inch Large", priceModifier: 16000, isDefault: false },
          ],
        },
      ],
    },
    {
      name: "Artisan Gourmet Burgers",
      slug: "artisan-burgers",
      description: "Brioche buns toasted to golden perfection with house-made sauces and seasoned patties.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
      displayOrder: 2,
      products: [
        {
          name: "Antigravity Double Smash Burger",
          slug: "antigravity-double-smash-burger",
          description: "Two 100% prime tender patties, double American cheddar, caramelized shallots, secret bistro spread.",
          basePrice: 42900,
          isVeg: false,
          image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80",
          isFeatured: true,
          preparationTime: 15,
          variants: [
            { name: "Single Patty", priceModifier: -8000, isDefault: false },
            { name: "Double Smash", priceModifier: 0, isDefault: true },
            { name: "Triple Monster", priceModifier: 12000, isDefault: false },
          ],
          addOns: {
            name: "Burger Upgrades",
            minSelect: 0,
            maxSelect: 3,
            options: [
              { name: "Crispy Bacon Strips", price: 7000 },
              { name: "Fried Farm Egg", price: 3000 },
              { name: "Avocado Slices", price: 6000 },
            ],
          },
        },
        {
          name: "Crispy Panko Paneer Burger",
          slug: "crispy-panko-paneer-burger",
          description: "Thick spiced paneer steak crusted in panko breadcrumbs, spicy sriracha slaw, pickled gherkins.",
          basePrice: 34900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
          isFeatured: true,
          preparationTime: 15,
          variants: [
            { name: "Classic Brioche", priceModifier: 0, isDefault: true },
            { name: "Multigrain Bun", priceModifier: 2000, isDefault: false },
          ],
          addOns: {
            name: "Sauce & Sides",
            minSelect: 0,
            maxSelect: 2,
            options: [
              { name: "Truffle Mayo Dip", price: 3500 },
              { name: "Peri-Peri Seasoning", price: 2000 },
            ],
          },
        },
      ],
    },
    {
      name: "Starters & Small Plates",
      slug: "starters-appetizers",
      description: "Crispy bites, loaded fries, and handcrafted dips to kickstart your feast.",
      image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80",
      displayOrder: 3,
      products: [
        {
          name: "Parmesan Truffle Loaded Fries",
          slug: "parmesan-truffle-loaded-fries",
          description: "Skin-on Belgian cut fries tossed in white truffle oil, rosemary sea salt, and aged Grana Padano.",
          basePrice: 24900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&q=80",
          isFeatured: true,
          preparationTime: 12,
        },
        {
          name: "Korean Glazed Fried Chicken Wings",
          slug: "korean-glazed-chicken-wings",
          description: "Twice-fried crispy chicken wings smothered in sweet Gochujang glaze, topped with toasted sesame.",
          basePrice: 38900,
          isVeg: false,
          image: "https://images.unsplash.com/photo-1527477321055-436158a2b00d?w=800&q=80",
          isFeatured: false,
          preparationTime: 16,
          variants: [
            { name: "6 Wings", priceModifier: 0, isDefault: true },
            { name: "12 Wings Sharing Pack", priceModifier: 32000, isDefault: false },
          ],
        },
      ],
    },
    {
      name: "Artisan Pastas & Bowls",
      slug: "pastas-bowls",
      description: "Bronze-die extruded pasta cooked al dente in slow-simmered regional Italian sauces.",
      image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281720?w=800&q=80",
      displayOrder: 4,
      products: [
        {
          name: "Slow-Braised Lamb Ragu Fettuccine",
          slug: "lamb-ragu-fettuccine",
          description: "Slow-cooked 8-hour shredded lamb shoulder in chianti wine sauce with handmade egg fettuccine.",
          basePrice: 58900,
          isVeg: false,
          image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
          isFeatured: true,
          preparationTime: 22,
        },
        {
          name: "Wild Mushroom & Truffle Penne",
          slug: "wild-mushroom-truffle-penne",
          description: "Cremini, shiitake, and porcini mushrooms sauteed in thyme garlic butter with velvet cream.",
          basePrice: 47900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&q=80",
          isFeatured: false,
          preparationTime: 18,
        },
      ],
    },
    {
      name: "Desserts & Craft Shakes",
      slug: "desserts-shakes",
      description: "Decadent sweet endings freshly prepared daily by our pastry chefs.",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
      displayOrder: 5,
      products: [
        {
          name: "Classic Italian Tiramisu",
          slug: "classic-italian-tiramisu",
          description: "Savoiardi ladyfingers soaked in dark espresso and marsala, layered with whipped mascarpone cream.",
          basePrice: 28900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
          isFeatured: true,
          preparationTime: 5,
        },
        {
          name: "Belgian Dark Chocolate Molten Cake",
          slug: "belgian-dark-chocolate-molten-cake",
          description: "Warm chocolate lava cake made with 70% Callebaut dark chocolate, served with Madagascar vanilla gelato.",
          basePrice: 32900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
          isFeatured: true,
          preparationTime: 12,
        },
      ],
    },
    {
      name: "Beverages & Mocktails",
      slug: "beverages-mocktails",
      description: "Chilled hand-pressed coolers, cold brews, and botanical lemonades.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
      displayOrder: 6,
      products: [
        {
          name: "Sparkling Passion Fruit Iced Tea",
          slug: "sparkling-passion-fruit-iced-tea",
          description: "Cold brewed Darjeeling black tea infused with passion fruit pulp and fresh garden mint.",
          basePrice: 17900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80",
          isFeatured: false,
          preparationTime: 5,
        },
        {
          name: "Artisan Cold Brew Coffee",
          slug: "artisan-cold-brew-coffee",
          description: "18-hour slow steeped Arabica single-origin bean coffee served over crystal clear ice.",
          basePrice: 19900,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80",
          isFeatured: false,
          preparationTime: 5,
        },
      ],
    },
  ];

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        displayOrder: cat.displayOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        displayOrder: cat.displayOrder,
      },
    });

    for (const prod of cat.products) {
      const product = await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          name: prod.name,
          description: prod.description,
          basePrice: prod.basePrice,
          isVeg: prod.isVeg,
          image: prod.image,
          isFeatured: prod.isFeatured,
          preparationTime: prod.preparationTime,
          categoryId: category.id,
        },
        create: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          basePrice: prod.basePrice,
          isVeg: prod.isVeg,
          image: prod.image,
          isFeatured: prod.isFeatured,
          preparationTime: prod.preparationTime,
          categoryId: category.id,
        },
      });

      // Variants
      if (prod.variants && prod.variants.length > 0) {
        await prisma.productVariant.deleteMany({ where: { productId: product.id } });
        for (const v of prod.variants) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              name: v.name,
              priceModifier: v.priceModifier,
              isDefault: v.isDefault,
            },
          });
        }
      }

      // Add-ons
      const prodAny = prod as any;
      if (prodAny.addOns) {
        await prisma.addOnGroup.deleteMany({ where: { productId: product.id } });
        const group = await prisma.addOnGroup.create({
          data: {
            productId: product.id,
            name: prodAny.addOns.name,
            minSelect: prodAny.addOns.minSelect,
            maxSelect: prodAny.addOns.maxSelect,
          },
        });
        for (const opt of prodAny.addOns.options) {
          await prisma.addOnOption.create({
            data: {
              groupId: group.id,
              name: opt.name,
              price: opt.price,
            },
          });
        }
      }

      // Add verified sample review
      const existingReview = await prisma.review.findFirst({ where: { productId: product.id } });
      if (!existingReview) {
        await prisma.review.create({
          data: {
            productId: product.id,
            userId: customer.id,
            userName: "Arjun Sharma",
            rating: 5,
            comment: "Hands down one of the best dishes in town. Fresh, perfectly balanced flavors and fast delivery!",
            isVerifiedPurchase: true,
          },
        });
      }
    }
  }
  console.log("✓ Categories and menu items seeded successfully");

  // 4. Coupons
  const coupons = [
    {
      code: "WELCOME50",
      description: "50% off on your first order up to ₹150",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 50,
      minOrderAmount: 29900,
      maxDiscount: 15000,
      validUntil: new Date("2027-12-31"),
    },
    {
      code: "BISTRO20",
      description: "20% off on gourmet meals over ₹399",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minOrderAmount: 39900,
      maxDiscount: 10000,
      validUntil: new Date("2027-12-31"),
    },
    {
      code: "FLAT100",
      description: "Flat ₹100 instant discount on orders above ₹599",
      discountType: DiscountType.FIXED,
      discountValue: 10000,
      minOrderAmount: 59900,
      maxDiscount: 10000,
      validUntil: new Date("2027-12-31"),
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log("✓ Coupons seeded");

  // 5. Sample Order for Demo Tracking
  const existingOrder = await prisma.order.findFirst({ where: { customerEmail: "customer@example.com" } });
  if (!existingOrder) {
    const featuredProduct = await prisma.product.findFirst({ where: { slug: "truffle-burrata-margherita" } });
    if (featuredProduct) {
      const order = await prisma.order.create({
        data: {
          orderNumber: "ORD-2026-88101",
          userId: customer.id,
          customerName: "Arjun Sharma",
          customerEmail: "customer@example.com",
          customerPhone: "+91 98333 44455",
          orderType: OrderType.DELIVERY,
          deliveryAddress: JSON.stringify({
            label: "Home",
            street: "Flat 402, Skyline Residency, 5th Cross",
            city: "Bangalore",
            state: "Karnataka",
            postalCode: "560001",
          }),
          status: OrderStatus.PREPARING,
          paymentStatus: PaymentStatus.PAID,
          paymentMethod: PaymentMethod.ONLINE,
          subtotal: 54900,
          discountTotal: 0,
          deliveryFee: 4000,
          taxTotal: 2745,
          grandTotal: 61645,
          notes: "Please pack extra oregano and chili flakes.",
          items: {
            create: [
              {
                productId: featuredProduct.id,
                productName: featuredProduct.name,
                variantName: "10-inch Medium",
                unitPrice: 54900,
                quantity: 1,
                totalPrice: 54900,
              },
            ],
          },
          statusHistory: {
            create: [
              {
                status: OrderStatus.PENDING,
                notes: "Order placed by customer",
                changedBy: "System",
              },
              {
                status: OrderStatus.CONFIRMED,
                notes: "Order accepted by kitchen",
                changedBy: "Head Chef Vikram",
              },
              {
                status: OrderStatus.PREPARING,
                notes: "Pizza dough being stretched and baked",
                changedBy: "Kitchen Staff Priya",
              },
            ],
          },
          payments: {
            create: {
              provider: PaymentMethod.ONLINE,
              transactionId: "pay_demo_test_987654",
              amount: 61645,
              status: PaymentStatus.PAID,
            },
          },
        },
      });
      console.log(`✓ Sample active order seeded: ${order.orderNumber}`);
    }
  }

  console.log("🎉 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
