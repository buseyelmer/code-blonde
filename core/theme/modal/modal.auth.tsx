import React, { useImperativeHandle, useMemo, useState } from 'react';
import { Modal } from 'rizzui';
import { X } from 'lucide-react';
import ViewLogin from '../view/view.login';
import ViewRegister from '../view/view.register';
import { useRaxon } from '@raxonltd/raxon-core';
import { GeneralImage } from '@raxonltd/raxon-core/component'
import { usePathname } from 'next/navigation';
import queryString from 'query-string';

export interface ModalAuthProps {}
export interface ModalAuthRef {
  open: (defaultTab?: 'login' | 'register', queries?: any) => void;
  close: () => void;
}

export const ModalAuth = React.forwardRef<ModalAuthRef, ModalAuthProps>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [queries, setQueries] = useState<any>({});
  const { branch } = useRaxon();

  const pathname = usePathname();

  const returnUrl = useMemo(() => {

    
    return queryString.stringify(queries);
  }, [pathname, queries]);

  useImperativeHandle(ref, () => ({
    open: (defaultTab = 'login', queries?: any) => {
      setActiveTab(defaultTab);
      setQueries(queries ?? {});
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    },
  }));

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} customSize={400} overlayClassName="backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-2xl">
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-6 px-8">
          <div className="flex justify-center mb-4">
            <GeneralImage quality={85} src={branch?.logoMedia?.relativePath ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${branch?.logoMedia?.relativePath}` : ''} alt="logo" width={180} height={40} className="h-8 w-auto object-contain" />
          </div>
          <p className="text-black/80 text-sm font-light uppercase tracking-wider">{activeTab === 'login' ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-black/10 mx-8">
          <button onClick={() => setActiveTab('login')} className={`flex-1 py-3 text-sm font-black uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'login' ? 'border-black text-black' : 'border-transparent text-black/80 hover:text-black'}`}>
            Giriş Yap
          </button>
          <button onClick={() => setActiveTab('register')} className={`flex-1 py-3 text-sm font-black uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'register' ? 'border-black text-black' : 'border-transparent text-black/80 hover:text-black'}`}>
            Kayıt Ol
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'login' && <ViewLogin onClose={handleClose} returnUrl={returnUrl} />}
          {activeTab === 'register' && <ViewRegister onClose={handleClose} onSwitchToLogin={() => setActiveTab('login')} />}
        </div>
      </div>
    </Modal>
  );
});
