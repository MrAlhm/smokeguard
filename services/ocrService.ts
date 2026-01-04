
const OCR_API_KEY = 'K85156107588957';
const OCR_ENDPOINT = 'https://api.ocr.space/parse/image';

export const detectLicensePlate = async (base64Image: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('base64Image', base64Image);
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');

    const response = await fetch(OCR_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.IsErroredOnProcessing) {
      console.error('OCR Error:', data.ErrorMessage);
      return 'UNABLE TO READ';
    }

    const text = data.ParsedResults?.[0]?.ParsedText?.trim() || 'NOT DETECTED';
    
    // Simple heuristic to extract something that looks like a plate from noise
    // Usually 7-10 characters, alphanumeric
    const lines = text.split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      if (cleaned.length >= 4 && cleaned.length <= 12) {
        return cleaned;
      }
    }

    return text.substring(0, 12).replace(/[^A-Z0-9]/gi, '').toUpperCase() || 'UNDER VERIFICATION';
  } catch (error) {
    console.error('OCR Service Error:', error);
    return 'API ERROR';
  }
};
