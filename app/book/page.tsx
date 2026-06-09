export const metadata = {
  title: "Book a Room – The Andreas Hotel & Spa",
  description:
    "Secure your stay at The Andreas Hotel & Spa. Book directly through our reservation system.",
};

export default function BookPage() {
  return (
    <iframe
      src="/api/book-proxy"
      className="fixed inset-0 w-full h-full border-0"
      title="Book a room at The Andreas Hotel & Spa"
    />
  );
}
