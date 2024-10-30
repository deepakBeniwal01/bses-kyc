import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill CSS
import { postRemark } from "../../api/apiService";
import "../../styles/RemarkForm.css";

const RemarkForm = ({ applicationId }) => {
  const [remark, setRemark] = useState("");

  const handleRemarkSubmit = async () => {
    try {
      const result = await postRemark(applicationId, remark);
      if (result) {
        setRemark(""); // Clear the remark after submission
      } else {
        console.error("Failed to submit remark.");
      }
    } catch (error) {
      console.error("Error submitting remark:", error);
    }
  };

  return (
    <div className="mt-4 mb-5">
      {" "}
      <h3>Add Remark</h3>
      <ReactQuill
        value={remark}
        onChange={setRemark}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        }}
        className="form-control"
        placeholder="Enter your remark here..."
      />
      <button onClick={handleRemarkSubmit} className="btn btn-primary mt-2">
        Submit Remark
      </button>
    </div>
  );
};

export default RemarkForm;
