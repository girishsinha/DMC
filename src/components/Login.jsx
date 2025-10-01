import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { InputOTPForm } from "./InputOTPForm";

function Login() {
  const [otpSent, setOtpSent] = useState(false);
  console.log(otpSent);

  return (
    <Card className="w-full max-w-sm ">
      {otpSent ? (
        <InputOTPForm />
      ) : (
        <>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your mobile number below to login to your account
            </CardDescription>
            <CardAction>
              {/* <Button variant="link">Sign Up</Button> */}
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Mobile Number</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="91xxxxxxxx"
                    required
                  />
                </div>
                <CardDescription className="text-destructive text-sm">
                  Enter your mobile number below to login to your account
                </CardDescription>
                {/* <div className="grid gap-2"> */}
                {/* <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required /> */}
                {/* </div> */}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={() => setOtpSent(!otpSent)}
            >
              Login
            </Button>
            {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
          </CardFooter>
        </>
      )}
    </Card>
  );
}

export default Login;
