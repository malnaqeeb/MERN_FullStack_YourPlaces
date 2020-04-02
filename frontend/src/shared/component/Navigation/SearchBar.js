import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = props => {
  const [searchValue, setSearchValue] = useState("");
  const history = useHistory();

  const submitHandler = e => {
    e.preventDefault();
    if (searchValue.length > 0) {
      history.push(`/search?q=${searchValue}`);
    }
  };

  return (
    <form className='search-bar__form' onSubmit={submitHandler}>
      <input
        className='search-bar__text'
        type='text'
        name='search'
        placeholder='Search...'
        value={searchValue}
        onChange={e => {
          setSearchValue(e.target.value);
        }}
      />
      <button className='search-bar__submit' type='submit'>
        <i className='fas fa-search'></i>
      </button>
    </form>
  );
};

export default SearchBar;
