import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResultsTable from "./components/ResultsTable";
import DetailView from "./components/DetailView/DetailView";
import { fetchAllResults } from "./api/apiService"; // Importing the API function
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [results, setResults] = useState([]); // Stores the list of results
  const [next, setNext] = useState(null); // URL for the next page
  const [previous, setPrevious] = useState(null); // URL for the previous page
  const [loading, setLoading] = useState(true); // For handling the loading state

  const fetchResults = async (url = null) => {
    // Fetch data from API with pagination support
    const apiResults = await fetchAllResults(url); // Pass the URL for fetching next/previous page
    console.log("API results:", apiResults);

    setResults(apiResults.results); // Set the fetched results array
    setNext(apiResults.next); // Set the next page URL
    setPrevious(apiResults.previous); // Set the previous page URL
    setLoading(false); // Stop loading after data is fetched
  };

  useEffect(() => {
    // Initially fetch the first page of results
    fetchResults();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>KYC Applications</h1>
                <ResultsTable results={results} />{" "}
                {/* Passing API results to the table */}
                <div className="pagination-buttons mt-4">
                  {/* Disable the "Previous" button if there's no previous page */}
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => fetchResults(previous)}
                    disabled={!previous}
                  >
                    Previous
                  </button>
                  {/* Disable the "Next" button if there's no next page */}
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchResults(next)}
                    disabled={!next}
                  >
                    Next
                  </button>
                </div>
              </>
            }
          />
          <Route path="/detail/:id" element={<DetailView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
