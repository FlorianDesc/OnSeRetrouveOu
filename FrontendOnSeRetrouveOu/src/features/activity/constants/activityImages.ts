import cuisineImg from "@/assets/atelier-cuisine.jpg";
import defaultImg from "@/assets/default-picture.jpg";
import randoImg from "@/assets/rando.jpg";
import padelImg from "@/assets/tournois-padel.webp";
import yogaImg from "@/assets/yoga.webp";

export const activityImages: Record<number, string> = {
  1: randoImg,
  2: cuisineImg,
  3: yogaImg,
  4: padelImg,
};

// Pour les activités 5 à 52, utiliser l'image par défaut
for (let i = 5; i <= 52; i++) {
  activityImages[i] = defaultImg;
}
