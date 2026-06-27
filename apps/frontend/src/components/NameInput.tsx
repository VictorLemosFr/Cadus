import { useRegistrationStore } from "@/store/registrationStore";
import { formatName, sanitizeName } from "@/lib/masks";
import { UserRound } from "lucide-react";

interface Props {
  error: string;
  placeholder: string;
  value: string;
  attribute: string
}

const NameInput = ({ error, placeholder, value, attribute }: Props) => {
  const { updatePatientData } = useRegistrationStore();
  return (
    <div>
      <div className="relative">
        <UserRound
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
        />
        <input
          className="input-cadus pl-12 text-base md:text-lg"
          value={value || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updatePatientData({
              [attribute]: formatName(sanitizeName(e.target.value)),
            })
          }
          placeholder={placeholder}
          autoFocus
        />
      </div>
      {error && <p className="error-text mt-2 ml-2">{error}</p>}
    </div>
  );
};

export default NameInput;
