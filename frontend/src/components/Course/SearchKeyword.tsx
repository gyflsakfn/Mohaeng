import { useAppDispatch } from "@/src/hooks/useReduxHooks";

import React, { useState, KeyboardEvent } from "react";
import ResetButton from "@/src/components/UI/ResetButton";
import styles from "./SearchKeyword.module.css";
import { clearKeyword, setKeyword } from "@/src/store/reducers/FilterSlice";

const SearchKeyword = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (!e.target.value.trim()) {
      dispatch(clearKeyword());
      setIsSearched(false);
    }
  };

  const resetHandler = () => {
    setSearchValue("");
    dispatch(clearKeyword());
    setIsSearched(false);
  };

  const handleSearch = () => {
    dispatch(setKeyword(searchValue));
    !searchValue.trim() ? setIsSearched(false) : setIsSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const buttonClasses = `${styles["search-btn"]} ${
    isSearched ? styles.searched : ""
  }`;

  return (
    <>
      <div className={styles.keyword}>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className={buttonClasses} onClick={handleSearch}>
          검색
        </button>
        <ResetButton onClick={resetHandler} />
      </div>
    </>
  );
};

export default SearchKeyword;
