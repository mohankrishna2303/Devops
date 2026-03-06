import React, { useState } from 'react';

function FileViewer({ config }) {
  const [activeTab, setActiveTab] = useState('dockerfile');

  const downloadFile = (content, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex gap-4 border-b">
        {['dockerfile', 'kubernetes', 'terraform'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <pre className="bg-gray-100 p-4 rounded overflow-auto h-96 text-sm">
          {config[`${activeTab}_yaml`] || config[`${activeTab}_config`] || config[activeTab]}
        </pre>
        <button
          onClick={() => {
            const content = config[`${activeTab}_yaml`] || config[`${activeTab}_config`] || config[activeTab];
            downloadFile(content, `${activeTab}.txt`);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>
      </div>
    </div>
  );
}

export default FileViewer;