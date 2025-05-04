/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';

// Define types for NFC API
interface NFCRecord {
  recordType: string;
  mediaType?: string;
  data: string;
  // Add raw hex representation for debugging
  rawData?: string;
}

interface NFCData {
  serialNumber: string;
  records: NFCRecord[];
  // Add additional card info
  isNDEF: boolean;
  cardType?: string;
  rawHexDump?: string;
}

// Add type declarations for Web NFC API
declare global {
  interface Window {
    NDEFReader: any;
  }
}

export default function NFCPage() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [reading, setReading] = useState<boolean>(false);
  const [nfcData, setNfcData] = useState<NFCData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if NFC is supported in the browser
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setSupported(true);
    } else {
      setSupported(false);
      setError('NFC is not supported in this browser or device.');
    }
  }, []);

  const startReading = async () => {
    if (!supported) return;
    
    try {
      setReading(true);
      setError(null);
      setNfcData(null);
      
      const ndef = new window.NDEFReader();
      await ndef.scan();
      
      ndef.addEventListener("reading", ({ message, serialNumber }: { message: any, serialNumber: string }) => {
        console.log("NFC tag read!", message, serialNumber);

        const records: NFCRecord[] = [];
        let isNDEF = true;
        
        // Try to process as NDEF card
        try {
          if (message && message.records && message.records.length > 0) {
            for (const record of message.records) {
              const decoder = new TextDecoder();
              const data = decoder.decode(record.data);
              
              // Convert buffer to hex for debugging
              const rawHex = Array.from(new Uint8Array(record.data.buffer || record.data))
                .map(b => b.toString(16).padStart(2, '0'))
                .join(' ');
                
              records.push({
                recordType: record.recordType,
                mediaType: record.mediaType,
                data: data,
                rawData: rawHex
              });
            }
          } else {
            isNDEF = false;
            records.push({
              recordType: "unknown",
              data: "Card doesn't contain standard NDEF data"
            });
          }
        } catch (err) {
          isNDEF = false;
          console.error("Error processing NDEF data:", err);
          records.push({
            recordType: "error",
            data: "Failed to process card data"
          });
        }

        // Determine card type based on available info
        let cardType = "Unknown";
        if (serialNumber.startsWith("04")) {
          cardType = "Likely MIFARE or ISO 14443A";
        } else if (serialNumber.startsWith("08")) {
          cardType = "Possibly ISO 14443B";
        }
        
        // Create hex dump of serial number for debugging
        const serialHex = serialNumber.split(':').join(' ');

        setNfcData({
          serialNumber,
          records,
          isNDEF,
          cardType, 
          rawHexDump: serialHex
        });
      });

      ndef.addEventListener("error", (errorEvent: any) => {
        setError(`NFC Error: ${errorEvent.message}`);
        setReading(false);
      });
      
    } catch (error: unknown) {
      console.error("Error scanning NFC:", error);
      setError(`Failed to start NFC scanning: ${error instanceof Error ? error.message : String(error)}`);
      setReading(false);
    }
  };

  const stopReading = () => {
    setReading(false);
    // Note: Web NFC API doesn't have a direct way to stop scanning
    // The scan is typically stopped when the page is unloaded
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center">
      <main className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">NFC Card Reader</h1>
        
        {supported === false && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {supported === true && (
          <div className="w-full max-w-md">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="flex justify-center mb-6">
                {!reading ? (
                  <button
                    onClick={startReading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Start NFC Scan
                  </button>
                ) : (
                  <button
                    onClick={stopReading}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Stop NFC Scan
                  </button>
                )}
              </div>
              
              {reading && !nfcData && (
                <div className="text-center">
                  <div className="inline-block animate-pulse bg-blue-200 p-4 rounded-full mb-2">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Bring an NFC card close to your device...</p>
                </div>
              )}
            </div>
            
            {nfcData && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">NFC Card Data</h2>
                
                <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-gray-700"><span className="font-medium">Serial Number:</span> {nfcData.serialNumber}</p>
                  <p className="text-gray-700"><span className="font-medium">Card Type:</span> {nfcData.cardType || "Unknown"}</p>
                  <p className="text-gray-700"><span className="font-medium">Format:</span> {nfcData.isNDEF ? "NDEF Compliant" : "Non-NDEF Format"}</p>
                  {nfcData.rawHexDump && (
                    <div className="mt-2">
                      <p className="font-medium text-gray-700">Raw Serial (HEX):</p>
                      <p className="bg-gray-100 p-2 rounded font-mono text-sm mt-1 break-all">{nfcData.rawHexDump}</p>
                    </div>
                  )}
                </div>
                
                <h3 className="font-medium mb-2">Records:</h3>
                {nfcData.records.length > 0 ? (
                  <div className="space-y-3">
                    {nfcData.records.map((record, index) => (
                      <div key={index} className="border rounded-md p-3 bg-gray-50">
                        <p><span className="font-medium">Record Type:</span> {record.recordType}</p>
                        {record.mediaType && <p><span className="font-medium">Media Type:</span> {record.mediaType}</p>}
                        <p><span className="font-medium">Data:</span> {record.data}</p>
                        
                        {record.rawData && (
                          <div className="mt-2">
                            <p className="font-medium">Raw Data (HEX):</p>
                            <p className="bg-gray-100 p-2 rounded font-mono text-xs mt-1 break-all">{record.rawData}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No records found in this NFC tag.</p>
                )}
                
                {/* Dev Tools Section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-3">Developer Tools</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setNfcData({
                          serialNumber: "04:A5:B2:C3:DD:E5",
                          records: [{
                            recordType: "text",
                            mediaType: "text/plain",
                            data: "Hello NFC World!",
                            rawData: "48 65 6c 6c 6f 20 4e 46 43 20 57 6f 72 6c 64 21"
                          }],
                          isNDEF: true,
                          cardType: "MIFARE Classic (Simulated)",
                          rawHexDump: "04 A5 B2 C3 DD E5"
                        });
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm"
                    >
                      Simulate Standard Card
                    </button>
                    
                    <button 
                      onClick={() => {
                        setNfcData({
                          serialNumber: "11:22:33:44:55:66",
                          records: [{
                            recordType: "unknown",
                            data: "Card doesn't contain standard NDEF data"
                          }],
                          isNDEF: false,
                          cardType: "Unknown Proprietary Format",
                          rawHexDump: "11 22 33 44 55 66"
                        });
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm"
                    >
                      Simulate Unknown Card
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}