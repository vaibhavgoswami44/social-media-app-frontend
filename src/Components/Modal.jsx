import { useState } from "react";

const ModalExample = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Button to Open Modal */}
      <button
        onClick={openModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Open Modal
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg p-8">
              {/* Modal Content */}
              <div className="text-xl mb-4">Modal Content</div>
              <p>This is some modal content. You can add your content here.</p>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Close Modal
              </button>
            </div>
          </div>

          {/* Modal Overlay */}
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-black opacity-25"
          ></div>
        </div>
      )}
    </div>
  );
};

export default ModalExample;
