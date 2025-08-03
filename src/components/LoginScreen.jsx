import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx';
import { Camera, Upload } from 'lucide-react';
import vibetalkLogo from '../assets/vibetalk-logo.png';

// Importar todos os avatares
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';
import avatar6 from '../assets/avatar6.png';
import avatar7 from '../assets/avatar7.png';
import avatar8 from '../assets/avatar8.png';
import avatar9 from '../assets/avatar9.png';
import avatar10 from '../assets/avatar10.png';

const predefinedAvatars = [
  avatar1, avatar2, avatar3, avatar4, avatar5,
  avatar6, avatar7, avatar8, avatar9, avatar10
];

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [customPhoto, setCustomPhoto] = useState(null);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomPhoto(e.target.result);
        setSelectedAvatar(null); // Limpar avatar selecionado se foto personalizada for carregada
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatarIndex) => {
    setSelectedAvatar(avatarIndex);
    setCustomPhoto(null); // Limpar foto personalizada se avatar for selecionado
  };

  const handleLogin = () => {
    if (username.trim() && (selectedAvatar !== null || customPhoto)) {
      const userProfile = {
        username: username.trim(),
        avatar: customPhoto || predefinedAvatars[selectedAvatar],
        isCustomPhoto: !!customPhoto
      };
      onLogin(userProfile);
    }
  };

  const isFormValid = username.trim() && (selectedAvatar !== null || customPhoto);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <img 
              src={vibetalkLogo} 
              alt="VibeTalk Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">VibeTalk</h1>
          <p className="text-gray-600">Entre no chat e conecte-se com pessoas!</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Seção de foto/avatar */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Escolha sua foto</h3>
            
            {/* Botão para upload de foto */}
            <div className="mb-6">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="w-24 h-24 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-purple-500 transition-colors bg-gray-50 hover:bg-purple-50">
                  {customPhoto ? (
                    <img 
                      src={customPhoto} 
                      alt="Foto personalizada" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">Carregar foto</span>
                    </div>
                  )}
                </div>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Avatares pré-definidos */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {predefinedAvatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarSelect(index)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                    selectedAvatar === index 
                      ? 'border-purple-500 ring-2 ring-purple-200' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <img 
                    src={avatar} 
                    alt={`Avatar ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Campo de nome de usuário */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nome de usuário
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              maxLength={20}
            />
          </div>

          {/* Botão de entrar */}
          <Button 
            onClick={handleLogin}
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Entrar no Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

