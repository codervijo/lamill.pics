import { createFileRoute, notFound } from '@tanstack/react-router';
import { allPictures } from '@/lib/gallery-data';
import { Artwork } from '@/components/pics/experience';

// Internal render surface used to bake gallery artwork into real image files.
export const Route = createFileRoute('/render/$id')({
  loader: ({ params }) => {
    const picture = allPictures.find(p => p.id === params.id);
    if (!picture) throw notFound();
    return picture;
  },
  head: () => ({ meta: [{ title: 'Render — LaMill Pics' }, { name: 'robots', content: 'noindex' }] }),
  component: RenderPicture,
});

function RenderPicture() {
  const picture = Route.useLoaderData();
  return (
    <div className="render-stage">
      <Artwork picture={picture} priority />
    </div>
  );
}
