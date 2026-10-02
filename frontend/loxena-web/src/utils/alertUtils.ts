import Swal from 'sweetalert2';
import type { Location } from '../types/Location';

export async function confirmarExclusao(item: string = "este item"): Promise<boolean> {
  const resultado = await Swal.fire({
    title: 'Tem certeza?',
    text: `Você está prestes a excluir ${item}. Esta ação não pode ser desfeita.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  });

  return resultado.isConfirmed;
}

export async function solicitarDadosTransferencia(
  produtoNome: string,
  localOrigemCodigo: string,
  maxAmount: number,
  localizacoesDisponiveis: Location[]
): Promise<{ targetLocationId: string; amount: number } | null> {
  
  const optionsHtml = localizacoesDisponiveis
    .map(l => `<option value="${l.id}">${l.code} - ${l.description}</option>`)
    .join('');

  const { value } = await Swal.fire({
    title: 'Transferir Estoque',
    html: `
      <div style="text-align: left; margin-bottom: 1rem; font-size: 0.9rem; color: #4B5563;">
        <p><strong>Produto:</strong> ${produtoNome}</p>
        <p><strong>Origem:</strong> ${localOrigemCodigo}</p>
        <p><strong>Saldo Disponível:</strong> <span style="color: #16A34A; font-weight: bold;">${maxAmount}</span></p>
      </div>
      
      <div style="text-align: left; margin-bottom: 0.5rem;">
        <label style="font-size: 0.875rem; font-weight: 500;">Local de Destino:</label>
        <select id="swal-dest" class="swal2-select" style="display: flex; width: 100%; margin: 5px 0 15px 0;">
          <option value="" disabled selected>Selecione o destino...</option>
          ${optionsHtml}
        </select>
      </div>

      <div style="text-align: left;">
        <label style="font-size: 0.875rem; font-weight: 500;">Quantidade:</label>
        <input id="swal-amount" type="number" min="1" max="${maxAmount}" class="swal2-input" placeholder="Ex: 5" style="display: flex; width: 100%; margin: 5px 0; box-sizing: border-box;">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Confirmar Transferência',
    confirmButtonColor: '#9333EA',
    cancelButtonText: 'Cancelar',
    focusConfirm: false,
    preConfirm: () => {
      const targetLocationId = (document.getElementById('swal-dest') as HTMLSelectElement).value;
      const amount = (document.getElementById('swal-amount') as HTMLInputElement).value;

      if (!targetLocationId) {
        Swal.showValidationMessage('Selecione a localização de destino.');
        return false;
      }
      if (!amount || Number(amount) <= 0 || Number(amount) > maxAmount) {
        Swal.showValidationMessage(`Informe uma quantidade válida (máx: ${maxAmount}).`);
        return false;
      }

      return { targetLocationId, amount: Number(amount) };
    }
  });

  return value || null; 
}