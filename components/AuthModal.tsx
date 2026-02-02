import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, LoadingSpinnerIcon } from './icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For simulation, use provided name or derive from email if sign-in
    const displayName = isSignUp 
      ? formData.name 
      : (formData.email.split('@')[0] || 'Architect');

    onAuthSuccess({
      name: displayName,
      email: formData.email
    });
    
    setIsLoading(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-vesper-cream/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white border-[1.5px] border-black rounded-[2.5rem] shadow-2xl p-10 md:p-16 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>

            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif italic mb-4">
                {isSignUp ? 'Join the Forge' : 'Welcome Back'}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-vesper-muted">
                Architect your workflow with precision
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {isSignUp && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-vesper-muted">Full Name</label>
                  <input
                    required
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="vesper-input-line w-full py-2 text-lg focus:outline-none"
                    placeholder="ALEX ARCHITECT"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-vesper-muted">Email Address</label>
                <input
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="vesper-input-line w-full py-2 text-lg focus:outline-none"
                  placeholder="DESIGNER@VESPER.COM"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-vesper-muted">Password</label>
                <input
                  required
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="vesper-input-line w-full py-2 text-lg focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div className="mt-4 flex flex-col gap-6 items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="vesper-button w-full py-5 bg-vesper-pink flex items-center justify-center gap-4 hover:bg-black hover:text-white transition-all disabled:opacity-50"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    {isLoading ? 'PROCESSING...' : (isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN')}
                  </span>
                  {!isLoading && <span className="text-xl">→</span>}
                  {isLoading && <LoadingSpinnerIcon className="w-4 h-4 animate-spin" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[10px] font-bold uppercase tracking-widest text-vesper-muted hover:text-black transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};