export const BOOKING_ENGINE_BASE = "https://s005948.officialbookings.com";
export const PROPERTY_CODE = "S005948";

export const ADD_ONS: Record<string, { title: string; price: number }> = {
  BOTTLE_OF1: { title: "Bottle of Sparkling Cider", price: 39 },
  ROLLAWAY_B: { title: "Rollaway Bed", price: 45 },
  "10CT_FOIL_": { title: "10ct Foil Wrapped Chocolates", price: 50 },
  "50_GIFT_CA": { title: "$50 Gift Card", price: 50 },
};

export type BookingAddOnInput = { code?: string; name?: string; label?: string; quantity?: number };
export type NormalizedBookingAddOn = BookingAddOnInput & { code: string; quantity: number; title: string; price: number };
export type GuestDetails = { firstName: string; lastName: string; email: string; phone?: string; address?: string; city?: string; state?: string; country?: string; postalCode?: string; company?: string; birthDate?: string };

export function normalizeBookingAddOns(items: BookingAddOnInput[] = []): NormalizedBookingAddOn[] {
  return items.map((item) => {
    const requested = String(item.code || item.name || item.label || "").trim();
    const aliases: Record<string, string> = {
      "BOTTLE OF SPARKLING CIDER": "BOTTLE_OF1",
      "ROLLAWAY BED": "ROLLAWAY_B",
      "10CT FOIL WRAPPED CHOCOLATES": "10CT_FOIL_",
      "$50 GIFT CARD": "50_GIFT_CA",
    };
    const code = (aliases[requested.toUpperCase()] || requested).toUpperCase();
    const addOn = ADD_ONS[code];
    const quantity = Number(item.quantity ?? 1);
    if (!addOn) throw new Error(`Unknown add-on code: ${item.code}`);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error(`Invalid quantity for add-on ${code}`);
    return { code, quantity, title: addOn.title, price: addOn.price };
  });
}

export function validateGuestDetails(guest: Partial<GuestDetails>): string[] {
  const errors: string[] = [];
  if (!String(guest.firstName || "").trim()) errors.push("firstName is required");
  if (!String(guest.lastName || "").trim()) errors.push("lastName is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(guest.email || "").trim())) errors.push("email must be valid");
  return errors;
}

export type BookingRate = {
  code: string;
  title?: string;
  price?: number;
  total?: number;
  quantity?: number;
};

export type BookingRoom = {
  code: string;
  metadata?: {
    title?: string;
    description?: string;
    specs?: { maxOccupancy?: number; size?: number; sizeUnit?: string; beds?: unknown[] };
    amenities?: Array<{ code?: string; name?: string }>;
    mainImage?: { url?: string };
  };
  rates?: BookingRate[];
};

export type BookingSnapshot = {
  roomOffers: BookingRoom[];
  roomCodesWithoutRates: string[];
  suggestedCheckIn?: string;
  suggestedCheckOut?: string;
};

export function buildBookingEngineUrl(args: {
  arrival: string;
  departure: string;
  adults: number | string;
  room?: string;
  rate?: string;
  addOns?: BookingAddOnInput[];
}) {
  const url = new URL("/", BOOKING_ENGINE_BASE);
  for (const [key, value] of Object.entries({
    channelId: "ibe",
    checkin: args.arrival,
    checkout: args.departure,
    totalRooms: "1",
    language: "en",
    currencyCode: "USD",
    propertyCode: PROPERTY_CODE,
    widgetId: "BOOKINGWIDGET",
    widgetSection: "searchbar",
    activeBookingEngine: "KBE",
    adult_room1: String(args.adults),
    priceType: "withInformativeTaxesAndFees",
    priceTimeBase: "stay",
    ...(args.room ? { offerRoom: args.room } : {}),
    ...(args.rate ? { offerRate: args.rate } : {}),
  })) url.searchParams.set(key, value);
  for (const addOn of normalizeBookingAddOns(args.addOns)) {
    for (let i = 0; i < addOn.quantity; i++) url.searchParams.append("skd-preselected-services", addOn.code);
  }
  return url;
}

export async function fetchBookingSnapshot(args: {
  arrival: string;
  departure: string;
  adults: number;
  signal?: AbortSignal;
}): Promise<BookingSnapshot> {
  const upstream = await fetch(buildBookingEngineUrl(args), {
    signal: args.signal,
    headers: { "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  if (!upstream.ok) throw new Error(`Booking engine returned HTTP ${upstream.status}`);
  const html = await upstream.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) throw new Error("Booking engine response did not contain booking state");
  const nextData = JSON.parse(match[1]);
  const data = nextData?.props?.initialState?.offers?.data;
  if (!data || !Array.isArray(data.roomOffers)) throw new Error("Booking engine response contained no room offers");
  const reasons = nextData?.props?.initialState?.offersOverview?.data?.noAvailableReasons ?? {};
  const suggestion = Object.values(reasons).find((r: any) => r?.suggestedCheckIn && r?.suggestedCheckOut) as any;
  return {
    roomOffers: data.roomOffers,
    roomCodesWithoutRates: Array.isArray(data.roomCodesWithoutRates) ? data.roomCodesWithoutRates : [],
    suggestedCheckIn: suggestion?.suggestedCheckIn,
    suggestedCheckOut: suggestion?.suggestedCheckOut,
  };
}

export function getBookableRate(room: BookingRoom) {
  return room.rates?.find((rate) => typeof rate.price === "number" || typeof rate.total === "number") ?? null;
}
