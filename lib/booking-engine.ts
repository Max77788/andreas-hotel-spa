export const BOOKING_ENGINE_BASE = "https://s005948.officialbookings.com";
export const PROPERTY_CODE = "S005948";

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
