import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './Uploader.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Uploader = () => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const navigate = useNavigate();
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        const file = new File([blob], 'cropped_image.png', { type: 'image/png' });
        setCroppedImage(URL.createObjectURL(file));
        setIsModalOpen(false);
        uploadImage(file);
      });
    }
  };

  const uploadImage = (file) => {
    setIsLoading(true);
    setUploadedFileName(file.name);
    const formData = new FormData();
    formData.append('image', file);

    axios.post('http://localhost:5000/upload', formData)
      .then(response => {
        console.log('Image uploaded successfully:', response.data);
        setIsLoading(false);
        navigate('/edit');
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        setIsLoading(false);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="image-upload-container">
      <div className="header">Sudoku Solver</div>
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        {!isLoading ? (
          <button className="upload-button">Upload a File</button>
        ) : (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{uploadedFileName}</p>
          </div>
        )}
        {!isLoading && <p>...or drag and drop a file.</p>}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>&times;</button>
            <Cropper
              src={image}
              style={{ height: 400, width: '100%' }}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
            />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={closeModal}>Cancel</button>
              <button className="continue-button" onClick={handleCrop}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Uploader;
