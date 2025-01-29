
import HeroLanding from '@/components/HeroLanding';
import RelatedBooks from '@/components/RelatedBooks';

export default function Home() {
  return (
    <main>
      <HeroLanding />
      <h2 className='ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]'>What s new ?</h2>
      <RelatedBooks containerId="book-container-1" />  {/* Unique ID for first carousel */}
      <h2 className='ml-[4%] my-4 text-[50px] font-bold text-[#F1413E]'>Most Borrowed</h2>
      <RelatedBooks containerId="book-container-2" />  {/* Unique ID for second carousel */}
    </main>
  );
}
