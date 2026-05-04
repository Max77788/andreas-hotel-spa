import ComingSoon from "@/components/coming-soon";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const roomNames: Record<string, string> = {
    "andreas-villa-suite": "Andreas Villa Suite",
    "mobility-accessible-suite": "Mobility Accessible 2 Bed Suite",
    "mobility-accessible-deluxe-room": "Mobility Accessible Deluxe Room",
    "2-bed-1-bath-suite": "2 Bed 1 Bath Suite",
    "1-bedroom-suite": "1 Bedroom Suite",
    "executive-room": "Executive Room",
    "deluxe-room": "Deluxe Room",
  };

  const roomName = roomNames[slug] || "Room Details";

  return (
    <ComingSoon
      title={roomName}
      subtitle="Accommodations"
      description="This room's detail page is being redesigned. To book this room or learn more about it, please contact us or book online."
    />
  );
}
