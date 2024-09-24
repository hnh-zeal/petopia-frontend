"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ISelectProps {
  values: Array<{ id: string; name: string }>;
  onChange: (value: string[]) => void;
  value: string[];
}

export default function MultiSelect({ values, onChange, value }: ISelectProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(value || []);

  useEffect(() => {
    setSelectedItems(value || []);
  }, [value]);

  const handleSelectChange = (item: string) => {
    const updatedItems = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];
    setSelectedItems(updatedItems);
    onChange(updatedItems);
  };

  const isOptionSelected = (item: string): boolean => {
    return selectedItems.includes(item);
  };

  const removeItem = (item: string) => {
    const updatedItems = selectedItems.filter((i) => i !== item);
    setSelectedItems(updatedItems);
    onChange(updatedItems);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start font-normal"
        >
          {selectedItems.length > 0 ? (
            <div className="flex flex-wrap gap-1 items-center">
              {selectedItems.map((item) => (
                <Badge key={item} variant="secondary" className="mr-1">
                  {values.find((v) => v.id === item)?.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item);
                    }}
                  >
                    {/* <X className="h-3 w-3" /> */}
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <span>Select Services</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {values.map((value) => (
          <DropdownMenuCheckboxItem
            key={value.id}
            checked={isOptionSelected(value.id)}
            onCheckedChange={() => handleSelectChange(value.id)}
          >
            {value.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
