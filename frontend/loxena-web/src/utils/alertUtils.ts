import Swal from 'sweetalert2';

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