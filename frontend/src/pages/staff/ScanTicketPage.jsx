import { useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { useValidateTicket } from '@/hooks/useTickets';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import TicketStatusBadge from '@/components/ticket/TicketStatusBadge';
import toast from 'react-hot-toast';

export default function ScanTicketPage() {
  const [scanResult, setScanResult] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  const validateMutation = useValidateTicket();

  const handleValidate = async (qrToken) => {
    try {
      const response = await validateMutation.mutateAsync(qrToken);
      
      if (response.data && response.data.valid === false) {
        setScanResult({
          success: false,
          message: response.data.message || 'Invalid ticket',
        });
        toast.error(response.data.message || 'Invalid ticket');
        return;
      }

      setScanResult({
        success: true,
        data: response.data,
      });
      toast.success(response.data.message || 'Ticket is valid');
      
      // Stop scanner if it's running
      if (scannerRef.current) {
        scannerRef.current.pause(true);
      }
    } catch (err) {
      setScanResult({
        success: false,
        message: err.response?.data?.message || 'Invalid ticket',
      });
      toast.error(err.response?.data?.message || 'Invalid ticket');
    }
  };

  const startScanner = () => {
    setIsScanning(true);
    setScanResult(null);

    // Give UI time to mount the container
    setTimeout(() => {
      scannerRef.current = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] },
        /* verbose= */ false
      );
      
      scannerRef.current.render(
        (decodedText) => {
          // Success callback
          handleValidate(decodedText);
        },
        (error) => {
          // Failure callback — usually just continuous scanning failures, ignore
        }
      );
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const resumeScanner = () => {
    setScanResult(null);
    if (scannerRef.current) {
      scannerRef.current.resume();
    } else {
      startScanner();
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken) return;
    handleValidate(manualToken);
    setManualToken('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-display text-black">Scan Ticket</h1>
        <p className="text-surface-400 mt-2">Use your camera to scan QR codes or enter token manually.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner Area */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-black flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Camera Scanner
            </h3>
          </Card.Header>
          <Card.Body>
            <div className={`rounded-xl overflow-hidden bg-surface-950 border border-surface-800 ${isScanning ? 'min-h-[300px]' : ''}`}>
              {isScanning ? (
                <div id="reader" className="w-full text-white [&>div]:!border-none [&_video]:rounded-lg" />
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-surface-800 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-sm text-surface-400 mb-4">Click below to start camera</p>
                  <Button variant="accent" onClick={startScanner}>
                    Start Scanner
                  </Button>
                </div>
              )}
            </div>

            {isScanning && (
              <Button variant="ghost" fullWidth className="mt-4" onClick={stopScanner}>
                Stop Scanner
              </Button>
            )}
          </Card.Body>
        </Card>

        {/* Manual Entry */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-black flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Manual Entry
            </h3>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Input
                label="Ticket Token / Code"
                placeholder="Enter QR token or Ticket Code (e.g. TIX-...)"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
              />
              <Button type="submit" variant="primary" fullWidth loading={validateMutation.isPending}>
                Validate
              </Button>
            </form>
          </Card.Body>
        </Card>
      </div>

      {/* Result Card */}
      {scanResult && (
        <Card className={`border-2 ${scanResult.success ? 'border-success-500/50 bg-success-500/5' : 'border-danger-500/50 bg-danger-500/5'}`}>
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            <div className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center ${scanResult.success ? 'bg-success-500/20 text-success-400' : 'bg-danger-500/20 text-danger-400'}`}>
              {scanResult.success ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className={`text-xl font-bold ${scanResult.success ? 'text-success-400' : 'text-danger-400'}`}>
                {scanResult.success ? 'Access Granted' : 'Access Denied'}
              </h3>
              
              {scanResult.success && scanResult.data?.ticket && (
                <div className="bg-surface-900/50 rounded-lg p-4 mt-4 space-y-2">
                  <p className="text-sm text-surface-400">
                    <span className="font-semibold text-white">Ticket Code:</span> {scanResult.data.ticket.ticket_code}
                  </p>
                  <p className="text-sm text-surface-400">
                    <span className="font-semibold text-white">Attendee:</span> {scanResult.data.ticket.user?.name}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm font-semibold text-white">Status:</span>
                    <TicketStatusBadge status={scanResult.data.ticket.status} />
                  </div>
                </div>
              )}

              {!scanResult.success && (
                <p className="text-surface-300">{scanResult.message}</p>
              )}

              <Button onClick={resumeScanner} variant={scanResult.success ? 'success' : 'danger'} className="mt-4">
                Scan Next Ticket
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
