import React, { useEffect, useState } from "react";
import "./Search.css";

import useHttpClient from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import ResultsList from "../components/ResultsList";

export default function Search() {
  const [results, setResults] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  let query = new URL(window.location).searchParams.get("q");

  useEffect(() => {
    const getResults = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/search?q=${query}`
        );

        setResults(data.results);
      } catch (error) {
        console.error(error);
      }
    };
    getResults();
  }, [query]);

  return (
    <div className='search__page'>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && results && <ResultsList items={results} />}
    </div>
  );
}
