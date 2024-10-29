// src/components/DetailView/DataTable.jsx
import React, { useState } from "react";
import { useTable } from "react-table";
import "../../styles/DataTable.css";
import Modal from "react-modal"; // Importing React Modal
import { fetchDocumentWithToken } from "../../api/apiService";

const DataTable = ({ fullDetails, feedback }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageClick = async (snapHash) => {
    
    if (snapHash) {
      setLoading(true);
      setModalOpen(true);
      // Fetch document with token using the snap_hash as documentID
      const documentResponse = await fetchDocumentWithToken(snapHash); // Pass snap_hash as documentID

      console.log(documentResponse , "documentResponse");

      if (documentResponse) {
        
        // Create a URL for the image blob
        const imageUrl = URL.createObjectURL(documentResponse);
        setCurrentImageSrc(imageUrl); // Store the document image URL
        setLoading(false);
      } else {
        setCurrentImageSrc("");
        console.error("No document response received");
        setModalOpen(false);
        setLoading(false);
      }
    } else {
      console.error("No snap_hash found in applied_address_matching");
      alert("No Snap Hash found in applied_address_matching");
      setModalOpen(false);
      setLoading(false);
    }
  };

  const data = React.useMemo(() => {
    // Combine fullDetails with feedback for display
    return [
      {
        field: "Application ID",
        result: fullDetails.application_id ?? "N/A",
        feedback: feedback.application || "N/A",
      },
      {
        field: "Processing Status",
        result: fullDetails.processing_status ?? "N/A",
        feedback: feedback.ownership_document_field_check
          ? "Correct"
          : "Incorrect",
      },
      {
        field: "Document Type",
        result: fullDetails.document_type ?? "N/A",
        feedback: feedback.document_type_feedback
          ? "Correct"
          : `Incorrect, Remark: ${feedback.document_type_remarks || "N/A"}`,
      },
      {
        field: "Document Date",
        result: fullDetails.document_date ?? "N/A",
        feedback: feedback.document_date_feedback
          ? "Correct"
          : `Incorrect, Correct Date: ${
              feedback.corrected_document_date || "N/A"
            }`,
      },
      {
        field: "Witness Page Number",
        result: fullDetails.witness_page_num ?? "N/A",
        feedback: feedback.witness_page_feedback
          ? feedback.corrected_witness_page_number
            ? `Corrected to: ${feedback.corrected_witness_page_number}`
            : "Correct"
          : "Incorrect",
      },
      {
        field: "Applied Name",
        result: fullDetails.applied_name ?? "N/A",
        feedback:
          feedback.extracted_name_feedback === false
            ? `Incorrect, Remark: ${feedback.extracted_name_remarks || "N/A"}`
            : "Correct",
      },
      {
        field: "Person Name",
        result: fullDetails.person_name ?? "N/A",
        feedback: null,
      },
      {
        field: "Relationship",
        result: fullDetails.relationship ?? "N/A",
        feedback:
          feedback.relationship_feedback === false
            ? `Incorrect, Remark: ${feedback.relationship_remarks || "N/A"}`
            : "Correct",
      },
      {
        field: "Is Valid",
        result:
          fullDetails.is_valid !== null
            ? fullDetails.is_valid
              ? "Yes"
              : "No"
            : "N/A",
        feedback: null, // Add specific feedback if necessary
      },
      {
        field: "Is Registered",
        result:
          fullDetails.is_registered !== null
            ? fullDetails.is_registered
              ? "Yes"
              : "No"
            : "N/A",
        feedback: feedback.document_registry_feedback
          ? "Correct"
          : `Incorrect, Remark: ${feedback.document_registry_remarks || "N/A"}`,
      },
      {
        field: "Document Hash",
        result: fullDetails.document_hash ?? "N/A",
        feedback: (
          <button
            className="image-button"
            onClick={() => handleImageClick(fullDetails.document_hash)}
          >
            Show Image
          </button>
        ), // Add specific feedback if necessary
      },
      {
        field: "Witness Page Hash",
        result: fullDetails.witness_page_hash ?? "N/A",
        feedback: (
          <button
            className="image-button"
            onClick={() => handleImageClick(fullDetails.witness_page_hash)}
            disabled={!fullDetails.witness_page_hash}
          >
            Show Image
          </button>
        ), // Add specific feedback if necessary
      },
      {
        field: "Address",
        result: fullDetails.applied_address || "N/A",
        feedback: null, // Add specific feedback if necessary
      },
      {
        field: "Applied Address Matching",
        result: (
          <div className="address-matching">
            {fullDetails.applied_address_matching
              ? fullDetails.applied_address_matching.map((address, index) => (
                  <div key={index}>
                    {`${address.located_address}`}
                    <br />
                    {`(Confidence: ${address.confidence_level}, Page No: ${address.page_no})`}
                    <br />
                    <button
                      className="image-button"
                      onClick={() => handleImageClick(address.snap_hash)}
                    >
                      Show Image
                    </button>
                  </div>
                ))
              : "N/A"}
          </div>
        ),
        feedback: (
          <div className="address-matching">
            {feedback.address_feedback
              ? feedback.address_feedback.map((fb, index) => {
                  const matchingAddress =
                    fullDetails.applied_address_matching[index];
                  const matchingPageNo = matchingAddress?.page_no; // Get the page number

                  return (
                    <div key={index}>
                      {`Extracted Address: ${fb.extracted_address || "N/A"},`}
                      <br />
                      {`Extracted Address Remarks: ${
                        fb.extracted_address_remarks || "N/A"
                      },`}
                      <br />
                      {`Confidence Remarks: ${
                        fb.confidence_level_remarks || "N/A"
                      } (Page No: ${matchingPageNo})`}
                      <br /> {/* Adds space between entries */}
                    </div>
                  );
                })
              : "N/A"}
          </div>
        ),
      },
      {
        field: "Address Page Number",
        result: fullDetails.applied_address_matching
          ? (
              <div>
                {Array.from(new Set(fullDetails.applied_address_matching.map(address => address.page_no)))
                  .map((pageNo, index) => (
                    <div key={index}>{pageNo}</div>
                  ))}
              </div>
            )
          : "N/A",
        feedback: fullDetails.applied_address_matching
          ? fullDetails.applied_address_matching.map((address, index) => {
              const feedbackForAddress = feedback.address_feedback
                ? feedback.address_feedback[index]
                : null;
      
              const pageNumberFeedback = feedbackForAddress?.address_page_number_feedback || "N/A";
              const correctedPageNo = feedbackForAddress?.corrected_address_page_number || "N/A";
      
              return (
                <div key={index}>
                  {pageNumberFeedback !== "N/A" // Show feedback only if it's not blank
                    ? feedbackForAddress.confidence_level === "correct"
                      ? `Page No: ${address.page_no} (Feedback: Correct)`
                      : `Page No: ${
                          address.page_no
                        } (Feedback: Incorrect, Corrected Page: ${correctedPageNo}, Remarks: ${
                          feedbackForAddress.confidence_level_remarks || "N/A"
                        })`
                    : `Page No: ${address.page_no} (Feedback: N/A)`}
                </div>
              );
            })
          : "N/A",
      },
      {
        field: "Confidence Level",
        result: fullDetails.applied_address_matching
          ? fullDetails.applied_address_matching
              .map((address) => `${address.confidence_level}`)
              .join(", ")
          : "N/A",
        feedback: feedback.address_feedback ? (
          <div
            dangerouslySetInnerHTML={{
              __html: feedback.address_feedback
                .map((fb, index) => {
                  const matchingConfidenceLevel =
                    fullDetails.applied_address_matching[index]
                      ?.confidence_level;
                  const matchingPageNo =
                    fullDetails.applied_address_matching[index]?.page_no;
                  return fb.confidence_level === "correct"
                    ? "Correct"
                    : `Incorrect for ${matchingConfidenceLevel} of Page no - ${matchingPageNo} (Remark: ${
                        fb.confidence_level_remarks || "N/A"
                      })`;
                })
                .join(", <br />"), // Add <br /> after each entry
            }}
          />
        ) : (
          "N/A"
        ),
      },
      {
        field: "Document Quality",
        result: feedback.document_quality || "N/A",
        feedback: "Document quality checked", // Assuming this field only provides a status
      },
      {
        field: "ML Remarks",
        result: feedback.ml_remarks ? (
          <div
            dangerouslySetInnerHTML={{
              __html: feedback.ml_remarks,
            }}
          />
        ) : (
          "N/A"
        ),
        feedback: null, // Add specific feedback if necessary
      },
    ];
  }, [fullDetails, feedback]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Field",
        accessor: "field",
      },
      {
        Header: "Result",
        accessor: "result",
      },
      {
        Header: "Feedback",
        accessor: "feedback",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <table {...getTableProps()} className="table table-striped">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Image Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Image Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Document Image</h2>
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : (
          <img
            src={currentImageSrc}
            alt="Document"
            className="ModalImage" // Add a class for styling
          />
        )}
        <button onClick={() => setModalOpen(false)}>Close</button>
      </Modal>
    </>
  );
};

export default DataTable;
