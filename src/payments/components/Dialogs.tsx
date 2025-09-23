import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AlertMsgDialog({
  alertMsg,
  onClose,
}: {
  alertMsg: string | null;
  onClose: () => void;
}) {
  return (
    <AlertDialog open={!!alertMsg} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Atención</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>{alertMsg}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  total,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  total: number;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar pago</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          ¿Está seguro de pagar los meses seleccionados por un total de ${total}
          ?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Sí, pagar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
