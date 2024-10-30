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
        feedback: null, 
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
        ), 
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
        ), 
      },
      {
        field: "Address",
        result: fullDetails.applied_address || "N/A",
        feedback: null, 
      },
      {
        field: "Applied Address Matching",
        result: (
          <div className="address-matching">
            {fullDetails.applied_address_matching
              ? fullDetails.applied_address_matching.map((address, index) => (
                  <div key={index} className="address-item">
                    <div>
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
                  </div>
                ))
              : "N/A"}
          </div>
        ),
        feedback: (
          <div className="address-matching-feedback">
            {feedback.address_feedback
              ? feedback.address_feedback.map((fb, index) => {
                  const matchingAddress =
                    fullDetails.applied_address_matching[index];
                  const matchingPageNo = matchingAddress?.page_no;

                  return (
                    <div key={index} className="feedback-item">
                      <strong>Extracted Address:</strong>{" "}
                      {fb.extracted_address || "N/A"}
                      <br />
                      <strong>Extracted Address Remarks:</strong>{" "}
                      {fb.extracted_address_remarks || "N/A"}
                      <br />
                      <strong>Confidence Level:</strong>{" "}
                      {fb.confidence_level || "N/A"} (Page No: {matchingPageNo})
                      <br />
                      <strong>Confidence Remarks:</strong>{" "}
                      {fb.confidence_level_remarks || "N/A"} (Page No:{" "}
                      {matchingPageNo})
                      <br />
                      <strong>Page No Feedback:</strong>{" "}
                      {fb.address_page_number_feedback || "N/A"} (Page No:{" "}
                      {matchingPageNo})
                      <br />
                      <strong>Page No Remarks:</strong>{" "}
                      {fb.corrected_address_page_number || "N/A"} (Page No:{" "}
                      {matchingPageNo})
                      <br />
                      <hr /> {/* Add a horizontal line for separation */}
                    </div>
                  );
                })
              : "N/A"}
          </div>
        ),
      },
      {
        field: "Document Quality",
        result: feedback.document_quality,
        feedback: (() => {
          // Determine feedback based on document quality
          const feedbackMapping = {
            0: "No quality available.",
            1: "Good quality document.",
            2: "Average quality document.",
            3: "Poor quality document.",
          };

          // Get the quality value from feedback
          const documentQuality = feedback.document_quality;

          // Return the corresponding feedback or a default message if not found
          return feedbackMapping[documentQuality] || "Feedback not available.";
        })(),
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
        feedback: null, 
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
            className="ModalImage"
          />
        )}
        <button onClick={() => setModalOpen(false)}>Close</button>
      </Modal>
    </>
  );
};

export default DataTable;
