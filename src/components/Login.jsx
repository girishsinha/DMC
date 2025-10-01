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
  const [number, setNumber] = useState("");
  const [msg, setMsg] = useState(null);

  const sendOtp = (e) => {
    e.preventDefault();
    fetch("https://apis.allsoft.co/api/documentManagement//generateOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile_number: "6267768654",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send OTP");
        }
        return response.json();
      })
      .then((data) => {
        setOtpSent(data.status);
        setMsg(data.data);
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
      });
  };

  return (
    <Card className="w-full max-w-sm ">
      {otpSent ? (
        <InputOTPForm setOtpSent={setOtpSent} number={number} />
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
            <form onSubmit={sendOtp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="number">Mobile Number</Label>
                  <Input
                    id="number"
                    type="text"
                    placeholder="91xxxxxxxx"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                <CardDescription className="text-destructive text-sm">
                  {msg}
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
              onClick={sendOtp}
              disabled={number.length !== 10}
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
