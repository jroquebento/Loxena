import type { Location } from '../types/Location';
import { locationService, type LocationPayload } from '../services/locationService';
import { LocationForm } from '../components/LocationForm';
import { LocationList } from '../components/LocationList';
import { useCrud } from '../hooks/useCrud';

export function LocationsPage() {
  const {
    items: locations,
    itemEmEdicao: locationEmEdicao,
    salvar,
    excluir,
    editar,
    cancelarEdicao
  } = useCrud<Location, LocationPayload>(locationService, 'Localização', 'F');

  const handleSalvarLocation = (code: string, description: string) => {
    salvar({ code, description });
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <h1 id="topo-pagina" className="mb-8 text-2xl font-bold text-blue-800 text-center sm:text-3xl lg:text-4xl">
        Posições de Armazenagem
      </h1>
      
      <LocationForm 
        key={locationEmEdicao ? locationEmEdicao.id : 'novo'} 
        onSalvar={handleSalvarLocation} 
        locationSelecionada={locationEmEdicao}
        onCancelar={cancelarEdicao} 
      />
      
      <LocationList 
        locations={locations} 
        onExcluir={excluir}
        onEditar={editar}
      />
    </div>
  );
}