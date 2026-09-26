import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';
import type { Category } from '../types/Category';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductForm } from '../components/ProductForm';
import { ProductList } from '../components/ProductList';

export function ProductsPage() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);

  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Product | null>(null);
 
  const carregarDados = () => {
    productService.getAll().then(dados => setProdutos(dados)).catch(erro => console.error(erro));
    categoryService.getAll().then(dados => setCategorias(dados)).catch(erro => console.error(erro));
  };
 
  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarProduto = (nome: string, descricao: string, preco: number, categoryId: string) => {
    if (produtoEmEdicao) {

      productService.update(produtoEmEdicao.id, nome, descricao, preco, categoryId)

        .then(() => {
          carregarDados();
          setProdutoEmEdicao(null);
        })
        .catch(erro => console.error("Erro grave no PUT:", erro));
    } else {
      productService.create(nome, descricao, preco, categoryId)
        .then(() => carregarDados())
        .catch(erro => console.error("Erro grave no POST:", erro));
    }
  };

  const handleExcluirProduto = (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir este produto?')){
      productService.delete(id)
        .then(() => {
          carregarDados();
          
          if (produtoEmEdicao && produtoEmEdicao.id === id){
            setProdutoEmEdicao(null);
          }
        })
        .catch(erro => console.error("Erro ao excluir:", erro))
    }
  };

  const handleEditarProduto = (produto: Product) => {
    setProdutoEmEdicao(produto);
    window.scrollTo ({top: 0, behavior: 'smooth'});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
          Painel Loxena
        </h1>
        
        <ProductForm 
          key={produtoEmEdicao ? produtoEmEdicao.id : 'novo'} 
          categorias={categorias} 
          onSalvar={handleSalvarProduto} 
          produtoSelecionado={produtoEmEdicao}
          onCancelar={() => setProdutoEmEdicao(null)} 
        />
        <ProductList 
          produtos={produtos} 
          onExcluir={handleExcluirProduto}
          onEditar={handleEditarProduto}
        />

      </div>
    </div>
  );
}