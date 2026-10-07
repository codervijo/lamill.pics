import { createFileRoute } from '@tanstack/react-router';
import { CategoryPage } from '@/components/pics/experience';
import { categories, pageHead } from '@/lib/pics';
export const Route = createFileRoute('/good-morning-images')({
 head: () => ({...pageHead('Good Morning Images', 'Original good morning images, floral wishes and beautiful sunrise greetings in English, Malayalam and Hindi. Download, share or make your own.', '/good-morning-images'),scripts:[{type:'application/ld+json',children:JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'Good Morning Images',description:'Original morning wishes to download, share and personalize.',inLanguage:['en','ml','hi']})}]}),
 component: () => <CategoryPage category={categories[0]}/>,
});
