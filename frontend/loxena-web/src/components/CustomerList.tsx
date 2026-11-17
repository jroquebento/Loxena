import { useState } from 'react';
import type { Customer } from '../types/Customer';
import { SearchInput } from './SearchInput';
import { normalizeSearchText } from '../utils/searchUtils';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  const [valorBusca, definirValorBusca] = useState('');
  const buscaNormalizada = normalizeSearchText(valorBusca);
  const clientesFiltrados = customers.filter((cliente) =>
    normalizeSearchText(cliente.name).includes(buscaNormalizada) ||
    normalizeSearchText(cliente.email).includes(buscaNormalizada) ||
    normalizeSearchText(cliente.document).includes(buscaNormalizada)
  );

  return (
    <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Lista de Clientes</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {clientesFiltrados.length} registros
        </span>
      </div>

      <SearchInput
        valor={valorBusca}
        aoAlterar={definirValorBusca}
        placeholder="Buscar por nome, e-mail ou documento..."
      />

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th className="w-1/5 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {customers.length === 0 ? 'Nenhum cliente cadastrado.' : 'Nenhum cliente corresponde à busca.'}
                </td>
              </tr>
            ) : (
              clientesFiltrados.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 break-words">{customer.name}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 truncate" title={customer.email}>{customer.email}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 break-words">{customer.document}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 break-words">{customer.phone}</td>
                  <td className="px-3 py-4 text-center text-sm font-medium">
                    <div className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <button 
                        onClick={() => onEdit(customer)}
                        className="rounded-md bg-blue-50 px-3 py-1 text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => onDelete(customer.id)}
                        className="rounded-md bg-red-50 px-3 py-1 text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {clientesFiltrados.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            {customers.length === 0 ? 'Nenhum cliente cadastrado.' : 'Nenhum cliente corresponde à busca.'}
          </p>
        ) : (
          clientesFiltrados.map((customer) => (
            <article key={customer.id} className="rounded-lg border border-gray-200 p-3">
              <h3 className="break-words font-semibold text-gray-900">{customer.name}</h3>
              <dl className="mt-2 space-y-1 text-sm">
                <div>
                  <dt className="inline font-medium text-gray-700">E-mail: </dt>
                  <dd className="inline break-words text-gray-600">{customer.email}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-gray-700">Doc: </dt>
                  <dd className="inline break-words text-gray-600">{customer.document}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-gray-700">Tel: </dt>
                  <dd className="inline break-words text-gray-600">{customer.phone}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-row gap-2">
                <button
                  onClick={() => onEdit(customer)}
                  className="flex-1 whitespace-nowrap rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(customer.id)}
                  className="flex-1 whitespace-nowrap rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  Excluir
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}