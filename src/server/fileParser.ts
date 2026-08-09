import pdf from 'pdf-parse';
import { parse as csvParse } from 'csv-parse/sync';
import mammoth from 'mammoth';

export interface ParsedFile {
  text: string;
  metadata: {
    pageCount?: number;
    rowCount?: number;
    wordCount?: number;
    format: string;
  };
}

export async function parseFile(file) {
  const buffer = file.buffer;
  const mimeType = file.mimetype;

  try {
    if (mimeType === 'application/pdf') {
      const data = await pdf(buffer);
      return {
        text: data.text,
        metadata: {
          pageCount: data.numpages,
          wordCount: data.text.split(/[\s]+/).filter(Boolean).length,
          format: 'PDF',
        },
      };
    }

    if (mimeType === 'text/plain' || mimeType.startsWith('text/')) {
      const text = buffer.toString('utf-8');
      return {
        text,
        metadata: {
          wordCount: text.split(/[\s]+/).filter(Boolean).length,
          format: 'TXT',
        },
      };
    }

    if (mimeType === 'text/csv' || mimeType === 'application/csv') {
      const text = buffer.toString('utf-8');
      const records = csvParse(text, { columns: true, skip_empty_lines: true });
      const headers = records.length > 0 ? Object.keys(records[0]) : [];
      const rows = records.map((row) => 
        headers.map(h => String(row[h] || '')).join(' | ')
      );
      const rowStr = rows.join(String.fromCharCode(10));
      return {
        text: 'CSV Data (' + records.length + ' rows)' + String.fromCharCode(10) + 'Headers: ' + headers.join(', ') + String.fromCharCode(10) + String.fromCharCode(10) + rowStr,
        metadata: {
          rowCount: records.length,
          wordCount: text.split(/[\s]+/).filter(Boolean).length,
          format: 'CSV',
        },
      };
    }

    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return {
        text: result.value,
        metadata: {
          wordCount: result.value.split(/[\s]+/).filter(Boolean).length,
          format: 'DOCX',
        },
      };
    }

    if (mimeType.startsWith('image/')) {
      return {
        text: '[Image file: ' + file.originalname + ']',
        metadata: {
          format: (mimeType.split('/')[1] || 'IMAGE').toUpperCase(),
        },
      };
    }

    return {
      text: 'Unsupported file format: ' + mimeType,
      metadata: { format: 'UNSUPPORTED' },
    };
  } catch (error) {
    return {
      text: 'Error parsing file: ' + (error?.message || 'Unknown error'),
      metadata: { format: 'ERROR' },
    };
  }
}
