import React from "react";

type Props = JSX.IntrinsicElements["button"] & { label: string };

export const Button: React.VFC<Props> = ({ type, onClick, label }) => {
  return (
    <button
      className="pt-2 pb-2 pr-4 pl-4 border border-gray-900 rounded-md shadow-md hover:opacity-70"
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
