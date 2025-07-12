import React, { useState, useRef } from 'react';

const TabsViewer = ({ tabs, title }) => {
  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tabsRef = useRef(null);
  const containerRef = useRef(null);

  // Parse tabs to highlight notes and chords
  const parseTabsContent = (tabsText) => {
    if (!tabsText) return '';
    
    // Split into lines and process each line
    return tabsText.split('\n').map((line, lineIndex) => {
      let processedLine = line;
      
      // Replace aspirated notes (parentheses) with red highlighting
      processedLine = processedLine.replace(/\((\d+)\)/g, '<span style="color:#dc2626;font-weight:bold;">($1)</span>');
      
      // Replace aspirated notes (with minus sign) with red highlighting
      processedLine = processedLine.replace(/(-\d+)/g, '<span style="color:#dc2626;font-weight:bold;">$1</span>');
      
      // Replace blown notes (single numbers) with green highlighting
      processedLine = processedLine.replace(/(?<!\(|-)(\b\d+\b)(?!\))/g, '<span style="color:#16a34a;font-weight:bold;">$1</span>');
      
      return (
        <div key={lineIndex} className="tab-line">
          <span dangerouslySetInnerHTML={{ __html: processedLine }} />
        </div>
      );
    });
  };

  const zoomIn = () => {
    setFontSize(prev => Math.min(prev + 2, 32));
  };

  const zoomOut = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const resetZoom = () => {
    setFontSize(16);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const ControlBar = () => (
    <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
      <div className="flex items-center gap-3">
        <button
          onClick={zoomOut}
          className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          title="Zoom Out"
        >
          🔍−
        </button>
        <span className="text-sm font-semibold px-3 py-1 bg-white rounded-lg shadow-sm border border-blue-200 text-blue-700">
          {fontSize}px
        </span>
        <button
          onClick={zoomIn}
          className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          title="Zoom In"
        >
          🔍+
        </button>
        <button
          onClick={resetZoom}
          className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          title="Reset Zoom"
        >
          🔄
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          ⤢
        </button>
      </div>
    </div>
  );

  const TabsContent = () => (
    <div
      ref={tabsRef}
      className="tabs-container overflow-auto p-4 bg-white"
      style={{ 
        height: isFullscreen ? 'calc(100vh - 120px)' : '400px',
        fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace',
        lineHeight: 1.5
      }}
    >
      <div className="tabs-content whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
        {parseTabsContent(tabs)}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
          <h3 className="text-lg font-bold text-blue-800">{title} - Tabs</h3>
        </div>
        <ControlBar />
        <TabsContent />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="tabs-viewer rounded-lg overflow-hidden">
      <ControlBar />
      <TabsContent />
      
      <style jsx>{`
        .tab-line {
          margin-bottom: 4px;
          white-space: pre;
          font-size: ${fontSize}px;
          line-height: 1.4;
        }
        
        .tabs-content {
          font-size: ${fontSize}px !important;
          line-height: 1.4;
        }
        
        .tabs-container {
          -webkit-overflow-scrolling: touch;
          overflow: auto;
        }
        
        .tabs-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .tabs-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        .tabs-container::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #6366f1);
          border-radius: 4px;
        }
        
        .tabs-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #4f46e5);
        }
        
        @media (max-width: 640px) {
          .tabs-container {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          
          .tab-line {
            font-size: ${Math.max(fontSize, 12)}px !important;
          }
          
          .tabs-content {
            font-size: ${Math.max(fontSize, 12)}px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TabsViewer;
