import type { Product } from '../types/Product';

interface ProductListProps {
  produtos: Product[];
  onExcluir: (id: string) => void;
}

export function ProductList({ produtos, onExcluir }: ProductListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Produtos Cadastrados</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {produtos.length} itens
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produtos.map((produto) => (
          <div key={produto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition flex justify-between items-start">
            
            <div>
              <h3 className="font-bold text-lg text-gray-800">{produto.name}</h3>
              <p className="text-green-600 font-bold text-xl mt-2">
                R$ {produto.price.toFixed(2)}
              </p>
            </div>

            <button 
              onClick={() => onExcluir(produto.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition cursor-pointer"
              title="Excluir Produto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}