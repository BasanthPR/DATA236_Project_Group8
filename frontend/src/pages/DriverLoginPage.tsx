
import { useState } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Please enter your password.",
  }),
});

const DriverLoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // In a real app, this would validate against an API
      console.log("Login attempt:", values);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, we'll just check if the driver data exists
      const driverData = localStorage.getItem('driverData');
      if (!driverData) {
        throw new Error("No driver account found. Please sign up first.");
      }

      const driver = JSON.parse(driverData);
      if (driver.email !== values.email) {
        throw new Error("Invalid email or password.");
      }

      // In a real app, we would validate the password with bcrypt
      // Here we're just checking if the email matches for demo purposes
      
      localStorage.setItem('driverLoggedIn', 'true');
      
      toast({
        title: "Welcome back!",
        description: `You have successfully logged in as ${driver.firstName}.`,
      });
      
      navigate('/driver/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password.",
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
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Driver Login</h1>
        </div>
      </div>

      <div className="flex-1 container max-w-md mx-auto pt-20 pb-10 px-4 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Log in to continue driving with Uber</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      autoComplete="email"
                      {...field} 
                    />
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
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      autoComplete="current-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button 
                variant="link" 
                type="button" 
                onClick={() => navigate('/driver/forgot-password')}
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
                onClick={() => navigate('/driver/signup')}
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
};

export default DriverLoginPage;
