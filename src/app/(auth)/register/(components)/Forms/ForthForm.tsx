"use client";
/* Utils */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* Components */
import { Card, CardBody, Spinner } from "@nextui-org/react";

/* Types */
import { FormProps } from "../Form";

/* Forth Form: This will display the waiting for validation message to the client */
function ForthForm({ formData, loading, setLoading }: FormProps) {
  const router = useRouter();

  const data: string = JSON.stringify({
    username: formData
      ? `${String(formData.firstName)} ${String(formData.lastName)}`
      : "",
    email: String(formData?.email || ""),
    phone_number: formData?.phone || "",
    gender: String(formData?.gender || ""),
    birthday: String(formData?.dateOfBirth || ""),
    password: String(formData?.password || ""),
    modules_Groups_sessionNumber: formData?.subjects,
    role: String(formData?.role || ""),
    level: formData?.levels[0],
  });

  useEffect(() => {
    const handleRedirect = (path: string) => {
      router.push(path);
    };

    const FetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/addRequest`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });

        const jsonData = await response.json();

        if (response.status === 200) {
          // Success case (handle successful registration)
          setLoading(1);

          setTimeout(() => {
            handleRedirect("/login");
          }, 10000);
        } else if (response.status === 400) {
          // Error case (e.g., email already exists)
          setLoading(2);

          setTimeout(() => {
            handleRedirect("/register");
          }, 10000);
        } else {
          // Handle unexpected status codes
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        setLoading(3);

        setTimeout(() => {
          handleRedirect("/");
        }, 5000);
      }
    };

    FetchData();
  }, [data, router, setLoading]);

  switch (loading) {
    case 0:
      return (
        <div className="w-full mt-8 p-4 lg:p-8 h-full lg:h-4/6 flex item-center justify-center">
          <Spinner size="lg" color="primary" />
        </div>
      );

    case 1:
      return (
        <Card className="w-full mt-8 p-4 lg:p-8 h-full lg:h-4/6">
          <CardBody className="w-full h-full flex items-center justify-center gap-12">
            <div className="w-full flex flex-col justify-center items-start">
              <h1 className="text-3xl ml-6 mb-4">Registration Successful!</h1>
              <p className="text-lg">
                Thank you for registering with us. Your account has been created
                successfully.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h2 className="self-start text-2xl  ml-6 mb-4">
                What&apos;s Next?
              </h2>
              <p className="text-lg lg:indent-10 lg:px-4">
                Our team will now review the information you provided. This
                process usually takes less than 24 hours. Once your account is
                approved, you will receive a confirmation email at the address
                you provided during registration. For now you will be redirected
                to the login page .If you have any urgent inquiries or need
                assistance, feel free to contact us at{" "}
                <span className="italic">contact@skoolify.com</span>. Thank you
                for choosing <span>SKOOLIFY</span>!
              </p>
            </div>
          </CardBody>
        </Card>
      );

    case 2:
      return (
        <div className="w-full h-full flex flex-col items-center justify-center mb-24">
          <h1 className="text-danger font-bold text-3xl text-center">
            This email is already registered!
          </h1>

          <h2 className="text-lg font-semibold text-zinc-700 text-center">
            You will redirected to the register page
          </h2>
        </div>
      );

    case 3:
      return (
        <div className="w-full h-full flex flex-col items-center justify-center mb-24">
          <h1 className="text-danger font-bold text-3xl text-center">
            Internal Server Error
          </h1>

          <h2 className="text-lg font-semibold text-zinc-700 text-center">
            You will redirected to the home page
          </h2>
        </div>
      );
  }
}

export default ForthForm;
