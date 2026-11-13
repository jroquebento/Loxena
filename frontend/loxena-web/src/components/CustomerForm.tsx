import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Customer } from '../types/Customer';
import type { CustomerPayload } from '../services/customerService';

interface CustomerFormProps {
  onSave: (data: CustomerPayload) => Promise<void>;
  customerToEdit?: Customer | null;
  onCancelEdit?: () => void;
}

export function CustomerForm({ onSave, customerToEdit, onCancelEdit }: CustomerFormProps) {
  const [name, setName] = useState(customerToEdit?.name || '');
  const [email, setEmail] = useState(customerToEdit?.email || '');
  const [document, setDocument] = useState(customerToEdit?.document || '');
  const [phone, setPhone] = useState(customerToEdit?.phone || '');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const nameLimpo = name.trim();
    const emailLimpo = email.trim();
    const documentLimpo = document.trim();
    const phoneLimpo = phone.trim();

    if (!nameLimpo) {
      toast.warn('Informe o nome do cliente.');
      return;
    }
    if (nameLimpo.length > 200) {
      toast.warn('O nome do cliente não pode exceder 200 caracteres.');
      return;
    }
    if (!emailLimpo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      toast.warn('Informe um e-mail válido.');
      return;
    }
    if (emailLimpo.length > 150) {
      toast.warn('O e-mail não pode exceder 150 caracteres.');
      return;
    }
    if (!documentLimpo) {
      toast.warn('Informe o documento do cliente.');
      return;
    }
    if (documentLimpo.length > 20) {
      toast.warn('O documento não pode exceder 20 caracteres.');
      return;
    }
    if (!phoneLimpo) {
      toast.warn('Informe o telefone do cliente.');
      return;
    }
    if (phoneLimpo.length > 20) {
      toast.warn('O telefone não pode exceder 20 caracteres.');
      return;
    }

    await onSave({ name: nameLimpo, email: emailLimpo, document: documentLimpo, phone: phoneLimpo });

    if (!customerToEdit) {
      setName('');
      setEmail('');
      setDocument('');
      setPhone('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {customerToEdit ? 'Editar Cliente' : 'Novo Cliente'}
      </h2>
      
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Nome da empresa ou pessoa *" required maxLength={200}
          value={name} onChange={(e) => setName(e.target.value)} 
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input 
          type="email" placeholder="email@exemplo.com *" required maxLength={150}
          value={email} onChange={(e) => setEmail(e.target.value)} 
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Documento (CPF/CNPJ) *" required maxLength={20}
            value={document} onChange={(e) => setDocument(e.target.value)} 
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input 
            type="text" placeholder="Telefone (ex: 11 99999-9999) *" required maxLength={20}
            value={phone} onChange={(e) => setPhone(e.target.value)} 
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition flex-1">
            {customerToEdit ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
          </button>
          
          {customerToEdit && onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition w-1/3">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}