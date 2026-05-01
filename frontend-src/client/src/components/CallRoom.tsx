import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Settings, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DeviceSelector from "./DeviceSelector";

interface User {
  id: string;
  name: string;
  avatar?: string;
  isSpeaking: boolean;
}

interface CallRoomProps {
  currentUser: User;
  remoteUser: User | null;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onEndCall: () => void;
  onDeviceChange?: (kind: "audioinput" | "audiooutput", deviceId: string) => void;
}

export default function CallRoom({
  currentUser,
  remoteUser,
  isMuted,
  isDeafened,
  onToggleMute,
  onToggleDeafen,
  onEndCall,
  onDeviceChange,
}: CallRoomProps) {
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-border/30 backdrop-blur-md bg-card/50 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Sesión de Consulta Legal Activa
          </p>
          <h2 className="text-lg font-semibold text-foreground mt-1">
            {remoteUser ? `Conectado con ${remoteUser.name}` : "Esperando conexión..."}
          </h2>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          {/* Users display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Current user */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                {/* Avatar container */}
                <motion.div
                  animate={currentUser.isSpeaking ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-5xl md:text-6xl font-bold transition-all duration-300 ${
                    currentUser.isSpeaking
                      ? "ring-4 ring-accent shadow-lg shadow-accent/50"
                      : "ring-2 ring-border"
                  }`}
                  style={{
                    background: currentUser.avatar
                      ? `url(${currentUser.avatar}) center/cover`
                      : "linear-gradient(135deg, #0A192F 0%, #1a2a44 100%)",
                  }}
                >
                  {!currentUser.avatar && (
                    <span className="text-white">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </motion.div>

                {/* Mute indicator */}
                {isMuted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-0 right-0 bg-destructive rounded-full p-3 shadow-lg"
                  >
                    <MicOff className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-foreground text-center">
                {currentUser.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isMuted ? "Silenciado" : currentUser.isSpeaking ? "🎙️ Hablando..." : "En línea"}
              </p>
            </motion.div>

            {/* Remote user */}
            {remoteUser ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <motion.div
                    animate={remoteUser.isSpeaking ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-5xl md:text-6xl font-bold transition-all duration-300 ${
                      remoteUser.isSpeaking
                        ? "ring-4 ring-accent shadow-lg shadow-accent/50"
                        : "ring-2 ring-border"
                    }`}
                    style={{
                      background: remoteUser.avatar
                        ? `url(${remoteUser.avatar}) center/cover`
                        : "linear-gradient(135deg, #C5A059 0%, #d4b896 100%)",
                    }}
                  >
                    {!remoteUser.avatar && (
                      <span className="text-white">
                        {remoteUser.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </motion.div>

                  {/* Speaking indicator */}
                  {remoteUser.isSpeaking && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-0 right-0 bg-accent rounded-full p-3 shadow-lg"
                    >
                      <Mic className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-foreground text-center">
                  {remoteUser.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {remoteUser.isSpeaking ? "🎙️ Hablando..." : "Escuchando"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-4xl">⏳</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground text-center mt-4">
                  Esperando...
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Esperando que se conecte el otro participante
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Control bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="border-t border-border/30 backdrop-blur-md bg-card/50 px-4 py-6 md:py-8"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          {/* Microphone toggle */}
          <Button
            onClick={onToggleMute}
            size="lg"
            className={`rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300 ${
              isMuted
                ? "bg-destructive/20 hover:bg-destructive/30 text-destructive border-2 border-destructive/50"
                : "bg-primary hover:bg-primary/90 text-white"
            }`}
            title={isMuted ? "Activar micrófono" : "Silenciar micrófono"}
          >
            {isMuted ? (
              <MicOff className="w-8 h-8 md:w-10 md:h-10" />
            ) : (
              <Mic className="w-8 h-8 md:w-10 md:h-10" />
            )}
          </Button>

          {/* Audio toggle */}
          <Button
            onClick={onToggleDeafen}
            size="lg"
            className={`rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300 ${
              isDeafened
                ? "bg-muted hover:bg-muted/80 text-muted-foreground border-2 border-border"
                : "bg-primary hover:bg-primary/90 text-white"
            }`}
            title={isDeafened ? "Activar audio" : "Desactivar audio"}
          >
            {isDeafened ? (
              <VolumeX className="w-8 h-8 md:w-10 md:h-10" />
            ) : (
              <Volume2 className="w-8 h-8 md:w-10 md:h-10" />
            )}
          </Button>

          {/* Device selector */}
          <div className="relative">
            <Button
              onClick={() => setShowDeviceMenu(!showDeviceMenu)}
              size="lg"
              className="rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-accent hover:bg-accent/90 text-white transition-all duration-300"
              title="Configurar dispositivos"
            >
              <Settings className="w-8 h-8 md:w-10 md:h-10" />
            </Button>

            {showDeviceMenu && (
              <div className="absolute bottom-24 md:bottom-28 right-0 z-50">
                <DeviceSelector
                  onDeviceChange={onDeviceChange}
                  onClose={() => setShowDeviceMenu(false)}
                />
              </div>
            )}
          </div>

          {/* End call button */}
          <Button
            onClick={onEndCall}
            size="lg"
            className="rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-destructive hover:bg-destructive/90 text-white transition-all duration-300 ml-4"
            title="Terminar llamada"
          >
            <Phone className="w-8 h-8 md:w-10 md:h-10 rotate-[135deg]" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
