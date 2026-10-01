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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 id="topo-pagina" className="text-4xl font-bold text-blue-800 text-center mb-8">
        Gestão de Localizações
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