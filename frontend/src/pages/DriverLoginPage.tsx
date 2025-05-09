// src/pages/DriverLoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Please enter your password." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DriverLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.message || "Login failed");
      }

      const { user, token } = await res.json();

      // Persist auth state
      localStorage.setItem("token", token);
      localStorage.setItem("driverLoggedIn", "true");
      localStorage.setItem("driverData", JSON.stringify(user));

      toast({
        title: "Welcome back!",
        description: `You have successfully logged in as ${user.firstName}.`,
      });

      // Redirect to profile page instead of dashboard
      navigate("/driver/profile");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      console.error("Login error:", err);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 p-4 bg-background z-10 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Driver Login</h1>
        </div>
      </div>

      <div className="flex-1 container max-w-md mx-auto pt-20 pb-10 px-4 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Log in to continue driving with Uber
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        autoComplete="email"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button
                variant="link"
                type="button"
                onClick={() => navigate("/driver/forgot-password")}
                className="p-0 text-sm"
              >
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>

            <p className="text-center text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                type="button"
                onClick={() => navigate("/driver/signup")}
                className="p-0"
              >
                Sign up
              </Button>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
