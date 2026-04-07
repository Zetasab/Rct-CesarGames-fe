
import DetailedGame from "@/features/detailed-game/DetailedGame";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  return <DetailedGame gameSlug={slug} />;
}
