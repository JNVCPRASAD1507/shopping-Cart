import React from "react";

const Marquee = () => {
  return (
    <>
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          whiteSpace: "nowrap",
           background: "linear-gradient(to right, #54dfc6, #b9c2ec)",
          padding: "10px 0",
          border: "1px solid #54dfc6",
        
        }}
      >
        <div
          style={{
            display: "inline-block",
            animation: "scroll 20s linear infinite",
            fontSize: "1.5rem",
            color: "#333",
            fontWeight: "600",
            paddingLeft: "100%",
          }}
        >
          👉 Welcome to my Ecommerce site 🚀 where you find all the grocery items online. ✨
        </div>
      </div>
    </>
  );
};

export default Marquee;
