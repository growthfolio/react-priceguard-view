import { toast, ToastOptions, ToastPosition } from "react-toastify";

// Enum para tipos de notificações
export enum ToastType {
  SUCCESS = "sucesso",
  INFO = "info",
  ERROR = "error",
}

// Mensagens centralizadas
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login realizado com sucesso!",
    LOGIN_ERROR: "Erro ao realizar login. Verifique suas credenciais.",
    LOGOUT_SUCCESS: "Logout realizado com sucesso.",
    SESSION_EXPIRED: "Sessão expirada. Por favor, faça login novamente.",
  },
  CONFIG: {
    SAVE_SUCCESS: "Alterações salvas com sucesso!",
    SAVE_ERROR: "Erro ao salvar alterações. Tente novamente.",
  },
  GENERAL: {
    NETWORK_ERROR: "Erro de conexão com o servidor. Verifique sua internet.",
    UNKNOWN_ERROR: "Algo deu errado. Por favor, tente novamente.",
  },
};

// Função genérica para exibir notificações
export function toastAlert(message: string, type: ToastType, toastId?: string): void {
  const config: ToastOptions = {
    toastId, // Identificador único para evitar duplicação
    position: "top-right" as ToastPosition,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    theme: "colored",
    progress: undefined,
  };

  switch (type) {
    case ToastType.SUCCESS:
      toast.success(message, config);
      break;
    case ToastType.INFO:
      toast.info(message, config);
      break;
    case ToastType.ERROR:
      toast.error(message, config);
      break;

    default:
      toast.info(message, config);
      break;
  }
}
