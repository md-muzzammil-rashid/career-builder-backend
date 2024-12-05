import * as pdfjsLib from 'pdfjs-dist';

export const parsePDFBuffer = async (fileBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) }).promise;
    let result = ''; // Initialize a string to store parsed content

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // Extract text content
        const textContent = await page.getTextContent();
        textContent.items.forEach((item) => {
            result += item.str + '\n'; // Add extracted text to result string
        });

        // Extract links (annotations)
        const annotations = await page.getAnnotations();
        annotations.forEach((annotation) => {
            if (annotation.url) {
                result += `Link: ${annotation.url}\n`; // Add link to result string
            }
        });

        result += `\n--- Page ${pageNum} End ---\n`;
    }

    return result;
}

export const parsePDFLink = async (url) => {
    const pdf = await pdfjsLib.getDocument(url).promise;
    let result = ''; // Initialize a string to store parsed content

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // Extract text content
        const textContent = await page.getTextContent();
        textContent.items.forEach((item) => {
            result += item.str + '\n'; // Add extracted text to result string
        });

        // Extract links (annotations)
        const annotations = await page.getAnnotations();
        annotations.forEach((annotation) => {
            if (annotation.url) {
                result += `Link: ${annotation.url}\n`; // Add link to result string
            }
        });

        result += `\n--- Page ${pageNum} End ---\n`;
    }

    return result;
}