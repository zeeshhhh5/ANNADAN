"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import jsQR from "jsqr";
import {
  Download,
  Share2,
  MessageCircle,
  Copy,
  QrCode,
  Phone,
  MapPin,
  User,
  Package,
  Scan,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface QRCodeGeneratorProps {
  data: {
    type: "listing" | "donation" | "pickup" | "contact";
    id: string;
    title: string;
    description?: string;
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
    contact?: {
      name: string;
      phone: string;
    };
    quantity?: number;
    expiresAt?: string;
  };
  size?: number;
}

export function QRCodeGenerator({ data, size = 200 }: QRCodeGeneratorProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code data URL
  const qrContent = JSON.stringify({
    app: "AnnaDaan",
    version: "1.0",
    ...data,
    generatedAt: new Date().toISOString(),
  });

  // Create a shareable URL
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/share/${data.type}/${data.id}`;

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(shareUrl, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        });
        setQrDataUrl(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast.error("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [shareUrl, size]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = `AnnaDaan_${data.type}_${data.id}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success("QR Code downloaded!");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `🍽️ *AnnaDaan - ${data.title}*\n\n` +
      `${data.description || ""}\n\n` +
      (data.location ? `📍 Location: ${data.location.address}\n` : "") +
      (data.quantity ? `📦 Quantity: ${data.quantity} kg\n` : "") +
      (data.contact ? `👤 Contact: ${data.contact.name}\n📞 Phone: ${data.contact.phone}\n` : "") +
      `\n🔗 View Details: ${shareUrl}\n\n` +
      `_Shared via AnnaDaan - Reducing food waste, one meal at a time_`
    );

    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleShareWhatsAppContact = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `🍽️ *AnnaDaan - ${data.title}*\n\n` +
      `${data.description || ""}\n\n` +
      (data.location ? `📍 Location: ${data.location.address}\n` : "") +
      (data.quantity ? `📦 Quantity: ${data.quantity} kg\n` : "") +
      `\n🔗 View Details: ${shareUrl}\n\n` +
      `_Shared via AnnaDaan_`
    );

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleOpenMaps = () => {
    if (!data.location) return;
    
    const { lat, lng } = data.location;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, "_blank");
    toast.success("Opening Google Maps...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-green-400" />
          QR Code & Share
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center p-4 bg-white rounded-lg">
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
          )}
        </div>

        {/* Info Display */}
        <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">{data.title}</span>
          </div>
          {data.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">{data.location.address}</span>
            </div>
          )}
          {data.contact && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400">{data.contact.name}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>

        {/* WhatsApp Share */}
        <Button
          onClick={handleShareWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Share via WhatsApp
        </Button>

        {/* Share to specific contact */}
        {data.contact?.phone && (
          <Button
            onClick={() => handleShareWhatsAppContact(data.contact!.phone)}
            variant="outline"
            className="w-full border-green-600 text-green-400 hover:bg-green-600/10"
          >
            <Phone className="w-4 h-4 mr-2" />
            Message {data.contact.name} on WhatsApp
          </Button>
        )}

        {/* Get Directions */}
        {data.location && (
          <Button
            onClick={handleOpenMaps}
            variant="outline"
            className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/10"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Get Directions in Google Maps
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// QR Code Scanner Component
interface QRCodeScannerProps {
  onScan: (data: { success: boolean; data?: any; error?: string }) => void;
  onClose?: () => void;
}

export function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        scanFrame();
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast.error("Camera access denied. Please allow camera access.");
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setScanning(false);
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });

    if (code) {
      try {
        const parsed = JSON.parse(code.data);
        setScannedData(parsed);
        stopScanning();
        onScan({ success: true, data: parsed });
        toast.success("QR Code scanned successfully!");
        return;
      } catch {
        // If not JSON, pass raw data
        setScannedData({ raw: code.data });
        stopScanning();
        onScan({ success: true, data: { raw: code.data } });
        toast.success("QR Code scanned!");
        return;
      }
    }

    animationRef.current = requestAnimationFrame(scanFrame);
  };

  const handleReset = () => {
    setScannedData(null);
    startScanning();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Scan className="w-5 h-5 text-green-400" />
          Scan QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scannedData ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Scanned Successfully</span>
              </div>
              <pre className="text-xs text-gray-400 overflow-auto max-h-32">
                {JSON.stringify(scannedData, null, 2)}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReset} className="flex-1 bg-green-500 hover:bg-green-600">
                <Scan className="w-4 h-4 mr-2" />
                Scan Again
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="outline" className="border-gray-700 text-white">
                  Close
                </Button>
              )}
            </div>
          </div>
        ) : scanning ? (
          <>
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-2 border-green-500/50 m-8 rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-xs text-white/70 bg-black/50 px-2 py-1 rounded">
                  Position QR code within frame
                </span>
              </div>
            </div>
            <Button
              onClick={stopScanning}
              variant="outline"
              className="w-full border-red-600 text-red-400 hover:bg-red-600/10"
            >
              Stop Scanning
            </Button>
          </>
        ) : (
          <>
            <div className="text-center py-8 text-gray-500">
              <Scan className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Point your camera at a QR code to scan</p>
            </div>
            <Button
              onClick={startScanning}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Simple QR scanner button for quick actions
export function QRScannerButton({ 
  onScan, 
  className 
}: { 
  onScan: (data: { success: boolean; data?: any; error?: string }) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className={className || "bg-green-500 hover:bg-green-600"}
      >
        <Scan className="w-4 h-4 mr-2" />
        Scan QR
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <QRCodeScanner 
              onScan={(result) => {
                onScan(result);
                if (result.success) {
                  setIsOpen(false);
                }
              }}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
