/**
 * authStore — estado global da sessão autenticada.
 *
 * Separado do registrationStore para que o fluxo de cadastro
 * não carregue estado de sessão e vice-versa.
 *
 * A chave "cadus-auth" no persist é a mesma que o getToken()
 * dentro de api.ts lê — não mude sem atualizar os dois.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "./registrationStore";

interface AuthState {
  token: string | null;
  cpf: string | null;
  papel: UserRole;

  setSession: (token: string, cpf: string, papel: UserRole) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      cpf:   null,
      papel: null,

      setSession: (token, cpf, papel) => set({ token, cpf, papel }),

      clearSession: () => set({ token: null, cpf: null, papel: null }),

      isAuthenticated: () => get().token !== null,
    }),
    { name: "cadus-auth" }
  )
);