// src/PdfViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { GlobalWorkerOptions } from "pdfjs-dist";
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfViewerProps {
    url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pageNum, setPageNum] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(1.5); // Initial scale

    useEffect(() => {
        const fetchPdf = async () => {
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;
            setNumPages(pdf.numPages);

            const renderPage = async (num: number) => {
                const page = await pdf.getPage(num);
                const viewport = page.getViewport({ scale: scale });

                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const context = canvas.getContext('2d');
                    if (context) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        await page.render(renderContext).promise;
                    }
                }
            };

            renderPage(pageNum);
        };

        fetchPdf();
    }, [url, pageNum, scale]);

    const goToPrevPage = () => {
        setPageNum((prevPageNum) => Math.max(prevPageNum - 1, 1));
    };

    const goToNextPage = () => {
        setPageNum((prevPageNum) => Math.min(prevPageNum + 1, numPages));
    };

    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.25, 3)); // Limit max zoom level
    };

    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.25, 0.5)); // Limit min zoom level
    };

    return (
        <div>
            <div>
                <button onClick={goToPrevPage} disabled={pageNum <= 1}>
                    Previous
                </button>
                <button onClick={goToNextPage} disabled={pageNum >= numPages}>
                    Next
                </button>
                <button onClick={zoomOut} disabled={scale <= 0.5}>
                    Zoom Out
                </button>
                <button onClick={zoomIn} disabled={scale >= 3}>
                    Zoom In
                </button>
                <p>
                    Page {pageNum} of {numPages}
                </p>
            </div>
            <div className="pdf-container">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
};

export default PdfViewer;
