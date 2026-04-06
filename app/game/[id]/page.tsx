
import DetailedGame from "@/features/detailed-game/DetailedGame";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DetailedGame gameId={id} />;
}
