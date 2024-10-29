import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "./DataTable";
import RemarkForm from "./RemarkForm";
import {
  fetchApplicationFeedback,
  fetchApplicationResult,
} from "../../api/apiService";

const DetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fullDetails, setFullDetails] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch application feedback
        const feedbackData = await fetchApplicationFeedback(id);
        setFeedback(feedbackData);

        // Fetch application result using the TFT request ID
        const tftRequestId = "44952cfe-9641-4075-a20c-c658fb5d026f"; // Adjust as necessary
        const resultData = await fetchApplicationResult(tftRequestId, id);
        
        // Setting fullDetails based on the fetched resultData
        setFullDetails({
          application_id: resultData.application_id,
          document_hash: resultData.document_hash,
          processing_status: resultData.processing_status,
          is_valid: resultData.is_valid,
          remarks: resultData.remarks,
          applied_address_matching: resultData.applied_address_matching,
          document_date: resultData.document_date,
          witness_page_num: resultData.witness_page_num,
          witness_page_hash: resultData.witness_page_hash,
          is_registered: resultData.is_registered,
          document_type: resultData.document_type,
          applied_name: resultData.applied_name,
          person_name: resultData.person_name,
          relationship: resultData.relationship,
          is_notarized: resultData.is_notarized,
          applied_address: resultData.applied_address,
          division_code: resultData.division_code,
        });
       
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading details...</div>; // Show loading state while fetching data
  }

  if (!fullDetails || !feedback) {
    return <div>No details found.</div>; // Additional check for no data
  }

  return (
    <div>
      <h2>Application ID: {id}</h2>
      <button onClick={() => navigate("/")} className="btn btn-primary" style={{ marginBottom: "10px" }}>
        Back to Main Page
      </button>

      <DataTable fullDetails={fullDetails} feedback={feedback} />

      <RemarkForm applicationId={id} />
    </div>
  );
};

export default DetailView;
