import { Bricolage_Grotesque, Instrument_Sans, Fraunces } from "next/font/google";
import Providers from "@/components/layout/Providers";
import Grain from "@/components/home/Grain";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});
const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-serif",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const BASE_URL = "https://mmswaterdiviners.in";

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "M.M.S Water Diviners | Groundwater Survey Expert Kankavli",
    template: "%s | M.M.S Water Diviners",
  },
  icons: {
    icon: "/logo.jpeg",
  },
  description:
    "M.M.S Water Diviners — Dhananjay Manohar Sawant, Kankavli's top geophysical groundwater survey expert. Borewell point marking, depth estimation, 95% success rate, 10+ years experience. Call 9370427023.",

  keywords: [
    "water diviner Kankavli",
    "groundwater survey Maharashtra",
    "borewell expert Sindhudurg",
    "geophysical survey Kankavli",
    "Dhananjay Sawant water survey",
    "borewell point marking",
    "MMS Water Diviners",
    "aquifer detection Maharashtra",
  ],

  authors: [{ name: "Dhananjay Manohar Sawant" }],
  creator: "M.M.S Water Diviners",
  publisher: "M.M.S Water Diviners",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "M.M.S Water Diviners",
    title: "M.M.S Water Diviners | Groundwater Survey Expert Kankavli",
    description:
      "Professional groundwater scanning & borewell experts in Kankavli, Maharashtra. 10+ years experience. 95% success rate. Call 9370427023.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "M.M.S Water Diviners - Professional Groundwater Survey Kankavli",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "M.M.S Water Diviners | Groundwater Survey Kankavli",
    description:
      "Borewell experts in Kankavli, Maharashtra. 10+ years experience. 95% success rate.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2a4a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <head>

        {/* JSON-LD — tells Google this is a Local Business with rich data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://mmswaterdiviners.in/#business",
              name: "M.M.S Water Diviners",
              alternateName: "MMS Water Diviners",
              description:
                "Professional geophysical groundwater survey experts in Kankavli, Maharashtra. Specializing in borewell point marking, depth estimation, and aquifer detection.",
              url: "https://mmswaterdiviners.in",
              telephone: "+919370427023",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+919370427023",
                  contactType: "customer service",
                  areaServed: "IN",
                  availableLanguage: ["en", "hi", "mr"],
                },
                {
                  "@type": "ContactPoint",
                  telephone: "+919112427023",
                  contactType: "customer support",
                  areaServed: "IN",
                  availableLanguage: ["en", "hi", "mr"],
                },
              ],
              email: "dhananjays637@gmail.com",
              founder: {
                "@type": "Person",
                name: "Dhananjay Manohar Sawant",
                jobTitle: "Geophysical Water Survey Expert",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Near Rameshwar Mandir, Bivnewadi, Bhiravande",
                addressLocality: "Kankavli",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
                postalCode: "416609",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "16.5575",
                longitude: "73.7089",
              },
              areaServed: ["Kankavli","Sindhudurg","Malvan","Kudal","Sawantwadi","Vaibhavwadi","Devgad","Vengurla","Dodamarg","Maharashtra"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Groundwater Survey Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Groundwater Scanning",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Borewell Point Marking",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Depth Estimation",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Yield Prediction",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Geophysical Survey",
                    },
                  },
                ],
              },
              foundingDate: "2012",
              priceRange: "₹₹",
              image: "https://mmswaterdiviners.in/og-image.png",
              openingHoursSpecification: {
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
                opens: "00:00",
                closes: "23:59",
              },
              hasMap: "https://www.google.com/maps?cid=7520482754261218899",
              sameAs: [
                "https://wa.me/919370427023",
                "https://www.google.com/maps?cid=7520482754261218899",
              ],
            }),
          }}
        />
      </head>
      <body>
        <Grain />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
