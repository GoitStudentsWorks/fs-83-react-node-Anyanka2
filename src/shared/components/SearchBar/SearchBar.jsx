import { useState } from "react";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import {
  SearchButton,
  SearchForm,
  SearchLabel,
  SearchInput,
  SearchIconStyle,
  CloseIconStyle,
} from "./SearchBar.styled";
import PropTypes from "prop-types";

export const SearchBar = (props) => {
  const [value, setValue] = useState("");

  const onSubmit = (value) => {
    setValue(value);
    doSearch();
  };

  const handleValueChange = (event) => {
    setValue(event.currentTarget.value);
  };

  const doSearch = () => {
    props.onSubmit(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    onSubmit(value);
  };
  return (
    <SearchForm onSubmit={handleSubmit}>
      <SearchLabel>
        <SearchInput
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search"
          onChange={handleValueChange}
          value={value}
        ></SearchInput>
        <SearchButton type="submit">
          <SearchIconStyle>
            <SearchIcon />
          </SearchIconStyle>
        </SearchButton>
        {value.length > 0 && (
          <SearchButton onClick={() => onSubmit('')}>
            <CloseIconStyle>
              <CloseIcon />
            </CloseIconStyle>
          </SearchButton>
        )}
      </SearchLabel>
    </SearchForm>
  );
};

SearchBar.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};
