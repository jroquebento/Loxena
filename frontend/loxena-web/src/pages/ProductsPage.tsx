import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';
import type { Category } from '../types/Category';
import { productService, type ProductPayload } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductForm } from '../components/ProductForm';
import { ProductList } from '../components/ProductList';
import {useCrud} from '../hooks/useCrud';

export function ProductsPage() {
  const {
    items: produtos,
    itemEmEdicao: produtoEmEdicao,
    salvar,
    excluir,
    editar,
    cancelarEdicao
  } = useCrud<Product, ProductPayload>(productService, 'Produto');

  const [categorias, setCategorias] = useState<Category[]>([]);
  useEffect(() =>{
    categoryService.getAll().then(setCategorias).catch(console.error);
  }, []);

  const handleSalvarProduto = (name:string, description:string, price: number , categoryId: string) => {
    salvar({name, description, price, categoryId});
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 id="topo-pagina" className="text-4xl font-bold text-blue-800 text-center mb-8">
          Painel Loxena
        </h1>
        
        <ProductForm 
          key={produtoEmEdicao ? produtoEmEdicao.id : 'novo'} 
          categorias={categorias} 
          onSalvar={handleSalvarProduto} 
          produtoSelecionado={produtoEmEdicao}
          onCancelar={cancelarEdicao} 
        />
        <ProductList 
          produtos={produtos} 
          categorias={categorias}
          onExcluir={excluir}
          onEditar={editar}
        />

      </div>
    </div>
  );
}