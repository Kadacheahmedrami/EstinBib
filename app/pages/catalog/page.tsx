import Title from '@/components/Title';
import ParentComponent from '@/components/FilterETSearch';
import { Book } from '@/types/_types';
import { getBooks } from '@/app/actions/books';

// Catalog component expects the books prop to be an array of Book objects
interface CatalogProps {
  books: Book[]; // Expect an array of books
}

export default async function Catalog() {
  const books = await getBooks();
  return (
    <>
      <Title
        mainTitle="Library's Catalogue"
        subTitle="Welcome to Biblio Estin, the online platform of ESTIN's Higher School of Computer Science Library Here"
      />
      <div
        className="absolute bg-red-400 z-[-1] h-[450px] w-full"
        style={{
          backgroundImage: `url('/jpg/hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      <ParentComponent books={books} />
    </>
  );
}
