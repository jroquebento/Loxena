import { useState, useEffect } from 'react';
import type { Category } from '../types/Category';
import { categoryService } from '../services/categoryService';
import { CategoryForm } from '../components/CategoryForm';
import { CategoryList } from '../components/CategoryList';

export function CategoriesPage() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<Category | null>(null);

  const carregarDados = () => {
    categoryService.getAll().then(setCategorias).catch(console.error);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarCategoria = (nome: string) => {
    if (categoriaEmEdicao) {
      categoryService.update(categoriaEmEdicao.id, nome)
        .then(() => {
          carregarDados();
          setCategoriaEmEdicao(null);
        })
        .catch(erro => console.error("Erro ao atualizar:", erro));
    } else {
      categoryService.create(nome)
        .then(() => carregarDados())
        .catch(erro => console.error("Erro ao salvar:", erro));
    }
  };

  const handleExcluirCategoria = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      categoryService.delete(id)
        .then(() => {
          carregarDados();
          if (categoriaEmEdicao && categoriaEmEdicao.id === id) {
            setCategoriaEmEdicao(null);
          }
        })
        .catch(erro => {
          console.error("Erro ao excluir:", erro);
          alert(`Não foi possível excluir: ${erro.message}`);
        });
    }
  };

  const handleEditarCategoria = (categoria: Category) => {
    setCategoriaEmEdicao(categoria);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
        Gestão de Categorias
      </h1>
      
      <CategoryForm 
        key={categoriaEmEdicao ? categoriaEmEdicao.id : 'novo'} 
        onSalvar={handleSalvarCategoria} 
        categoriaSelecionada={categoriaEmEdicao}
        onCancelar={() => setCategoriaEmEdicao(null)} 
      />
      
      <CategoryList 
        categorias={categorias} 
        onExcluir={handleExcluirCategoria}
        onEditar={handleEditarCategoria}
      />
    </div>
  );
}