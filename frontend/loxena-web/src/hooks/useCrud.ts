import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { confirmarExclusao } from '../utils/alertUtils';

export interface CrudService<T, TPayload> {
  getAll: () => Promise<T[]>;
  create: (data: TPayload) => Promise<T>;
  update: (id: string, data: TPayload) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

export function useCrud<T extends { id: string }, TPayload>(
  service: CrudService<T, TPayload>,
  nomeEntidade: string ,
  genero: 'M' | 'F' = 'M'
) {
  const [items, setItems] = useState<T[]>([]);
  const [itemEmEdicao, setItemEmEdicao] = useState<T | null>(null);

  const sufixo = genero === 'M' ? 'o' : 'a';
  const pronome = genero === 'M' ? 'este' : 'esta';

  const carregarDados = useCallback(async () => {
    try {
      const dados = await service.getAll();
      setItems(dados);
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error(`Erro ao carregar ${nomeEntidade}:`, mensagem);
    }
  }, [service, nomeEntidade]);

  useEffect(() => {
    const fetchInicial = async () => {
      await carregarDados();
    };
    
    fetchInicial();
  }, [carregarDados]);

  const salvar = async (payload: TPayload) => {
    try {
      if (itemEmEdicao) {
        await service.update(itemEmEdicao.id, payload);
        toast.success(`${nomeEntidade} atualizad${sufixo} com sucesso!`);
      } else {
        await service.create(payload);
        toast.success(`${nomeEntidade} criad${sufixo} com sucesso!`);
      }
      await carregarDados();
      setItemEmEdicao(null);
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      toast.error(`Não foi possível salvar: ${mensagem}`);
    }
  };

  const excluir = async (id: string) => {
    const confirmou = await confirmarExclusao(`${pronome} ${nomeEntidade.toLowerCase()}`);
    if (!confirmou) return;

    try {
      await service.delete(id);
      await carregarDados();
      if (itemEmEdicao?.id === id) {
        setItemEmEdicao(null);
      }
      toast.success(`${nomeEntidade} excluíd${sufixo} com sucesso!`);
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido';
      toast.error(`Não foi possível excluir: ${mensagem}`);
    }
  };

  const editar = (item: T) => {
    setItemEmEdicao(item);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const topo = document.getElementById('topo-pagina');
      if (topo){
        topo.scrollIntoView({ behavior: 'smooth' , block: 'start' });
      }
    }, 100)
  };

  const cancelarEdicao = () => setItemEmEdicao(null);

  return { items, itemEmEdicao, salvar, excluir, editar, cancelarEdicao };
}