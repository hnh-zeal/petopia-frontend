import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Star,
  Scissors,
  PawPrint,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type GroomingPackage = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  rating: number;
  duration: number;
};

export const groomingPackages: GroomingPackage[] = [
  {
    id: "basic",
    name: "Basic Grooming",
    description: "Includes bathing, brushing, and basic nail trim",
    price: 50,
    icon: <PawPrint className="h-6 w-6" />,
    rating: 4.5,
    duration: 60,
  },
  {
    id: "haircut",
    name: "Haircut & Styling",
    description: "Full grooming service with breed-specific haircut",
    price: 75,
    icon: <Scissors className="h-6 w-6" />,
    rating: 4.8,
    duration: 90,
  },
  {
    id: "advanced",
    name: "Advanced Grooming",
    description: "Premium package including spa treatments",
    price: 100,
    icon: <Sparkles className="h-6 w-6" />,
    rating: 4.9,
    duration: 120,
  },
];

export const addOns = [
  { id: "flea", name: "Flea Treatment", price: 15 },
  { id: "teeth", name: "Teeth Brushing", price: 10 },
  { id: "nails", name: "Nail Clipping", price: 5 },
  { id: "coat", name: "Coat conditioning treatments", price: 20 },
];

export const groomers = [
  { id: "alice", name: "Alice", rating: 4.9 },
  { id: "bob", name: "Bob", rating: 4.7 },
  { id: "charlie", name: "Charlie", rating: 4.8 },
];

export default function PetGroomingBooking() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [petInfo, setPetInfo] = useState({
    name: "",
    type: "",
    breed: "",
    size: "",
    age: "",
    healthConditions: "",
  });
  const [selectedGroomer, setSelectedGroomer] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    calculateTotal(packageId, selectedAddOns);
  };

  const handleAddOnToggle = (addOnId: string) => {
    const updatedAddOns = selectedAddOns.includes(addOnId)
      ? selectedAddOns.filter((id) => id !== addOnId)
      : [...selectedAddOns, addOnId];
    setSelectedAddOns(updatedAddOns);
    calculateTotal(selectedPackage, updatedAddOns);
  };

  const calculateTotal = (packageId: string | null, addOns: any[]) => {
    const packagePrice =
      groomingPackages.find((pkg) => pkg.id === packageId)?.price || 0;
    const addOnsPrice = addOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    setTotalPrice(packagePrice + addOnsPrice);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Select Grooming Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groomingPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all ${selectedPackage === pkg.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      {pkg.icon}
                      <Badge variant="secondary" className="text-sm">
                        <Star className="h-4 w-4 fill-primary mr-1" />
                        {pkg.rating}
                      </Badge>
                    </div>
                    <CardTitle>{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">฿{pkg.price}</p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {pkg.duration} minutes
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={
                        selectedPackage === pkg.id ? "default" : "outline"
                      }
                      className="w-full"
                    >
                      {selectedPackage === pkg.id ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Add-ons</h3>
              {addOns.map((addOn) => (
                <div key={addOn.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={addOn.id}
                    checked={selectedAddOns.includes(addOn.id)}
                    onCheckedChange={() => handleAddOnToggle(addOn.id)}
                  />
                  <label
                    htmlFor={addOn.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {addOn.name} (฿{addOn.price})
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Pet Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="petName">Pet Name</Label>
                <Input
                  id="petName"
                  value={petInfo.name}
                  onChange={(e) =>
                    setPetInfo({ ...petInfo, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="petType">Pet Type</Label>
                <Select
                  onValueChange={(value) =>
                    setPetInfo({ ...petInfo, type: value })
                  }
                >
                  <SelectTrigger id="petType">
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="petBreed">Breed</Label>
                <Input
                  id="petBreed"
                  value={petInfo.breed}
                  onChange={(e) =>
                    setPetInfo({ ...petInfo, breed: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="petSize">Size</Label>
                <RadioGroup
                  onValueChange={(value) =>
                    setPetInfo({ ...petInfo, size: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Small</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Large</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="petAge">Age</Label>
                <Input
                  id="petAge"
                  type="number"
                  value={petInfo.age}
                  onChange={(e) =>
                    setPetInfo({ ...petInfo, age: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthConditions">Health Conditions</Label>
                <Textarea
                  id="healthConditions"
                  value={petInfo.healthConditions}
                  onChange={(e) =>
                    setPetInfo({ ...petInfo, healthConditions: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              Schedule Appointment
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Groomer</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {groomers.map((groomer) => (
                    <Card
                      key={groomer.id}
                      className={`cursor-pointer transition-all ${selectedGroomer === groomer.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedGroomer(groomer.id)}
                    >
                      <CardHeader>
                        <CardTitle>{groomer.name}</CardTitle>
                        <CardDescription>
                          <Star className="h-4 w-4 inline-block mr-1" />
                          {groomer.rating}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Select Time</Label>
                <Select onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="13:00">01:00 PM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">
                  Special Instructions
                </Label>
                <Textarea
                  id="specialInstructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or instructions for the groomer"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Booking Summary</h2>
            <Card>
              <CardHeader>
                <CardTitle>Selected Package</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {
                    groomingPackages.find((pkg) => pkg.id === selectedPackage)
                      ?.name
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  ฿
                  {
                    groomingPackages.find((pkg) => pkg.id === selectedPackage)
                      ?.price
                  }
                </p>
              </CardContent>
            </Card>
            {selectedAddOns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Add-ons</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAddOns.map((addOnId) => {
                    const addOn = addOns.find((a) => a.id === addOnId);
                    return (
                      <div key={addOnId} className="flex justify-between">
                        <span>{addOn?.name}</span>
                        <span>฿{addOn?.price}</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Pet Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Name: {petInfo.name}</p>
                <p>Type: {petInfo.type}</p>
                <p>Breed: {petInfo.breed}</p>
                <p>Size: {petInfo.size}</p>
                <p>Age: {petInfo.age}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Groomer:{" "}
                  {groomers.find((g) => g.id === selectedGroomer)?.name}
                </p>
                <p>Date: {date ? format(date, "PPP") : "Not selected"}</p>
                <p>Time: {time || "Not selected"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Price</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">฿{totalPrice}</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Pet Grooming Service</h1>
        <div className="flex justify-center mt-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-3 h-3 rounded-full mx-1 ${
                step >= stepNumber ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      {renderStep()}
      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <Button onClick={() => setStep(step - 1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} className="ml-auto">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => console.log("Booking submitted")}
            className="ml-auto"
          >
            Confirm Booking
          </Button>
        )}
      </div>
    </div>
  );
}
