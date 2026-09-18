import { NextRequest, NextResponse } from "next/server";
import {
  fetchBookingSnapshot,
  getBookableRate,
  normalizeBookingAddOns,
  type BookingAddOnInput,
} from "@/lib/booking-engine";

const API_BASE = "https://hbe-api.seekda.com";
const CHANNEL_ID = "ibe";
const PROPERTY_CODE = "S005948";
const BOOKING_PROXY_PATH = "/api/book-proxy/property/S005948/checkout/";

type CheckoutInput = {
  room: string;
  rate: string;
  arrival: string;
  departure: string;
  adults: number;
  addOns: BookingAddOnInput[];
  guest: Record<string, string>;
};

function readInput(req: NextRequest): CheckoutInput {
  const sp = req.nextUrl.searchParams;
  const services = sp.getAll("skd-preselected-services").flatMap((value) => value.split(","));
  const guest: Record<string, string> = {};
  for (const key of ["title", "firstName", "lastName", "phoneNumber", "email", "country", "address", "zipCode", "city", "company"]) {
    const value = sp.get(key)?.trim();
    if (value) guest[key] = value;
  }
  return {
    room: (sp.get("room") || "").toUpperCase(),
    rate: sp.get("rate") || "",
    arrival: sp.get("arrival") || "",
    departure: sp.get("departure") || "",
    adults: Math.max(1, Number.parseInt(sp.get("adults") || "2", 10) || 2),
    addOns: services.filter(Boolean).map((code) => ({ code, quantity: 1 })),
    guest,
  };
}

function userContext(req: NextRequest) {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";
  return { language: "en", ipAddress, userAgent: req.headers.get("user-agent") || "Mozilla/5.0" };
}

async function providerPost(path: string, body: unknown) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Provider ${path} returned HTTP ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

function checkoutUrl(input: CheckoutInput, cartId: string) {
  const url = new URL(BOOKING_PROXY_PATH, "https://andreashotel.com");
  for (const [key, value] of Object.entries({
    channelId: CHANNEL_ID,
    propertyCode: PROPERTY_CODE,
    checkin: input.arrival,
    checkout: input.departure,
    adult_room1: String(input.adults),
    language: "en",
    currencyCode: "USD",
    cartId,
  })) {
    url.searchParams.set(key, value);
  }
  return `${url.pathname}?${url.searchParams.toString()}`;
}

export async function GET(req: NextRequest) {
  const input = readInput(req);
  if (!input.room || !input.rate || !input.arrival || !input.departure) {
    return new NextResponse("Room, rate, arrival, and departure are required.", { status: 400 });
  }

  try {
    const snapshot = await fetchBookingSnapshot({
      arrival: input.arrival,
      departure: input.departure,
      adults: input.adults,
    });
    const room = snapshot.roomOffers.find((candidate) => candidate.code === input.room);
    const rate = room?.rates?.find((candidate) => candidate.code === input.rate) || (room ? getBookableRate(room) : null);
    if (!room || !rate || rate.code !== input.rate) {
      return new NextResponse("The selected room and rate are no longer available.", { status: 409 });
    }

    const cart = await providerPost(
      `/channels/${CHANNEL_ID}/property/${PROPERTY_CODE}/shopping-cart/offers`,
      {
        roomCode: room.code,
        rateCode: rate.code,
        guid: null,
        bedOption: null,
        checkIn: input.arrival,
        checkOut: input.departure,
        currencyCode: "USD",
        occupancy: { adults: input.adults, children: [] },
        user: userContext(req),
        price: rate.shoppingCartPrice ?? rate.total ?? rate.price,
        priceCalcMode: "withInformativeTaxesAndFees",
        promotionCode: "",
        voucherCode: "",
        returnUrlTemplate: "https://andreashotel.com/payment",
      },
    );

    const normalized = normalizeBookingAddOns(input.addOns);
    for (const addOn of normalized) {
      await providerPost(
        `/channels/${CHANNEL_ID}/property/${PROPERTY_CODE}/shopping-cart/${cart.guid}/special-offers`,
        {
          price: addOn.price,
          quantity: addOn.quantity,
          specialOffersCode: addOn.code,
          checkIn: input.arrival,
          checkOut: input.departure,
          promotionCode: "",
          user: userContext(req),
          currencyCode: "USD",
          priceCalcMode: "withInformativeTaxesAndFees",
        },
      );
    }

    const destination = checkoutUrl(input, cart.guid);
    const response = new NextResponse(
      `<!doctype html><html><head><meta charset="utf-8"><title>Preparing checkout</title></head><body><p>Preparing your checkout...</p><script>
        document.cookie = ${JSON.stringify(`shoppingCartGuid=${cart.guid}; Path=/; Max-Age=1800; Secure; SameSite=Lax`)};
        window.location.replace(${JSON.stringify(destination)});
      </script></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, max-age=0" } },
    );
    response.cookies.set("shoppingCartGuid", cart.guid, {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 1800,
    });
    if (Object.keys(input.guest).length) {
      response.cookies.set("bookingGuestPrefill", encodeURIComponent(JSON.stringify(input.guest)), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 1800,
      });
    }
    return response;
  } catch (error) {
    console.error("Booking checkout bootstrap failed:", error);
    return new NextResponse("The checkout could not be prepared. Please try again.", { status: 502 });
  }
}
