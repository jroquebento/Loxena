import type { Category } from '../types/Category';
import { categoryService , type CategoryPayload} from '../services/categoryService';
import { CategoryForm } from '../components/CategoryForm';
import { CategoryList } from '../components/CategoryList';
import { useCrud } from '../hooks/useCrud';

export function CategoriesPage() {
  const {
    items: categorias,
    itemEmEdicao: categoriaEmEdicao,
    salvar,
    excluir,
    editar,
    cancelarEdicao
  } = useCrud<Category, CategoryPayload>(categoryService, 'Categoria', 'F');

  const handleSalvarCategoria = (name: string) => {
    salvar( {name});
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <h1 id="topo-pagina" className="mb-8 text-2xl font-bold text-blue-800 text-center sm:text-3xl lg:text-4xl">
        Categorias de Produtos
      </h1>
      
      <CategoryForm 
        key={categoriaEmEdicao ? categoriaEmEdicao.id : 'novo'} 
        onSalvar={handleSalvarCategoria} 
        categoriaSelecionada={categoriaEmEdicao}
        onCancelar={cancelarEdicao} 
      />
      
      <CategoryList 
        categorias={categorias} 
        onExcluir={excluir}
        onEditar={editar}
      />
    </div>
  );
}