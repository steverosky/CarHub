import React, { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="space-y-4">
        <div 
          className="card p-4 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {images.slice(1).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${alt} view ${index + 2}`}
              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
              onClick={() => {
                setCurrentImage(index + 1);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-6xl mx-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={() => setShowModal(false)}
            >
              <FiX size={24} />
            </button>
            
            <div className="relative">
              <img
                src={images[currentImage]}
                alt={`${alt} view ${currentImage + 1}`}
                className="w-full h-[80vh] object-contain"
              />
              
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                onClick={previousImage}
              >
                <FiChevronLeft size={32} />
              </button>
              
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                onClick={nextImage}
              >
                <FiChevronRight size={32} />
              </button>
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentImage === index ? 'bg-white' : 'bg-gray-500'
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;