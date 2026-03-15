"use client";

import { BrowserCodeReader, BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { Camera, RotateCcw, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

function normalizeQrTarget(rawValue: string): string | null {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsedUrl = new URL(trimmed);
      if (parsedUrl.pathname.startsWith("/tool/")) {
        return parsedUrl.pathname;
      }
    } catch {
      return null;
    }
  }

  if (trimmed.startsWith("/tool/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/tools/")) {
    return trimmed;
  }

  return null;
}

export function MobileQrScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState("Tap Start Camera to begin scanning.");
  const [scanError, setScanError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    let cancelled = false;

    const loadDevices = async () => {
      try {
        if (!window.isSecureContext) {
          setScanError("Camera access requires HTTPS or localhost. For phone testing use a secure tunnel URL.");
          setHasCameraPermission(false);
          return;
        }

        const list = await BrowserCodeReader.listVideoInputDevices();
        if (cancelled) {
          return;
        }

        setDevices(list);

        const rearCamera =
          list.find((device) => /back|rear|environment/i.test(device.label))?.deviceId ??
          list[0]?.deviceId ??
          "";
        setSelectedDeviceId(rearCamera);
      } catch {
        if (!cancelled) {
          setScanError("Unable to list camera devices.");
        }
      }
    };

    void loadDevices();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      readerRef.current = null;
    };
  }, []);

  const stopScanner = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsScanning(false);
  };

  const startScanner = async () => {
    if (!videoRef.current || !readerRef.current) {
      return;
    }
    if (!window.isSecureContext) {
      setScanError("Camera is blocked on insecure HTTP. Open the app via HTTPS or localhost.");
      return;
    }

    setScanError(null);
    setStatusMessage("Point the camera at a tool QR code.");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      });
      stream.getTracks().forEach((track) => track.stop());
      setHasCameraPermission(true);

      controlsRef.current?.stop();
      controlsRef.current = await readerRef.current.decodeFromVideoDevice(
        selectedDeviceId || undefined,
        videoRef.current,
        (result) => {
          if (!result) {
            return;
          }

          const nextTarget = normalizeQrTarget(result.getText());
          if (!nextTarget) {
            setStatusMessage("QR scanned, but target is not recognized.");
            return;
          }

          setStatusMessage("QR code detected. Redirecting...");
          stopScanner();
          router.push(nextTarget);
        }
      );
      setIsScanning(true);
    } catch {
      setHasCameraPermission(false);
      setScanError("Camera access failed. Please allow camera permission and retry.");
      setIsScanning(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md space-y-4">
      <div className="panel p-4">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <ScanLine className="h-5 w-5" />
          QR Scanner
        </h1>
        <p className="mt-1 text-sm text-slate-600">Fast mobile scanning for tool identification and next actions.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-300 bg-black shadow-md">
        <video ref={videoRef} className="h-[60vh] min-h-[380px] w-full object-cover" muted playsInline />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <div className="h-[70%] w-full max-w-[340px] rounded-2xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
          <p className="text-center text-sm font-medium text-white">{statusMessage}</p>
        </div>
      </div>

      {devices.length > 1 ? (
        <div className="panel p-3">
          <label htmlFor="camera-select" className="mb-1 block text-xs font-medium uppercase text-slate-500">
            Camera
          </label>
          <select
            id="camera-select"
            className="app-select h-11"
            value={selectedDeviceId}
            onChange={(event) => setSelectedDeviceId(event.target.value)}
            disabled={isScanning}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 4)}`}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {scanError ? (
        <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">
          <p>{scanError}</p>
          {hasCameraPermission === false ? (
            <Button type="button" variant="outline" className="mt-2" onClick={startScanner}>
              Request Camera Permission
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {!isScanning ? (
          <Button type="button" size="lg" className="h-12 text-base" onClick={startScanner}>
            <Camera className="mr-2 h-5 w-5" />
            Start Camera
          </Button>
        ) : (
          <Button type="button" size="lg" className="h-12 text-base" variant="outline" onClick={stopScanner}>
            Stop Scan
          </Button>
        )}

        <Button
          type="button"
          size="lg"
          className="h-12 text-base"
          variant="outline"
          onClick={() => {
            stopScanner();
            void startScanner();
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </div>
    </section>
  );
}
