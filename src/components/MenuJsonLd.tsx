import React from "react";

interface MenuItemSnippet {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  image?: string | null;
  isVeg: boolean;
  categoryName?: string;
}

interface MenuJsonLdProps {
  products: MenuItemSnippet[];
  currency?: string;
  url?: string;
}

export function MenuJsonLd({
  products,
  currency = "INR",
  url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}: MenuJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${url}/menu#menu`,
    name: "Antigravity Bistro & Kitchen Menu",
    url: `${url}/menu`,
    hasMenuItem: products.map((prod) => ({
      "@type": "MenuItem",
      name: prod.name,
      description: prod.description || undefined,
      image: prod.image || undefined,
      suitableForDiet: prod.isVeg
        ? "https://schema.org/VegetarianDiet"
        : undefined,
      offers: {
        "@type": "Offer",
        price: (prod.basePrice / 100).toFixed(2),
        priceCurrency: currency,
        availability: "https://schema.org/InStock",
        url: `${url}/menu#${prod.id}`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
