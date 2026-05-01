import { useState, useCallback, useEffect } from 'react';

export interface MumbleUser {
  id: string;
  name: string;
  isSpeaking: boolean;
  avatar?: string;
}

export const useMumble = (username: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<MumbleUser>({ id: 'local', name: username, isSpeaking: false });
  const [remoteUser, setRemoteUser] = useState<MumbleUser | null>(null);

  // 1. CONEXIÓN Y FIX DEL AUDIO
  const connectToRoom = useCallback(() => {
    // Reparar el bloqueo de audio en móviles/Chrome
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();
    }

    const inputUsername = document.getElementById('username') as HTMLInputElement;
    const connectBtn = document.getElementById('connect-dialog_controls_connect') as HTMLButtonElement;

    if (inputUsername && connectBtn) {
        inputUsername.value = username;
        inputUsername.dispatchEvent(new Event('change', { bubbles: true }));
        connectBtn.click();
        setIsConnected(true);
    } else {
        console.error("No se encontró el motor de Mumble oculto en el index.html");
    }
  }, [username]);

  // 2. CONTROLES DE AUDIO
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // Mumble oculta y muestra dos botones distintos para mutear/desmutear.
    // Si queremos mutearnos, presionamos el botón de silenciar (que Mumble muestra cuando está activo).
    if (newMutedState) {
       document.getElementById('hidden-mute-btn')?.click();
    } else {
       document.getElementById('hidden-unmute-btn')?.click();
    }
  }, [isMuted]);

  const toggleDeafen = useCallback(() => {
    setIsDeafened(prev => !prev);
    // Aquí podrías enlazar el botón de ensordecer de Mumble si le agregaste un ID en el index.html
  }, []);

  const endCall = useCallback(() => {
    // La forma más segura de cortar WebRTC sin dejar hilos colgados es recargar la pestaña
    window.location.reload(); 
  }, []);

  // 3. RASTREO FANTASMA (Saber quién está en la sala y quién habla)
  useEffect(() => {
    if (!isConnected) return;

    // Leemos el DOM invisible cada 300ms para actualizar tu UI de Framer Motion
    const interval = setInterval(() => {
        const userNodes = document.querySelectorAll('#mumble-engine .user');
        let foundRemote: MumbleUser | null = null;
        let localIsSpeaking = false;

        userNodes.forEach((node, index) => {
            const nameNode = node.querySelector('.user-name');
            const name = nameNode ? nameNode.textContent : '';
            
            // Mumble aplica 'display: none' a '.user-talk-on' cuando hay silencio.
            const talkNode = node.querySelector('.user-talk-on');
            const isSpeaking = talkNode ? window.getComputedStyle(talkNode).display !== 'none' : false;

            if (name === username) {
                localIsSpeaking = isSpeaking;
            } else if (name && name.trim() !== '') {
                foundRemote = { id: String(index), name, isSpeaking };
            }
        });

        setCurrentUser(prev => ({ ...prev, name: username, isSpeaking: localIsSpeaking }));
        setRemoteUser(foundRemote);
    }, 300);

    return () => clearInterval(interval);
  }, [isConnected, username]);

  return { 
    isConnected, isMuted, isDeafened, currentUser, remoteUser, 
    connectToRoom, toggleMute, toggleDeafen, endCall 
  };
};