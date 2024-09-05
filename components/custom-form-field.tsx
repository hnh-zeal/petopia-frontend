/* eslint-disable no-unused-vars */
import { E164Number } from "libphonenumber-js/core";
// import ReactDatePicker from "react-datepicker";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

export enum FormFieldType {
  INPUT = "input",
  NUMBER = "number",
  EMAIL = "email",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  IMAGE = "image",
  TIME = "time",
  ARRAY = "array",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  required?: boolean;
  isDisabled?: boolean;
  value?: string;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <Input type="input" placeholder={props.placeholder} {...field} />
        </FormControl>
      );
    case FormFieldType.NUMBER:
      return (
        <FormControl>
          <Input type="number" placeholder={props.placeholder} {...field} />
        </FormControl>
      );
    case FormFieldType.EMAIL:
      return (
        <FormControl>
          <Input type="email" placeholder={props.placeholder} {...field} />
        </FormControl>
      );
    case FormFieldType.PASSWORD:
      return (
        <FormControl>
          <div className="flex flex-row">
            <Input type="password" placeholder={props.placeholder} {...field} />
          </div>
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea h-28"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.IMAGE:
      return (
        <FormControl>
          <Input
            type="file"
            multiple
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea hover:cursor-pointer"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.TIME:
      return (
        <FormControl>
          <Input
            type="time"
            multiple
            placeholder={props.placeholder}
            {...field}
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="flex flex-row p-2 h-10 w-full rounded-md border border-input input-phone"
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-3">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <div className="space-y-1 leading-normal  ">
              <FormLabel>{props.label}</FormLabel>
            </div>
            {/* <Label
              htmlFor={props.name}
              className="checkbox-label leading-normal"
            >
              {props.label}
            </Label> */}
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <FormControl>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[285px] px-4 py-2 text-left font-normal",
                  !field.value && "text-gray-400"
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    // case FormFieldType.ARRAY:
    //   const { fields, append, remove } = useFieldArray({
    //     control,
    //     name,
    //   });

    //   return (
    //     <FormControl>
    //       {fields.map((item, index) => (
    //         <div key={item.id} className="flex items-center gap-2">
    //           <Input
    //             placeholder={props.placeholder}
    //             {...field}
    //             defaultValue={item.value}
    //           />
    //           <Button type="button" onClick={() => remove(index)}>
    //             Remove
    //           </Button>
    //         </div>
    //       ))}
    //       <Button type="button" onClick={() => append({ value: "" })}>
    //         Add {props.label}
    //       </Button>
    //     </FormControl>
    //   );

    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, isDisabled, name, label, required } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">
              {label}{" "}
              {required ? <span className="text-red-400">*</span> : <></>}
            </FormLabel>
          )}
          {isDisabled ? (
            <Input disabled type={props.fieldType} placeholder={props.value} />
          ) : (
            <RenderInput field={field} props={props} />
          )}
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
