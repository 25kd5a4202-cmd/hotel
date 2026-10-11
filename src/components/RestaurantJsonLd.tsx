import React from "react";

interface RestaurantJsonLdProps {
  name?: string;
  url?: string;
  telephone?: string;
  email?: string;
  address?: string;
  openingHour?: string;
  closingHour?: string;
  currency?: string;
  images?: string[];
  ratingValue?: number;
  reviewCount?: number;
}

export function RestaurantJsonLd({
  name = "Antigravity Bistro & Kitchen",
  url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  telephone = "+91 98765 43210",
  email = "orders@antigravitybistro.com",
  address = "104 Gourmet Square, Tech Boulevard, Silicon District, Bangalore, Karnataka 560001",
  openingHour = "10:00",
  closingHour = "23:00",
  currency = "INR",
  images = [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
  ],
  ratingValue = 4.9,
  reviewCount = 142,
}: RestaurantJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}/#restaurant`,
    name,
    image: images,
    url,
    telephone,
    email,
    priceRange: "₹₹",
    servesCuisine: [
      "Italian",
      "Wood-Fired Pizza",
      "Artisan Burgers",
      "Handmade Pasta",
      "Gourmet Desserts",
      "Craft Beverages",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "104 Gourmet Square, Tech Boulevard",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9716,
      longitude: 77.5946,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: openingHour,
        closes: closingHour,
      },
    ],
    menu: `${url}/menu`,
    hasMenu: `${url}/menu`,
    acceptsReservations: "True",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: reviewCount.toString(),
    },
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/menu`,
        inLanguage: "en-US",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      deliveryMethod: [
        "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
