import { observer } from "mobx-react-lite";
import type { ProductWithCategory } from "@/store/searchStore";
import { useSearchStore } from "../context/RootStoreContext";

interface Props {
  item: ProductWithCategory;
  isActive: boolean;
  index: number;
}

export const SearchResultItem = observer(({ item, isActive, index }: Props) => {
  const searchStore = useSearchStore();

  const category =
    typeof item.category === "object" && item.category !== null
      ? item.category
      : null;

  console.log("category", category);

  const handleClick = (): void => {
    if (!item.slug || !category?.slug) return;

    window.location.href = `/catalog/${category.slug}/${item.slug}`;

    searchStore.close();
  };

  return (
    <li
      onMouseEnter={() => searchStore.setActiveIndex(index)}
      onClick={handleClick}
      className={`
        grid grid-cols-[1fr_auto] gap-2 px-3 py-2 rounded-lg cursor-pointer
        transition-colors duration-150
        ${
          isActive
            ? "bg-blue-100 dark:bg-primary-900/40"
            : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
        }
      `}
    >
      <span className="text-black break-words min-w-0">{item.name}</span>

      {category?.name && (
        <span className="text-black text-right break-words">
          {category.name}
        </span>
      )}
    </li>
  );
});
