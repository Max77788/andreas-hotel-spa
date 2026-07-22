import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata = {
  title: "Poolside Menu - The Andreas Hotel & Spa",
  description:
    "Browse drinks, signature cocktails, and food available poolside at The Andreas Hotel & Spa in Palm Springs.",
};

type MenuItem = {
  name: string;
  price?: string;
  description?: string;
  note?: string;
};

const mixedDrinks: MenuItem[] = [
  { name: "Gin & Tonic" },
  { name: "Greyhound" },
  { name: "Rum & Coke" },
  { name: "Salty Dog" },
  { name: "Screwdriver" },
  { name: "Vodka Cran" },
  { name: "Vodka Pineapple" },
];

const wineByGlass: MenuItem[] = [
  { name: "Cabernet Sauvignon" },
  { name: "Champagne" },
  { name: "Chardonnay" },
  { name: "Lemoncello" },
  { name: "Merlot" },
  { name: "Pinot Grigio" },
  { name: "Pinot Noir" },
  { name: "Zinfandel" },
];

const beer: MenuItem[] = [
  { name: "Bud Light", price: "$8" },
  { name: "Budweiser", price: "$8" },
  { name: "Coors Light", price: "$8" },
  { name: "Corona", price: "$9" },
  { name: "Michelob Ultra", price: "$9" },
  { name: "Stella", price: "$9" },
  { name: "Truly", price: "$7" },
  { name: "O'Doul's", price: "$6" },
];

const nonAlcoholic: MenuItem[] = [
  { name: "Frozen Lemonade", price: "$7.25" },
  { name: "Iced Caramel Coffee", price: "$7.25" },
  { name: "Iced Mocha Coffee", price: "$7.25" },
  { name: "Bottled Water", price: "$3" },
  { name: "7UP - Regular / Diet", price: "$3" },
  { name: "Coke - Regular / Diet", price: "$3" },
];

const specialtyCocktails: MenuItem[] = [
  {
    name: "Mai Tai",
    price: "$17",
    description: "Rum, pineapple juice, orange juice, splash of grenadine, garnished with a cherry.",
  },
  {
    name: "Pina Colada",
    price: "$17",
    description: "Rum, cream of coconut, pineapple juice, garnished with a pineapple slice and cherry.",
  },
  {
    name: "Bloody Mary",
    price: "$17",
    description: "Vodka, bloody mary mix, spices to your liking, garnished with a lime wedge.",
  },
  {
    name: "Andreas Signature Martinis",
    price: "$17",
    description: "Pomegranate, apple, peach, watermelon, lemon drop, and cosmopolitan.",
  },
  {
    name: "Long Island Iced Tea",
    price: "$17",
    description: "Vodka, gin, rum, tequila, triple sec, sweet & sour, Coke, garnished with a lemon wedge.",
  },
  {
    name: "Margarita",
    price: "$17",
    description: "Blended or on the rocks. Tequila, fresh lime juice, sweet & sour, garnished with a lime wedge.",
    note: "Upgrade to Cadillac Margarita - $20",
  },
  {
    name: "Italian Margarita",
    price: "$17",
    description: "Blended or on the rocks. Amaretto, sweet & sour, tequila, triple sec, sugared rim.",
  },
  {
    name: "Mojito",
    price: "$17",
    description: "Lime juice, simple syrup, rum or gin, and fresh mint.",
  },
  {
    name: "Raspberry Italian Mojito",
    price: "$17",
    description:
      "Raspberries, fresh mint, simple syrup, sweetened lime juice, prosecco, 7UP, garnished with raspberries and mint.",
  },
  {
    name: "Italian Mojito",
    price: "$17",
    description:
      "Mojito mix, fresh mint, sweetened lime juice, rum, topped with prosecco, garnished with a lime wedge and mint.",
  },
  {
    name: "Strawberry Daiquiri",
    price: "$17",
    description: "Rum, strawberry mix, and pineapple juice.",
  },
  {
    name: "Tequila Sunrise",
    price: "$17",
    description: "Tequila, triple sec, orange juice, grenadine, garnished with a cherry and orange slice.",
  },
  {
    name: "Bailey's & Coffee",
    price: "$17",
    description: "Bailey's Irish Cream and coffee, hot or iced, prepared to your liking.",
  },
  {
    name: "Andreas Signature Sangria",
    price: "$17",
    description: "White or red.",
  },
];

