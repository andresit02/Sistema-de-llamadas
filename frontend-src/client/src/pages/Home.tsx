import { useEffect, useState } from "react";
import Lobby from "@/components/Lobby"; 
import CallRoom from "@/components/CallRoom"; 
import { useMumble } from "@/hooks/useMumble";

export default function Home() {
  const [username, setUsername] = useState("Invitado");

  // Capturar el ?username= de la URL apenas carga la página
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("username");
    if (user) setUsername(user);
  }, []);

  // Inyectamos el cerebro (Hook)
  const {
    isConnected,
    isMuted,
    isDeafened,
    currentUser,
    remoteUser,
    connectToRoom,
    toggleMute,
    toggleDeafen,
    endCall
  } = useMumble(username);

  // Función que el Lobby llamará cuando den clic en "Ingresar a la Sala"
  const handleEnter = () => {
    connectToRoom();
  };

  // Si no hay conexión al servidor de voz, mostramos tu Lobby Premium
  if (!isConnected) {
    return <Lobby onEnter={handleEnter} isLoading={false} />;
  }

  // Si ya estamos conectados, desplegamos la UI de la llamada
  return (
    <CallRoom
      currentUser={currentUser}
      remoteUser={remoteUser}
      isMuted={isMuted}
      isDeafened={isDeafened}
      onToggleMute={toggleMute}
      onToggleDeafen={toggleDeafen}
      onEndCall={endCall}
      onDeviceChange={(kind, deviceId) => {
        console.log("Cambiando dispositivo:", kind, deviceId);
      }}
    />
  );
}