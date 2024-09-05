import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";

interface FormProps {
  form: any;
  name: string;
  label: string;
  required?: boolean;
}

export const Password = ({ form, name, label, required = true }: FormProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-400"> *</span>}
          </FormLabel>
          <FormControl>
            <div className="relative flex items-center">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="***********"
                {...field}
              />
              <button
                type="button"
                className="absolute right-3 focus:outline-none"
                onClick={handleTogglePassword}
              >
                {showPassword ? (
                  <Eye className="text-gray-500" size={16} />
                ) : (
                  <EyeOff className="text-gray-500" size={16} />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage className="text-red-500 text-sm mt-1" />
        </FormItem>
      )}
    />
  );
};
