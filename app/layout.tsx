// import type { Metadata } from "next"
// import "./globals.css"
// import { Layout } from '@/components/Layout'
// import { SpeedInsights } from "@vercel/speed-insights/next"
// import { Analytics } from "@vercel/analytics/react"
// import Head from "next/head"  // Importing Head component

// export const metadata: Metadata = {
//   title: "Career Check",
//   description: "IGDTUW Placement Statistics Portal",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-gray-950 text-gray-50">
//         {/* Vercel Speed Insights for performance tracking */}
//         <SpeedInsights />

//         {/* Vercel Analytics for visitor and page view tracking */}
//         <Analytics />

//         {/* Umami Analytics Script */}
//         <Head>
//           <script
//             defer
//             src="https://cloud.umami.is/script.js"
//             data-website-id="421bbba5-4333-449c-ad3e-832797c213dc"
//           ></script>
//         </Head>

//         {/* Wrap children with your Layout component */}
//         <Layout>{children}</Layout>
//       </body>
//     </html>
//   )
// }


// import type { Metadata } from "next"
// import "./globals.css"
// import { Layout } from '@/components/Layout'
// import { SpeedInsights } from "@vercel/speed-insights/next"
// import { Analytics } from "@vercel/analytics/react"
// import Head from "next/head"  // Importing Head component

// export const metadata: Metadata = {
//   title: "Career Check",
//   description: "IGDTUW Placement Statistics Portal",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-gray-950 text-gray-50">
//         {/* Vercel Speed Insights for performance tracking */}
//         <SpeedInsights />

//         {/* Vercel Analytics for visitor and page view tracking */}
//         <Analytics />

//         {/* Umami Analytics Script */}
//         <Head>
//           <script
//             defer
//             src="https://cloud.umami.is/script.js"
//             data-website-id="421bbba5-4333-449c-ad3e-832797c213dc"
//           ></script>

//           {/* Google Analytics Script */}
//           <script async src="https://www.googletagmanager.com/gtag/js?id=G-PGQXSBTGB1"></script>
//           <script>
//             {`
//               window.dataLayer = window.dataLayer || [];
//               function gtag(){dataLayer.push(arguments);}
//               gtag('js', new Date());
//               gtag('config', 'G-PGQXSBTGB1');
//             `}
//           </script>
//         </Head>

//         {/* Wrap children with your Layout component */}
//         <Layout>{children}</Layout>
//       </body>
//     </html>
//   )
// }


import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/Layout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Career Check",
  description: "IGDTUW Placement Statistics Portal",
  openGraph: {
    title: "Career Check",
    description: "IGDTUW Placement Statistics Portal",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Umami Analytics Script */}
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="421bbba5-4333-449c-ad3e-832797c213dc"
        ></script>

        {/* Google Analytics Script */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PGQXSBTGB1"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PGQXSBTGB1');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-50">
        {/* Vercel Speed Insights for performance tracking */}
        <SpeedInsights />

        {/* Vercel Analytics for visitor and page view tracking */}
        <Analytics />

        {/* Wrap children with your Layout component */}
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
