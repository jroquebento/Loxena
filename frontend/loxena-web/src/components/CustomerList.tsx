import type { Customer } from '../types/Customer';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Lista de Clientes</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {customers.length} registros
        </span>
      </div>

      <div className="overflow-x-auto">
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
            {customers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Nenhum cliente cadastrado.</td></tr>
            ) : (
              customers.map((customer) => (
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
    </div>
  );
}