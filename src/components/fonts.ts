import { Agbalumo } from "next/font/google";
import localFont from "next/font/local";

export const agbalumo = Agbalumo({
  subsets: ["vietnamese"],
  variable: "--font-agbalumo",
  weight: ["400"],
  display: "swap",
  adjustFontFallback: false,
});

export const noto = localFont({
  src: "../fonts/NotoSansJP.ttf",
  variable: "--font-noto",
  display: "swap",
  adjustFontFallback: false,
});
