import type { Metadata } from "next";
import { FavouritesView } from "./FavouritesView";

export const metadata: Metadata = {
  title: "Favourites",
  robots: { index: false, follow: false },
};

export default function FavouritesPage() {
  return <FavouritesView />;
}
