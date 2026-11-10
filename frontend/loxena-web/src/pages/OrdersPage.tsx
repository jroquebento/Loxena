import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { OrderList } from '../components/OrderList';

export function OrdersPage() {
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate(); 

  const handleViewDetails = (id: string) => {
    
    navigate(`/pedidos/operar/${id}`);
  };

  const handleNovoPedido = () => {
    alert(`Preparando terreno: A tela de criação (carrinho) será construída na Fase 2.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
          Gestão de Pedidos
        </h1>

        <div className="flex justify-end mb-4">
          <button 
            onClick={handleNovoPedido}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition shadow-md"
          >
            + Novo Pedido
          </button>
        </div>
        
        <OrderList 
          orders={orders}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}