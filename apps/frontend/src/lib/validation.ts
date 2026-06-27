export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10]);
};

export const validateDate = (dateStr: string): boolean => {
  const dateRegex = /(?:((?:0[1-9]|1[0-9]|2[0-9])\/(?:0[1-9]|1[0-2])|(?:30)\/(?!02)(?:0[1-9]|1[0-2])|31\/(?:0[13578]|1[02]))\/(?:19|20)[0-9]{2})/;

  if (!dateRegex.test(dateStr)) return false;

  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const validLeapYear =
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day;

  return validLeapYear && date <= new Date();
};

export const validateText = (texto: string): string => {
  const lettersRegex = /[A-Za-záàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ]/;
  const repeatedCharaRegex = /(.)\1{9,}/;

  if (!texto?.trim() || texto.length < 10) return 'Por favor, descreva um pouco mais.';
  else if (repeatedCharaRegex.test(texto)) return 'Por favor, diminua a repetição excessiva de caracteres.';
  else if (!lettersRegex.test(texto)) return 'Por favor, evite escrever apenas números ou símbolos.';
  else return '';
};

// Login agora valida CPF em vez de email
export const validateLogin = (cpf: string, password: string) => {
  const errors: { cpf?: string; password?: string } = {};

  if (!cpf.trim())
    errors.cpf = "O CPF é obrigatório.";
  else if (!validateCPF(cpf))
    errors.cpf = "CPF inválido.";

  if (!password.trim())
    errors.password = "A senha é obrigatória.";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePatientRegistration = (data: {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
}) => {
  const errors: { [key: string]: string } = {};

  if (!data.nome?.trim()) {
    errors.nome = "Nome é obrigatório";
  }

  if (!data.cpf?.trim()) {
    errors.cpf = "CPF é obrigatório";
  } else if (data.cpf.replace(/\D/g, "").length !== 11) {
    errors.cpf = "CPF deve ter 11 dígitos";
  }

  if (!data.email?.trim()) {
    errors.email = "Email é obrigatório";
  } else if (!validateEmail(data.email)) {
    errors.email = "Email inválido";
  }

  if (!data.telefone?.trim()) {
    errors.telefone = "Telefone é obrigatório";
  } else if (data.telefone.replace(/\D/g, "").length < 10) {
    errors.telefone = "Telefone inválido";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};