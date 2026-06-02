import React from "react";

const CartoonAnimation = ({ direction = "right" }) => {
  return (
    <>
      <style>
        {`
          .cartoon-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background: transparent;
          }

          .ninja {
            width: 180px;
            height: 248.5px;
            position: relative;
            background: url('http://img13.deviantart.net/7fc3/i/2012/288/4/7/volt_sprite_sheet_by_kwelfury-d5hx008.png')
              0 247.5px;
            animation: courir .4s steps(5) infinite;
            image-rendering: pixelated;
          }

          .ninja-right {
            transform: scale(1.15) scaleX(1);
          }

          .ninja-left {
            transform: scale(1.15) scaleX(-1);
          }

          @keyframes courir {
            0%   { background-position-x: 0px; }
            100% { background-position-x: -900px; }
          }
        `}
      </style>

      <div className="cartoon-container">
        <div className={`ninja ninja-${direction}`}></div>
      </div>
    </>
  );
};

export default CartoonAnimation;