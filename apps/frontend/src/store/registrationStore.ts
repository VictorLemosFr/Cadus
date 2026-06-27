import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'paciente' | 'profissional' | null;

interface UserData {
  nome: string;
  nomeSocial: string;
  primeiroNome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone: string;
}

export interface PatientData extends UserData {
  dataNascimento: string;
  genero: string;
  sexo: string;
  pronomes: string[];
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cartaoSus: string;
  comoChegou: string;
  temResponsavel: boolean;
  nomeResponsavel: string;
  queixa: string;
}

interface RegistrationState {
  role: UserRole;
  roleStep: boolean;
  patientStep: number;
  userData: Partial<UserData>
  patientData: Partial<PatientData>;
  isRegistered: boolean;
  registeredRole: UserRole;
  setRole: (role: UserRole) => void;
  setRoleStep: (flag: boolean) => void;
  setPatientStep: (step: number) => void;
  updateUserData: (data: Partial<UserData>) => void
  updatePatientData: (data: Partial<PatientData>) => void;
  completeRegistration: () => void;
  reset: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      role: null,
      roleStep: true,
      patientStep: 2,
      userData: {},
      patientData: {},
      isRegistered: false,
      registeredRole: null,
      setRole: (role) => set({ role }),
      setRoleStep: (flag) => set({ roleStep: flag }),
      setPatientStep: (step) => set({ patientStep: step }),
      updateUserData: (data) =>
        set((state) => ({ userData: { ...state.userData, ...data } })),
      updatePatientData: (data) =>
        set((state) => ({ patientData: { ...state.patientData, ...data } })),
      completeRegistration: () =>
        set((state) => ({ isRegistered: true, registeredRole: state.role })),
      reset: () =>
        set({
          role: null,
          roleStep: true,
          patientStep: 2,
          userData: {},
          patientData: {},
          isRegistered: false,
          registeredRole: null,
        }),
    }),
    { name: 'cadus-registration' }
  )
);

// Mock patients
export const mockPatients = [
  {
    id: '1',
    nome: 'Maria das Graças Silva',
    cpf: '123.456.789-00',
    cpfMasked: '123.XXX.XXX-00',
    dataNascimento: '15/03/1958',
    sexo: 'Feminino',
    telefone: '(81) 99876-5432',
    email: '',
    bairro: 'Várzea',
    cidade: 'Recife',
    estado: 'PE',
    cartaoSus: '898 0012 3456 7890',
    comoChegou: 'Encaminhado pelo SUS',
    queixa: 'Estou com dificuldade para engolir há alguns meses e sinto dor ao falar. Às vezes a comida parece que fica presa na garganta.',
    dataCadastro: '10/03/2026',
    ultimaAtualizacao: '12/03/2026 às 14:32',
  },
  {
    id: '2',
    nome: 'José Carlos Ferreira',
    cpf: '987.654.321-00',
    cpfMasked: '987.XXX.XXX-00',
    dataNascimento: '22/07/1972',
    sexo: 'Masculino',
    telefone: '(81) 98765-4321',
    email: 'jose.ferreira@email.com',
    bairro: 'Boa Viagem',
    cidade: 'Recife',
    estado: 'PE',
    cartaoSus: '',
    comoChegou: 'Vim por conta própria',
    queixa: 'Minha voz está falhando muito quando falo por mais tempo. Sou professor e isso está atrapalhando meu trabalho.',
    dataCadastro: '08/03/2026',
    ultimaAtualizacao: '08/03/2026 às 10:15',
  },
  {
    id: '3',
    nome: 'Ana Beatriz Santos',
    cpf: '456.789.123-00',
    cpfMasked: '456.XXX.XXX-00',
    dataNascimento: '01/12/1990',
    sexo: 'Feminino',
    telefone: '(81) 97654-3210',
    email: 'ana.santos@email.com',
    bairro: 'Casa Forte',
    cidade: 'Recife',
    estado: 'PE',
    cartaoSus: '898 0098 7654 3210',
    comoChegou: 'Encaminhado pelo SUS',
    queixa: 'Meu filho de 4 anos ainda não fala direito. Ele troca muitas letras e às vezes não consigo entender o que ele quer dizer.',
    dataCadastro: '05/03/2026',
    ultimaAtualizacao: '11/03/2026 às 09:00',
  },
];
