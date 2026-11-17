import type { Location } from '../types/Location';

interface LocationListProps {
  locations: Location[];
  onExcluir: (id: string) => void;
  onEditar: (location: Location) => void;
}

export function LocationList({ locations, onExcluir, onEditar }: LocationListProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Localizações Cadastradas</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {locations.length} itens
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.length === 0 ? (
          <p className="text-gray-500 col-span-2 text-center py-4">Nenhuma localização cadastrada.</p>
        ) : (
          locations.map((loc) => (
            <div key={loc.id} className="flex flex-col items-start justify-between gap-3 rounded-lg border border-gray-200 p-3 transition hover:shadow-lg sm:flex-row sm:items-center sm:p-4">
            
              <div>
                <h3 className="break-words text-lg font-bold text-gray-800">{loc.code}</h3>
                <p className="break-words text-sm text-gray-500">{loc.description}</p>
              </div>

              <div className="flex flex-row gap-2 self-end sm:self-auto">
                <button 
                  onClick={() => onEditar(loc)}
                  className="shrink-0 rounded-md p-2 text-blue-500 transition hover:bg-blue-50 hover:text-blue-700"
                  title="Editar Localização"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.89l12.683-12.683z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.875 4.5" />
                  </svg>
                </button>

                <button 
                  onClick={() => onExcluir(loc.id)}
                  className="shrink-0 rounded-md p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                  title="Excluir Localização"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}