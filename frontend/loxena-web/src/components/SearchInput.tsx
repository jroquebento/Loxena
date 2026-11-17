interface SearchInputProps {
  valor: string;
  placeholder: string;
  aoAlterar: (valor: string) => void;
}

export function SearchInput({ valor, placeholder, aoAlterar }: SearchInputProps) {
  return (
    <div className="mb-4 flex w-full items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        >
          <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
          <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={valor}
          onChange={(evento) => aoAlterar(evento.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-md border border-gray-300 bg-white py-3 pl-10 pr-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
      {valor.length > 0 && (
        <button
          type="button"
          onClick={() => aoAlterar('')}
          className="shrink-0 rounded-md px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Limpar busca"
        >
          Limpar
        </button>
      )}
    </div>
  );
}