const food: MenuItem[] = [
  { name: "Italian Pesto Pinwheel", price: "$18" },
  { name: "Italian Spicy Platter with Pita Bread", price: "$20" },
  { name: "Chips & Dip", price: "$15" },
  { name: "Bean Dip with Chips & Salsa", price: "$16" },
  { name: "Chips & Guacamole", price: "$18" },
  { name: "Spinach & Artichoke Dip with Chips", price: "$18" },
  {
    name: "Beef or Chicken Taquitos",
    price: "$15",
    description: "Four taquitos with chips and fresh guacamole.",
  },
  {
    name: "White Castle Cheeseburger Sliders",
    price: "$15",
    description: "Three sliders served with chips.",
  },
  {
    name: "Ramona's Beef & Bean Burrito",
    price: "$15",
    description: "Served with chips and salsa.",
  },
  {
    name: "Hot Dog Combo",
    price: "$13",
    description: "Hot dog with chips and soda.",
  },
  { name: "Bag of Chips (Assorted Flavors)", price: "$4" },
  { name: "Side of Guacamole", price: "$10" },
  { name: "Bag of Buttered Popcorn", price: "$4" },
  { name: "Bag of Cheez-It Crackers", price: "$3.50" },
  { name: "Famous Amos Chocolate Chip Cookies", price: "$3.50" },
  { name: "Assorted Candy Bars", price: "$3.50" },
  { name: "Assorted Soda", price: "$3" },
  { name: "Iced Tea", price: "$3" },
  { name: "Bottled Water", price: "$3" },
];

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <div className="border-b border-[var(--hotel-sand)] pb-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-1">
        <h4 className="font-display text-[var(--hotel-charcoal)] text-lg font-light">{item.name}</h4>
        {item.price && (
          <span className="font-body text-[var(--hotel-gold)] text-sm whitespace-nowrap">{item.price}</span>
        )}
      </div>
      {item.description && (
        <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">{item.description}</p>
      )}
      {item.note && (
        <p className="font-body text-[var(--hotel-terracotta)] text-xs tracking-wide mt-1">{item.note}</p>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-terracotta)] mb-8 text-center">
      {children}
    </h3>
  );
}

export default function PoolsideMenuPage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      <section
        className="relative min-h-[520px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hotel-photos/pool-night.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-3xl px-6 pt-24 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
            Sip · Savor · Unwind
          </p>
          <h1 className="font-display text-white text-5xl md:text-7xl font-light tracking-wide">
            Poolside Menu
          </h1>
          <p className="font-body text-white/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto mt-6">
            Refreshing drinks, specialty cocktails, and light bites served beside our courtyard pool.
          </p>
          <div className="mt-8">
            <a
              href="/andreas-poolside-menu.pdf"
              download
              className="inline-block border border-[var(--hotel-gold)] text-white font-body text-[10px] tracking-[0.25em] uppercase px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-black transition-colors"
            >
              Download Menu PDF
            </a>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[var(--hotel-sand)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-3">
              Food & Drinks
            </p>
            <h2 className="font-display text-[var(--hotel-charcoal)] text-4xl md:text-5xl font-light tracking-wide">
              Available Poolside
            </h2>
            <p className="font-body text-[var(--hotel-charcoal)]/70 text-sm max-w-2xl mx-auto mt-5 leading-relaxed">
              Dial extension <span className="text-[var(--hotel-charcoal)]">0</span> or{" "}
              <span className="text-[var(--hotel-charcoal)]">305</span> to place your order. Please allow 30 minutes.
              Bar orders taken from 12:00 PM - 4:30 PM only.
            </p>
          </div>

          <div className="mb-16">
            <SectionHeading>Mixed Drinks</SectionHeading>
            <p className="font-body text-[var(--hotel-gold)] text-sm text-center mb-8">
              Small - $8.50 · Large - $15
            </p>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {mixedDrinks.map((item) => (
                <MenuRow key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div className="mb-16">
            <SectionHeading>Wine by the Glass</SectionHeading>
            <p className="font-body text-[var(--hotel-gold)] text-sm text-center mb-8">$12 per glass</p>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {wineByGlass.map((item) => (
                <MenuRow key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div className="mb-16">
            <SectionHeading>Beer & Hard Seltzer</SectionHeading>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {beer.map((item) => (
                <MenuRow key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div className="mb-16">
            <SectionHeading>Non-Alcoholic</SectionHeading>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {nonAlcoholic.map((item) => (
                <MenuRow key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div className="mb-16">
            <SectionHeading>Specialty Cocktails</SectionHeading>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {specialtyCocktails.map((item) => (
                <MenuRow key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>Poolside Bites</SectionHeading>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {food.map((item) => (
                <MenuRow key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/andreas-poolside-menu.pdf"
              download
              className="inline-block border border-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.25em] uppercase px-8 py-3 hover:bg-[var(--hotel-gold)] transition-colors"
            >
              Download Menu PDF
            </a>
            <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs text-center max-w-md leading-relaxed">
              Menu selections and pricing are subject to availability. Ask our front desk team for current service hours.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--hotel-forest)] py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-4">
            Adults-Only Boutique Retreat
          </p>
          <h2 className="font-display text-white text-3xl md:text-4xl font-light mb-7">
            Your Poolside Escape Awaits
          </h2>
          <Link
            href="/book"
            className="inline-block bg-[var(--hotel-gold)] text-black font-body text-[10px] tracking-[0.3em] uppercase px-9 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors"
          >
            Reserve Your Stay
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
