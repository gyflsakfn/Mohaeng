import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { setSort } from "@/src/store/reducers/FilterSlice";
import { setPage } from "@/src/store/reducers/pageSlice";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import styles from "./SelectSorting.module.css";

interface SortOption {
  value: string;
  name: string;
}

const sortOptions: SortOption[] = [
  { value: "", name: "최신순" },
  { value: "likeCount", name: "좋아요순" },
];

const SelectSorting = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { sort } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

  const selectedSortOption =
    sortOptions.find((option) => option.value === sort) || sortOptions[0];
  const selectedSortName = selectedSortOption.name;

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: any) => {
    dispatch(setSort(option.value));
    dispatch(setPage(1));

    setIsDropdownOpen(false);
  };

  return (
    <div className={styles["dropdown-wrapper"]}>
      <button className={styles["dropdown-label"]} onClick={handleDropdown}>
        {selectedSortName}
        <MdOutlineKeyboardArrowDown />
      </button>
      {isDropdownOpen && (
        <div className={styles["dropdown-content"]}>
          <ul>
            {sortOptions
              .filter((option) => option.name !== selectedSortName) // 현재 선택된 옵션을 제외한 리스트 필터링
              .map((option) => (
                <li
                  key={option.name}
                  className={styles["sort-item"]}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectSorting;
