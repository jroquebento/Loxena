import { useState, useEffect } from 'react';
import type { Product } from './types/Product';
import type { Category } from './types/Category';
import { productService } from './services/productService';
import { categoryService } from './services/categoryService';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';

export default function App() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
 
  const carregarDados = () => {
    productService.getAll().then(dados => setProdutos(dados)).catch(erro => console.error(erro));
    categoryService.getAll().then(dados => setCategorias(dados)).catch(erro => console.error(erro));
  };
 
  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarProduto = (nome: string, descricao: string, preco: number, categoryId: string) => {
    productService.create(nome, descricao, preco, categoryId)
      .then(() => carregarDados())
      .catch(erro => console.error("Erro ao salvar:", erro));
  };

  const handleExcluirProduto = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir este produto?')){
      productService.delete(id)
        .then(() => carregarDados())
        .catch(erro => console.error("Erro ao excluir:", erro))
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
          Painel Loxena
        </h1>
        
        <ProductForm categorias={categorias} onSalvar={handleSalvarProduto} />
        <ProductList produtos={produtos} onExcluir={handleExcluirProduto}/>

      </div>
    </div>
  );
}