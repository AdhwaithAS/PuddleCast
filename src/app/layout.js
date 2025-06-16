import { Montserrat } from "next/font/google";
import "./globals.css";
import AddBootstrap from "./AddBootstrap.js";
import "bootstrap/dist/css/bootstrap.min.css";

const montserrat = Montserrat({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>PuddleCast – Live Local Weather & Forecasts</title>
        <meta
          name="title"
          content="PuddleCast – Live Local Weather & Forecasts"
        />
        <meta
          name="description"
          content="Get real-time weather updates, accurate forecasts, and clean visuals with PuddleCast. Fast, privacy-friendly, and beautifully simple."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="weather, forecast, rain, local weather, PuddleCast, live weather, weather app, current temperature, hourly forecast, nextjs weather app"
        />
        <meta name="author" content="Adhwaith AS" />
        <meta name="robots" content="index, follow" />
        <meta charSet="UTF-8" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://puddlecast.vercel.app/" />
        <meta
          property="og:title"
          content="PuddleCast – Live Local Weather & Forecasts"
        />
        <meta
          property="og:description"
          content="Get real-time weather updates, accurate forecasts, and clean visuals with PuddleCast."
        />
        <meta
          property="og:image"
          content="https://puddlecast.vercel.app/logo.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://puddlecast.vercel.app/" />
        <meta
          property="twitter:title"
          content="PuddleCast – Live Local Weather & Forecasts"
        />
        <meta
          property="twitter:description"
          content="Get real-time weather updates, accurate forecasts, and clean visuals with PuddleCast."
        />
        <meta
          property="twitter:image"
          content="https://puddlecast.vercel.app/logo.png"
        />

        <link rel="icon" href="/logo.png" type="image/png" />
      </head>

      <body
        className={`${montserrat.variable}`}
        style={{ fontFamily: "montserrat" }}
      >
        <AddBootstrap />
        {children}
      </body>
    </html>
  );
}
