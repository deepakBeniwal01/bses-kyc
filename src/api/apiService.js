import axios from "axios";

const API_BASE_URL = "http://10.125.75.141:8000/app/kycapplication"; // Base URL

export const fetchAllResults = async (url) => {
  try {
    if (url) {
      const response = await axios.get(url);
      return response.data;
    } else {
      const response = await axios.get(
        `${API_BASE_URL}/feedback-applications/?page=1`
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching all results:", error);
    return [];
  }
};

// Function to fetch feedback for a specific application ID
export const fetchApplicationFeedback = async (applicationId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get-application-feedback/${applicationId}`
    );
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching feedback for application ${applicationId}:`, error);
    return null; // or an appropriate fallback value
  }
};

// Function to fetch the application result
export const fetchApplicationResult = async (tftRequestId, applicationId) => {
  try {
    const payload = {
      tft_request_id: "44952cfe-9641-4075-a20c-c658fb5d026f",
      application_id: applicationId,
    };
    
    const response = await axios.post(`${API_BASE_URL}/application-result`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error fetching application result for ID ${applicationId}:`, error);
    return null; // or an appropriate fallback value
  }
};

export const postRemark = async (applicationId, mlRemarks) => {
  try {
    const payload = {
      application_id: applicationId,
      ml_remarks: mlRemarks,
      consider_for_accuracy: "True"
    };

    const response = await axios.post(`${API_BASE_URL}/ml-remarks`, payload);
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error(
      `Error posting remark for application ${applicationId}:`,
      error
    );
    return null; // or an appropriate fallback value
  }
};

export const fetchDocumentWithToken = async (documentID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-document/${documentID}`, {
      responseType: 'blob', // Important to set responseType to blob
    });

    // Check the Content-Type
    const contentType = response.headers['content-type'];

    // Handle PDF response
    if (contentType === 'application/pdf') {
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      // Create a link element to download the PDF
      const a = document.createElement('a');
      a.href = url;
      a.download = `document_${documentID}.pdf`; // Set the filename for the download
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Programmatically click the link to trigger the download
      document.body.removeChild(a); // Remove the link after triggering the download

      URL.revokeObjectURL(url); // Free up memory by revoking the object URL
    } 
    // Handle image response
    else if (contentType.startsWith('image/')) {
      return response.data; // Return the blob data directly for image handling
    } else {
      console.error("The document is neither a valid PDF nor an image.");
      return null; // Handle cases where the content is not supported
    }
    
  } catch (error) {
    console.error("Error fetching document data:", error);
    return null; // Return null or appropriate fallback
  }
};
