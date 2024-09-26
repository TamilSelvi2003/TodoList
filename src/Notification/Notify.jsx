import React from "react";
import '../Notification/notify.css'

const Notify= ({ message, onClose }) => {
    return (
      <div className="notification">
        {message}
      </div>
    );
  };

  export default Notify;
  