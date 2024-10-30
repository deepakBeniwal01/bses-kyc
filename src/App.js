import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResultsTable from "./components/ResultsTable";
import DetailView from "./components/DetailView/DetailView";
import { fetchAllResults } from "./api/apiService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";

const App = () => {
  const [results, setResults] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); // Total count of items
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const itemsPerPage = 10; // Number of items per page
  const API_BASE_URL = process.env.REACT_APP_API_BASE; // Base URL

  const fetchResults = async (
    url = `${API_BASE_URL}/feedback-applications/?page=1`,
    page = 1
  ) => {
    setLoading(true);
    const apiResults = await fetchAllResults(url);
    setResults(apiResults.results);
    setNext(apiResults.next);
    setPrevious(apiResults.previous);
    setCount(apiResults.count); // Set the total count of items
    setCurrentPage(page); // Update the current page
    setLoading(false);
  };

  useEffect(() => {
    fetchResults(); // Initial data fetch
  }, []);

  // Calculate total pages based on the count and items per page
  const totalPages = Math.ceil(count / itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate the range of page numbers to display
  const getPaginationButtons = () => {
    const buttons = [];
    const start = Math.max(1, currentPage - 2); // Start at current page - 2
    const end = Math.min(totalPages, currentPage + 2); // End at current page + 2

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          className={`btn ${
            currentPage === i ? "btn-secondary" : "btn-outline-primary"
          } mx-1`}
          onClick={() =>
            fetchResults(`${API_BASE_URL}/feedback-applications/?page=${i}`, i)
          }
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>KYC Applications</h1>
                <p>Total Results: {count}</p>
                <ResultsTable results={results} />

                <div className="pagination-controls d-flex align-items-center mt-4">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => fetchResults(previous, currentPage - 1)}
                    disabled={!previous}
                  >
                    Previous
                  </button>

                  {/* Page number buttons */}
                  <div className="page-buttons mx-2">
                    {getPaginationButtons()}
                  </div>

                  <button
                    className="btn btn-primary ms-2"
                    onClick={() => fetchResults(next, currentPage + 1)}
                    disabled={!next}
                  >
                    Next
                  </button>
                </div>

                <span className="mx-3">
                  Page {currentPage} of {totalPages}
                </span>
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
