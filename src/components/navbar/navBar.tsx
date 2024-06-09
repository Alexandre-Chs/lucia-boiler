import React from "react";
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import Link from "next/link";
import { validateRequest } from "@/lib/auth/validate-request";
import SignOut from "../auth/SignOut";

const NavBar = async () => {
  const { user } = await validateRequest();

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <SignOut />
      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link className="mr-6 hidden lg:flex" href="#"></Link>
          <div className="flex flex-col py-6 gap-y-6">
            {user ? (
              <div className="w-full block items-center py-2 text-lg font-semibold bg-transparent text-black border-2 border-black rounded-md text-center h-[44px]">
                <SignOut />
              </div>
            ) : (
              <Link
                className="w-full block items-center py-2 text-lg font-semibold bg-transparent text-black border-2 border-black rounded-md text-center h-[44px]"
                href="/login"
              >
                Log in
              </Link>
            )}

            <Link
              className="w-full block items-center py-2 text-lg font-semibold bg-blueHighlight text-white rounded-md text-center h-[44px]"
              href="/signup"
            >
              Sign up
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link className="mr-6 hidden lg:flex" href="/">
        <h1 className="text-2xl font-semibold">My setup</h1>
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6">
        {user ? (
          <div className="flex items-center justify-center">
            <SignOut username={user.username} />
          </div>
        ) : (
          <Link
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 "
            href="/login"
          >
            Log in
          </Link>
        )}

        <Link
          className="group inline-flex h-9 w-max items-center font-medium justify-center rounded-md text-white bg-blueHighlight px-4 py-2 text-sm transition-colors hover:bg-blue-400 hover:text-white focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
          href="/signup"
        >
          Sign up
        </Link>
      </nav>
    </header>
  );
};

export default NavBar;

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
