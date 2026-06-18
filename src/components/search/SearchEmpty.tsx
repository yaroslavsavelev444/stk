// components/search/SearchEmpty.tsx
import { observer } from 'mobx-react-lite';
import { useSearchStore } from '../context/RootStoreContext';

export const SearchEmpty = observer(() => {
  const searchStore = useSearchStore();
  const { query, loading, categories, products } = searchStore;

  if (loading) return null;
  if (categories.length > 0 || products.length > 0) return null;

  return (
    <div className="py-8 text-center text-gray-500">
      {query.trim() ? (
        <>
          <p className="text-lg">Ничего не найдено</p>
          <p className="text-sm">Попробуйте изменить запрос</p>
        </>
      ) : (
        <>
         
        </>
      )}
    </div>
  );
});