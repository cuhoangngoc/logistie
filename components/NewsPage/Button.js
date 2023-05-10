import React from 'react'

const Button = ({ text, color, onClick }) => {
    const buttonColors = {
        red: "bg-red-500 hover:bg-red-600",
        green: "bg-green-500 hover:bg-green-600",
        blue: "bg-blue-500 hover:bg-blue-600",
        purple: "bg-purple-500 hover:bg-purple-600",
    };

    const buttonStyle = `m-3 px-8 py-3 font-semibold rounded ${buttonColors[color]} text-white`;

    return (
        <button className={buttonStyle} onClick={onClick}>
            {text}
        </button>
    );
};


export default Button