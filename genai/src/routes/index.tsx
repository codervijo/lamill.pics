import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/components/pics/experience';
import { pageHead } from '@/lib/pics';
export const Route = createFileRoute('/')({
 validateSearch: (search: Record<string, unknown>): {create?: boolean} => ({create: search['create'] === true || search['create'] === 'true'}),
 head: () => pageHead('Turn any thought into a picture', 'Make and discover beautiful good morning wishes, WhatsApp DPs, birthday greetings and pictures in your language. Browse, personalize, download and share.'),
 component: Index,
});
function Index() { const {create} = Route.useSearch(); return <Home create={create ?? false}/>; }
