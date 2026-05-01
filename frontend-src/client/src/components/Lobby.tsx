import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

interface LobbyProps {
  onEnter: () => void;
  isLoading?: boolean;
}

export default function Lobby({ onEnter, isLoading = false }: LobbyProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 z-50">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Gradient accent line at top */}
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="p-8 md:p-10 text-center space-y-6">
            {/* Logo Shield */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/50 rounded-2xl blur-xl opacity-30" />
                <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 w-24 h-24 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Sala de Consulta Legal
              </h1>
              <p className="text-sm font-medium text-accent">Pericles Legal Platform</p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-muted-foreground leading-relaxed text-base"
            >
              Ingrese a su sesión privada de consulta legal. Su conexión está protegida con cifrado de extremo a extremo.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pt-2"
            >
              <Button
                onClick={onEnter}
                disabled={isLoading}
                size="lg"
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Conectando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>🎙️</span>
                    Ingresar a la Sala
                  </span>
                )}
              </Button>
            </motion.div>

            {/* Security badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/30"
            >
              <span>🔒</span>
              <span>Protegido por Pericles Security Protocol v4.1</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
