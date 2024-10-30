import React, { useState } from "react";
import { useTable, useSortBy } from "react-table";
import { Link } from "react-router-dom";
import "../styles/ResultTable.css";

const ResultsTable = ({ results }) => {
  const [searchInput, setSearchInput] = useState("");

  const data = React.useMemo(() => {
    return results?.map((result) => ({
      application_id: result.application,
      updated_at: result.updated_at,
    }));
  }, [results]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Application ID",
        accessor: "application_id",
        Cell: ({ value }) => <Link to={`/detail/${value}`}>{value}</Link>,
      },
      {
        Header: "Updated At",
        accessor: "updated_at",
        Cell: ({ value }) => {
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(new Date(value));

          return <span>{formattedDate}</span>;
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  const filteredRows = rows.filter((row) => {
    return Object.values(row.original).some((value) =>
      String(value).toLowerCase().includes(searchInput.toLowerCase())
    );
  });

  // Check if `results` is empty and show a message if it is
  if (results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="mb-3 form-control"
      />
      <table {...getTableProps()} className="table table-striped table-head">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={column.id === "updated_at" ? "text-right" : ""}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {filteredRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className={
                      cell.column.id === "updated_at" ? "text-right" : ""
                    }
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
