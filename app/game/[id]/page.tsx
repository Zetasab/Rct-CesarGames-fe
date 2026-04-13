
import rawgSnapshot from '../../../test.json';
import { genresCatalog, platformsCatalog, storesCatalog, tagsCatalog } from '@/app/static/catalog-data';
import DetailedGame from "@/features/detailed-game/DetailedGame";

type SnapshotGame = { slug?: string };
type SnapshotData = { results?: SnapshotGame[] };

export function generateStaticParams(): Array<{ id: string }> {
  const slugSet = new Set<string>();

  const collect = (slug: unknown) => {
    if (typeof slug !== 'string') {
      return;
    }

    const normalized = slug.trim();
    if (!normalized) {
      return;
    }

    slugSet.add(normalized);
  };

  genresCatalog.forEach((item) => item.games.forEach((game) => collect(game.slug)));
  platformsCatalog.forEach((item) => item.games.forEach((game) => collect(game.slug)));
  tagsCatalog.forEach((item) => item.games.forEach((game) => collect(game.slug)));
  storesCatalog.forEach((item) => item.games.forEach((game) => collect(game.slug)));

  const snapshot = rawgSnapshot as SnapshotData;
  snapshot.results?.forEach((game) => collect(game.slug));

  // Keep this slug available to avoid export errors for direct access from shared links.
  collect('mouse-3');

  return Array.from(slugSet).map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  return <DetailedGame gameSlug={slug} />;
}
