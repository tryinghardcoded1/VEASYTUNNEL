export const parsePayload = (
  rawPayload: string, 
  host: string, 
  port: string
): string[] => {
  if (!rawPayload) return [];

  let processed = rawPayload;

  // Replace basic variables
  processed = processed.replace(/\[host\]/gi, host);
  processed = processed.replace(/\[port\]/gi, port);
  
  // Replace line endings
  // [crlf] -> \r\n
  processed = processed.replace(/\[crlf\]/gi, '\r\n');
  // [lf] -> \n
  processed = processed.replace(/\[lf\]/gi, '\n');

  // Replace split to create array of frames
  // [split] -> delimiter
  
  if (processed.includes('[split]')) {
    return processed.split('[split]');
  }

  return [processed];
};

export const generateId = () => Math.random().toString(36).substr(2, 9);