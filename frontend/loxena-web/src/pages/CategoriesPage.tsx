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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 id="topo-pagina" className="text-4xl font-bold text-blue-800 text-center mb-8">
        Gestão de Categorias
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