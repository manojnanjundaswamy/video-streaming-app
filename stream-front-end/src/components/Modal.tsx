// filepath: src/components/Modal.tsx
import React from "react";
import "../App.css";
import { motion } from "framer-motion";

interface ModalProps {
  show: boolean;
  size?: string;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  size,
  children,
}) => {
  if (!show) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x:0, y: 0 , zIndex: 1000 }}
      animate={{ opacity: 1, x:0, y: 0, zIndex: 1000 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      // style={{
      //   width: 100,
      //   height: 100,
      //   backgroundColor: "green",
      // }}
    >
      <div id="authentication-modal" className="flex z-10 modal-overlay">
        <div
          className="modal-content"
          style={{ height: "auto", width: `${size}%` }}
        >
          {/* <!-- Modal content --> */}
          <div className="bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-2 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    stroke-linejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            {children}
          </div>
        </div>
      </div>
    </motion.div>
    // <div className="flex z-10 modal-overlay">
    //   <div className="modal-content " style={{height: "inherit"}}>
    //     <button onClick={onClose} className="modal-close-button">Close</button>
    //     {children}
    //   </div>
    // </div>
  );
};

export default Modal;
