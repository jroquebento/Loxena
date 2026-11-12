import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import { tratarErro } from '../utils/apiUtils';
import type { Customer } from '../types/Customer';
import type { Product } from '../types/Product';
import type { Stock } from '../types/Stock';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  maxStock: number;
}

export function CreateOrderPage() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [currentProductId, setCurrentProductId] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resCustomers, resProducts, resStocks] = await Promise.all([
          fetch('https://localhost:7175/Customers'),
          fetch('https://localhost:7175/Products'),
          fetch('https://localhost:7175/Stocks')
        ]);

        await tratarErro(resCustomers, 'Falha ao buscar clientes');
        await tratarErro(resProducts, 'Falha ao buscar produtos');
        await tratarErro(resStocks, 'Falha ao buscar estoque');

        setCustomers(await resCustomers.json());
        setProducts(await resProducts.json());
        setStocks(await resStocks.json());
      } catch (error: unknown) {
        console.error(error);
        const mensagem = error instanceof Error ? error.message : "Erro ao carregar dados.";
        toast.error(mensagem);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const getProductAvailableStock = (productId: string) => {
    return stocks
      .filter(s => s.productId === productId)
      .reduce((acc, s) => acc + s.availableQuantity, 0);
  };

  const getRemainingStock = (productId: string) => {
    const totalStock = getProductAvailableStock(productId);
    const itemInCart = cartItems.find(item => item.productId === productId);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    
    return totalStock - quantityInCart;
  };

  const productsWithStock = products.filter(p => getRemainingStock(p.id) > 0);
  const selectedProductStock = currentProductId ? getRemainingStock(currentProductId) : 0;

  const handleAddToCart = () => {
    if (!currentProductId) {
      toast.warn("Selecione um produto.");
      return;
    }
    if (!Number.isInteger(currentQuantity) || currentQuantity <= 0) {
      toast.warn("Informe uma quantidade inteira maior que zero.");
      return;
    }

    const productFound = products.find(p => p.id === currentProductId);
    if (!productFound) return;

    const availableStock = getProductAvailableStock(currentProductId);
    const existingInCart = cartItems.find(item => item.productId === currentProductId);
    const totalRequested = (existingInCart?.quantity || 0) + Number(currentQuantity);

    if (totalRequested > availableStock) {
      toast.error(`Estoque insuficiente! Disponível: ${availableStock}, Solicitado no total: ${totalRequested}.`);
      return;
    }

    if (existingInCart) {
      setCartItems(cartItems.map(item => 
        item.productId === currentProductId 
          ? { ...item, quantity: totalRequested }
          : item
      ));
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: productFound.id,
          productName: productFound.name,
          quantity: Number(currentQuantity),
          unitPrice: productFound.price,
          maxStock: availableStock
        }
      ]);
    }

    setCurrentProductId('');
    setCurrentQuantity(1);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const handleFinalizeOrder = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      toast.warn("Selecione um cliente para o pedido.");
      return;
    }
    if (cartItems.length === 0) {
      toast.warn("Adicione pelo menos um item ao carrinho.");
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.create({
        customerId: selectedCustomerId,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      toast.success("Pedido criado com sucesso!");
      navigate('/pedidos');
    } catch (error: unknown) {
      console.error(error);
      const mensagem = error instanceof Error ? error.message : "Erro ao criar pedido.";
      toast.error(mensagem);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return <div className="p-8 text-center text-gray-500">Carregando formulário e saldos de estoque...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate('/pedidos')}
          className="text-blue-600 hover:underline mb-4 flex items-center font-medium"
        >
          ← Voltar para lista
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Pedido (Carrinho WMS)</h2>

          <form onSubmit={handleFinalizeOrder} noValidate>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Selecione um cliente...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Adicionar Produtos</h3>
              <p className="text-xs text-gray-500 mb-4">Apenas produtos com saldo físico disponível em estoque são exibidos.</p>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produto (Disponível)</label>
                  <select
                    value={currentProductId}
                    onChange={(e) => setCurrentProductId(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um produto com estoque...</option>
                    {productsWithStock.map(p => {
                      const remaining = getRemainingStock(p.id);
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)} (Disponível: {remaining})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="w-36">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade {currentProductId && <span className="text-xs text-green-600 font-bold">(Máx: {selectedProductStock})</span>}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProductStock || 1}
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition h-10"
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Itens no Carrinho</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qtd</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-4 text-center text-gray-500 text-sm">
                          Nenhum item adicionado ao carrinho ainda.
                        </td>
                      </tr>
                    ) : (
                      cartItems.map((item) => (
                        <tr key={item.productId}>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.productName}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-500">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unitPrice)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(item.productId)}
                              className="text-red-600 hover:text-red-900 text-xs font-medium bg-red-50 px-2 py-1 rounded"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <span className="text-gray-600 text-sm mr-4">Total do Pedido:</span>
                  <span className="text-2xl font-bold text-green-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate('/pedidos')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-5 py-2 rounded-md transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Finalizar Pedido'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}