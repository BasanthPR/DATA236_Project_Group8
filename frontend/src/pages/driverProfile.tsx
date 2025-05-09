// src/pages/DriverProfilePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  phoneNumber:  z.string().min(1, "Required"),
  address:      z.string().min(1, "Required"),
  city:         z.string().min(1, "Required"),
  state:        z.string().min(1, "Required"),
  zipCode:      z.string().min(1, "Required"),
  carMake:      z.string().min(1, "Required"),
  carModel:     z.string().min(1, "Required"),
  carYear:      z.string().min(1, "Required"),
  plateNumber:  z.string().min(1, "Required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function DriverProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");

  const token      = localStorage.getItem("token") || "";
  const driverData = JSON.parse(localStorage.getItem("driverData") || "{}");
  const { firstName = "", lastName = "", email = "" } = driverData;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber:  "",
      address:      "",
      city:         "",
      state:        "",
      zipCode:      "",
      carMake:      "",
      carModel:     "",
      carYear:      "",
      plateNumber:  "",
    },
  });

  // Load existing profile or enter create mode
  useEffect(() => {
    if (!token) {
      navigate("/driver/login");
      return;
    }

    fetch("http://localhost:4004/api/drivers/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 404) {
          setIsUpdate(false);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        if (data) {
          const cd = data.carDetails ?? {}; // default to empty object
          form.reset({
            phoneNumber: data.phoneNumber  || "",
            address:     data.address      || "",
            city:        data.city         || "",
            state:       data.state        || "",
            zipCode:     data.zipCode      || "",
            carMake:     cd.make           || "",
            carModel:    cd.model          || "",
            carYear:     String(cd.year    ?? ""),
            plateNumber: cd.plateNumber    || "",
          });
          if (data.imageUrl) setExistingPhotoUrl(data.imageUrl);
          setIsUpdate(true);
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Could not load profile";
        console.error("Load profile error:", err);
        toast({ title: "Error", description: message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [token, navigate, form]);

  // Submit create or update
  const onSubmit = async (values: ProfileFormValues) => {
    if (!photoFile && !existingPhotoUrl) {
      toast({
        title: "Photo required",
        description: "Please upload a profile photo.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName",  lastName);
    formData.append("email",     email);

    formData.append("phoneNumber", values.phoneNumber);
    formData.append("address",     values.address);
    formData.append("city",        values.city);
    formData.append("state",       values.state);
    formData.append("zipCode",     values.zipCode);
    formData.append("carDetails.make",       values.carMake);
    formData.append("carDetails.model",      values.carModel);
    formData.append("carDetails.year",       values.carYear);
    formData.append("carDetails.plateNumber",values.plateNumber);

    if (photoFile) formData.append("image", photoFile);

    const url    = "http://localhost:4004/api/drivers/profile";
    const method = isUpdate ? "PATCH" : "POST";

    try {
      let res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      // fallback PATCH on 409
      if (res.status === 409 && method === "POST") {
        res = await fetch(url, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Save failed");
      }

      const updated = await res.json();
      if (updated.imageUrl) setExistingPhotoUrl(updated.imageUrl);

      toast({
        title: isUpdate ? "Profile Updated" : "Profile Created",
        description: "Your driver profile has been saved.",
      });
      setIsUpdate(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      console.error("Save profile error:", err);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading profile…</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 p-4 bg-background z-10 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Driver Profile</h1>
        </div>
      </div>

      <div className="flex-1 container max-w-lg mx-auto pt-20 pb-10 px-4">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">
            {isUpdate ? "Edit Your Profile" : "Complete Your Profile"}
          </h2>
          <p className="text-muted-foreground">
            {firstName} {lastName} • {email}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo upload */}
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setPhotoFile(f);
                  }}
                />
              </FormControl>
              {existingPhotoUrl && !photoFile && (
                <img
                  src={existingPhotoUrl}
                  alt="Profile"
                  className="mt-2 w-24 h-24 object-cover rounded-full"
                />
              )}
            </FormItem>

            {/* Other fields */}
            {[
              { name: "phoneNumber", label: "Phone Number" },
              { name: "address",     label: "Street Address" },
              { name: "city",        label: "City" },
              { name: "state",       label: "State" },
              { name: "zipCode",     label: "Zip Code" },
              { name: "carMake",     label: "Car Make" },
              { name: "carModel",    label: "Car Model" },
              { name: "carYear",     label: "Car Year" },
              { name: "plateNumber", label: "License Plate" },
            ].map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof ProfileFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input placeholder={label} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full py-3">
              {isUpdate ? "Update Profile" : "Save Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
