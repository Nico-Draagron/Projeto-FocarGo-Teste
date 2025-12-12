import React, { useRef, useState, useEffect } from 'react';
import { Button } from './UI';
import { CameraIcon } from './Icons';
import { motion } from 'framer-motion';

// --- CAMERA MODE ---
export const CameraMode = ({ onCapture }: { onCapture: (base64: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
            });
            activeStream = s;
            setStream(s);
            if (videoRef.current) {
                videoRef.current.srcObject = s;
            }
        } catch (err) {
            console.error(err);
            setError("Não foi possível acessar a câmera. Verifique as permissões.");
        }
    };

    startCamera();

    return () => {
        if (activeStream) {
            activeStream.getTracks().forEach(t => t.stop());
        }
    };
  }, []);

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(video, 0, 0);
        onCapture(canvas.toDataURL('image/jpeg', 0.85));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = () => onCapture(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="relative w-full h-[500px] bg-black rounded-3xl overflow-hidden shadow-2xl">
      {error ? (
          <div className="flex items-center justify-center h-full text-white p-6 text-center">
              <p>{error}</p>
          </div>
      ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
      )}
      
      {/* Overlay Guides */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-[15%] border-2 border-white/50 rounded-3xl border-dashed">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-xl"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-xl"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-xl"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-xl"></div>
        </div>
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/10">
          Posicione o resíduo no centro
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8">
          <label className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
              <span className="text-xl">🖼️</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          <button 
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group"
          >
              <div className="w-16 h-16 bg-accent rounded-full group-hover:scale-90 transition-transform duration-200"></div>
          </button>

          <div className="w-12 h-12"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
};

// --- VOICE MODE ---
export const VoiceMode = ({ onVoiceCapture }: { onVoiceCapture: (audioBlob: string) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordedBase64, setRecordedBase64] = useState<string | null>(null);

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.current.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
                setRecordedBase64(reader.result as string);
            };
            reader.readAsDataURL(blob);
            stream.getTracks().forEach(t => t.stop());
        };

        mediaRecorder.current.start();
        setIsRecording(true);
    } catch (e) {
        console.error("Microphone access denied", e);
        alert("Permissão de microfone necessária.");
    }
  };

  const stopRecording = () => {
      mediaRecorder.current?.stop();
      setIsRecording(false);
      setDuration(0);
  };

  useEffect(() => {
      let interval: any;
      if (isRecording) {
          interval = setInterval(() => setDuration(s => s + 1), 1000);
      }
      return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-gradient-to-br from-purple/5 to-teal/5 rounded-3xl p-8 border border-gray-100">
      
      {!isRecording && !recordedBase64 && (
        <div className="text-center">
            <button 
                onClick={startRecording}
                className="w-32 h-32 bg-gradient-to-br from-purple to-purple-dark rounded-full flex items-center justify-center text-6xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform"
            >
                🎤
            </button>
            <p className="mt-6 text-gray-500 font-medium">Toque para descrever o resíduo</p>
        </div>
      )}

      {isRecording && (
        <div className="text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple/10 rounded-full animate-ping"></div>
            <button 
                onClick={stopRecording}
                className="relative z-10 w-32 h-32 bg-red-500 rounded-full flex items-center justify-center text-6xl text-white shadow-xl animate-pulse"
            >
                ⏹
            </button>
            <p className="mt-8 text-3xl font-black text-dark tabular-nums">00:{duration.toString().padStart(2, '0')}</p>
            <p className="mt-2 text-sm text-gray-500">Gravando... Descreva o objeto.</p>
        </div>
      )}

      {recordedBase64 && (
         <div className="text-center w-full max-w-xs animate-in slide-up">
            <div className="w-24 h-24 bg-teal rounded-full flex items-center justify-center text-5xl mx-auto mb-6 text-white shadow-lg">
                ✓
            </div>
            <p className="text-gray-800 font-bold mb-6">Áudio capturado com sucesso!</p>
            <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setRecordedBase64(null)}>Refazer</Button>
                <Button onClick={() => onVoiceCapture(recordedBase64)}>Analisar 🚀</Button>
            </div>
         </div>
      )}
    </div>
  );
};

// --- TEXT MODE ---
export const TextMode = ({ onTextSubmit }: { onTextSubmit: (text: string) => void }) => {
    const [input, setInput] = useState("");
    const suggestions = ["Garrafa PET de Coca-Cola", "Caixa de papelão de pizza", "Lata de alumínio amassada", "Pote de vidro de azeitona"];

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-3xl p-8 border-2 border-gray-100">
            <h3 className="text-xl font-black text-dark mb-4">Descreva o resíduo</h3>
            <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: Garrafa de vidro transparente com tampa de metal, rótulo de papel..."
                className="flex-1 border-2 border-gray-200 rounded-2xl p-4 resize-none focus:border-teal focus:outline-none text-lg transition-colors placeholder-gray-300"
                maxLength={300}
            />
            
            <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Sugestões rápidas</p>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map(s => (
                        <button 
                            key={s} 
                            onClick={() => setInput(s)}
                            className="bg-gray-50 hover:bg-teal/10 hover:text-teal border border-gray-200 rounded-full px-3 py-1 text-xs font-bold text-gray-600 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <Button 
                onClick={() => onTextSubmit(input)} 
                disabled={input.length < 3}
                className="mt-6 w-full py-4 text-lg"
            >
                Identificar com Gemini 3 🧠
            </Button>
        </div>
    );
};