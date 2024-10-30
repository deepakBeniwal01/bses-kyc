import React from "react";
import PropTypes from "prop-types";
import "../styles/Modal.css";

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={imageSrc} alt="Snapshot" style={{ maxWidth: "100%" }} />
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageSrc: PropTypes.string.isRequired,
};

export default ImageModal;
