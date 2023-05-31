import styles from "./SearchBar.module.css";
import { BsSearch } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { setKeyword } from "@/src/store/reducers/FilterSlice";

export default function SearchBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchValue) {
      dispatch(setKeyword(searchValue));
      router.push(
        {
          pathname: `/search`,
          query: {
            keyword: searchValue,
          },
        },
        `/search?keyword=${searchValue}`
      );
      setSearchValue("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClearInput = () => {
    setSearchValue("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles["search-bar"]}>
        <button className={styles["search-icon"]}>
          <BsSearch />
        </button>
        <input
          onChange={handleInputChange}
          className={styles["search-input"]}
          type="text"
          placeholder="어디 가고 싶으세요?"
          value={searchValue}
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClearInput}
            className={styles["clear-icon"]}
          >
            <IoMdClose />
          </button>
        )}
      </form>
    </>
  );
}
