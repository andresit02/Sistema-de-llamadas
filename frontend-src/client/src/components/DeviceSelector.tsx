import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeviceInfo {
  deviceId: string;
  label: string;
  kind: "audioinput" | "audiooutput";
}

interface DeviceSelectorProps {
  onDeviceChange?: (kind: "audioinput" | "audiooutput", deviceId: string) => void;
  onClose: () => void;
}

export default function DeviceSelector({ onDeviceChange, onClose }: DeviceSelectorProps) {
  const [microphones, setMicrophones] = useState<DeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<DeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");

  useEffect(() => {
    loadAudioDevices();

    // Listen for device changes
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener("devicechange", loadAudioDevices);
      return () => {
        navigator.mediaDevices.removeEventListener("devicechange", loadAudioDevices);
      };
    }
  }, []);

  const loadAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Micrófono ${Math.random().toString(36).substr(2, 9)}`,
          kind: "audioinput" as const,
        }));

      const spks = devices
        .filter((d) => d.kind === "audiooutput")
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Altavoz ${Math.random().toString(36).substr(2, 9)}`,
          kind: "audiooutput" as const,
        }));

      setMicrophones(mics);
      setSpeakers(spks);

      // Set first device as default if not set
      if (!selectedMic && mics.length > 0) setSelectedMic(mics[0].deviceId);
      if (!selectedSpeaker && spks.length > 0) setSelectedSpeaker(spks[0].deviceId);
    } catch (err) {
      console.error("Error loading audio devices:", err);
    }
  };

  const handleMicChange = (deviceId: string) => {
    setSelectedMic(deviceId);
    onDeviceChange?.("audioinput", deviceId);
  };

  const handleSpeakerChange = (deviceId: string) => {
    setSelectedSpeaker(deviceId);
    onDeviceChange?.("audiooutput", deviceId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden w-80 max-w-[90vw]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30 bg-muted/30">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Dispositivos de Audio
        </h3>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
        {/* Microphones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Mic className="w-4 h-4 text-primary" />
            Micrófono
          </div>

          {microphones.length > 0 ? (
            <div className="space-y-2">
              {microphones.map((mic) => (
                <motion.button
                  key={mic.deviceId}
                  onClick={() => handleMicChange(mic.deviceId)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    selectedMic === mic.deviceId
                      ? "bg-primary/10 border border-primary/50 text-foreground"
                      : "bg-muted/30 border border-border/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="text-lg">
                    {selectedMic === mic.deviceId ? "●" : "○"}
                  </span>
                  <span className="text-sm font-medium truncate">{mic.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No hay micrófonos disponibles
            </p>
          )}
        </div>

        {/* Speakers */}
        <div className="space-y-3 border-t border-border/30 pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Volume2 className="w-4 h-4 text-accent" />
            Altavoz
          </div>

          {speakers.length > 0 ? (
            <div className="space-y-2">
              {speakers.map((speaker) => (
                <motion.button
                  key={speaker.deviceId}
                  onClick={() => handleSpeakerChange(speaker.deviceId)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    selectedSpeaker === speaker.deviceId
                      ? "bg-accent/10 border border-accent/50 text-foreground"
                      : "bg-muted/30 border border-border/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="text-lg">
                    {selectedSpeaker === speaker.deviceId ? "●" : "○"}
                  </span>
                  <span className="text-sm font-medium truncate">{speaker.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No hay altavoces disponibles
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/30 bg-muted/20 px-4 py-3">
        <p className="text-xs text-muted-foreground text-center">
          Los cambios se aplican automáticamente
        </p>
      </div>
    </motion.div>
  );
}

// Import Settings from lucide-react
import { Settings } from "lucide-react";
