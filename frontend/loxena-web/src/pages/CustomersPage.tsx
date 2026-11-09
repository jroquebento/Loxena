import { CustomerForm } from '../components/CustomerForm';
import { CustomerList } from '../components/CustomerList';
import { customerService, type CustomerPayload } from '../services/customerService';
import { useCrud } from '../hooks/useCrud';
import type { Customer } from '../types/Customer';

export function CustomersPage() {
  const {
    items: customers,
    itemEmEdicao: customerEmEdicao,
    salvar,
    excluir,
    editar,
    cancelarEdicao
  } = useCrud<Customer, CustomerPayload>(customerService, 'Cliente');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 id="topo-pagina" className="text-4xl font-bold text-blue-800 text-center mb-8">
          Gestão de Clientes
        </h1>
        
        <CustomerForm 
          key={customerEmEdicao ? customerEmEdicao.id : 'novo'}
          customerToEdit={customerEmEdicao}
          onSave={salvar}
          onCancelEdit={cancelarEdicao}
        />
        
        <CustomerList 
          customers={customers}
          onEdit={editar}
          onDelete={excluir}
        />

      </div>
    </div>
  );
}