import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cog6ToothIcon as CogIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const UserSetup = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    clientId: '',
    apiKey: '',
    projectId: ''
  });

  const steps = [
    {
      title: 'Google Cloud Console',
      description: 'Primeiro, vamos criar um projeto no Google Cloud Console',
      link: 'https://console.cloud.google.com',
      action: 'Ir para Console',
      fields: []
    },
    {
      title: 'Ativar Google Calendar API',
      description: 'Ative a API do Google Calendar para seu projeto',
      link: 'https://console.cloud.google.com/apis/library/calendar-json.googleapis.com',
      action: 'Ativar API',
      fields: ['projectId']
    },
    {
      title: 'Configurar Credenciais',
      description: 'Configure as credenciais OAuth 2.0',
      link: 'https://console.cloud.google.com/apis/credentials',
      action: 'Criar Credenciais',
      fields: ['clientId', 'apiKey']
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
      toast.success('Próximo passo!');
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Salvar credenciais
    localStorage.setItem('googleCredentials', JSON.stringify(credentials));
    toast.success('Configuração concluída!');
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-4 right-4 p-4 rounded-full ${
          theme === 'dark' 
            ? 'bg-purple-600 hover:bg-purple-700' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg`}
        onClick={() => setIsOpen(true)}
      >
        <CogIcon className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <Dialog
            as={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

              <div className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform ${
                theme === 'dark'
                  ? 'bg-gray-900 text-purple-300 border border-purple-500'
                  : 'bg-white text-gray-900'
              } shadow-xl rounded-2xl`}>
                <Dialog.Title
                  as="h3"
                  className={`text-lg font-medium leading-6 ${
                    theme === 'dark' ? 'text-purple-300' : 'text-gray-900'
                  }`}
                >
                  {steps[step - 1].title}
                </Dialog.Title>

                <div className="mt-2">
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {steps[step - 1].description}
                  </p>

                  {steps[step - 1].fields.map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field}
                      className={`mt-4 w-full p-2 rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-purple-300 border-purple-500'
                          : 'bg-gray-100 text-gray-900 border-gray-300'
                      }`}
                      value={credentials[field]}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        [field]: e.target.value
                      })}
                    />
                  ))}

                  <a
                    href={steps[step - 1].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block mt-4 px-4 py-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {steps[step - 1].action}
                  </a>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-purple-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={handleNext}
                  >
                    {step === steps.length ? 'Concluir' : 'Próximo'}
                  </button>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-4 left-4 p-4 rounded-full ${
          theme === 'dark'
            ? 'bg-purple-600 hover:bg-purple-700'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg`}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? (
          <SunIcon className="w-6 h-6" />
        ) : (
          <MoonIcon className="w-6 h-6" />
        )}
      </motion.button>
    </>
  );
};

export default UserSetup; 