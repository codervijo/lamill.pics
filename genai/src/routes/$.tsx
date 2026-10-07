import { createFileRoute, notFound } from '@tanstack/react-router';
import { CategoryPage } from '@/components/pics/experience';
import { categories, pageHead } from '@/lib/pics';
export const Route = createFileRoute('/$')({
 loader: ({params}) => {const category=categories.find(c=>c.slug===params._splat);if(!category)throw notFound();return category;},
 head: ({loaderData}) => loaderData ? pageHead(loaderData.name,loaderData.intro,`/${loaderData.slug}`) : pageHead('Picture not found','Find a little something lovely on LaMill Pics.'),
 component: Page,
});
function Page(){const category=Route.useLoaderData();return <CategoryPage category={category}/>}
