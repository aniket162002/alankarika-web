export function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function HomeJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "अलंकारिका",
    "image": "https://alankarika.com/alankarika-logo.png",
    "description": "Premium traditional Indian jewelry store offering handcrafted designs",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "postalCode": "Your Postal Code",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "YOUR_LATITUDE",
      "longitude": "YOUR_LONGITUDE"
    },
    "url": "https://alankarika.com",
    "telephone": "+91-9769432565",
    "priceRange": "₹₹₹",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://facebook.com/alankarika",
      "https://instagram.com/alankarika",
      "https://twitter.com/alankarika"
    ]
  };

  return <JsonLd data={data} />;
}
