import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const { loginAdmin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginAdmin(email, password);
    if (res.ok) {
      onLoginSuccess();
    } else {
      setErrorMsg(res.error || 'No se pudo iniciar sesión.');
    }
  };

  const fillDemo = () => {
    setEmail('admin@huellitas.bo');
    setPassword('demo1234');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card-artesanal p-7 sm:p-8 space-y-6">
        <div className="space-y-2">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5C4E41] hover:text-[#2B2118]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver al sitio público</span>
          </button>

          <div className="flex items-center gap-2.5 pt-2">
            <Lock className="w-5 h-5 text-[#2F4B3A]" strokeWidth={1.75} aria-hidden="true" />
            <h1 className="font-display text-2xl font-semibold text-[#2F4B3A]">
              Acceso del administrador
            </h1>
          </div>
          <p className="text-sm text-[#5C4E41]">
            Área interna exclusiva para la gestión de adopciones, tienda, donaciones y comunidad.
          </p>
        </div>

        <div className="p-4 rounded-[12px] bg-[#EADFCB]/70 border border-[#D9CBB3] text-sm space-y-2">
          <p className="font-semibold text-[#2B2118]">Cuenta de demostración (Administrador)</p>
          <p className="text-[#5C4E41]">
            Correo: <span className="font-semibold text-[#2B2118]">admin@huellitas.bo</span>
            <br />
            Contraseña: <span className="font-semibold text-[#2B2118]">demo1234</span>
          </p>
          <button
            type="button"
            onClick={fillDemo}
            className="text-sm font-semibold text-[#C4572F] hover:underline"
          >
            Rellenar credenciales demo
          </button>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="p-3.5 rounded-[12px] bg-[#A33A2A]/10 border border-[#A33A2A]/30 text-[#A33A2A] text-sm flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="adm-email" className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              id="adm-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@huellitas.bo"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
            />
          </div>

          <div>
            <label htmlFor="adm-pass" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              id="adm-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
            />
          </div>

          <button type="submit" className="w-full py-3 px-4 btn-bosque text-base">
            Ingresar al panel
          </button>
        </form>
      </div>
    </div>
  );
};
