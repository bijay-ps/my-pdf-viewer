import React from 'react';
import './App.css';
import PdfViewer from "./PDFViewer/PdfViewer";

function App() {

  const pdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
  return (
      <div className="App">
        <h1>PDF Viewer</h1>
        <PdfViewer url={pdfUrl}/>
      </div>
  );
}

export default App;
