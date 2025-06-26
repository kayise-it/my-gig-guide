import React from 'react'

const LabelCom = ({ title, addClass }) => {
  return (
    <div><h2 className="text-lg font-medium text-gray-900 mb-4 ${addClass}">{title}</h2></div>
  );
};
export default LabelCom;