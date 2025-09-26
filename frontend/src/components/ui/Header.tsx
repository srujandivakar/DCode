import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { LogoutUser } from "@/redux/slices/auth/authThunks";
import { ToastError, ToastSuccess } from "@/utils/ToastContainers";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClipLoader } from "react-spinners";
import { TbFlame, TbFlameFilled } from "react-icons/tb";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const Header = ({ children }: React.PropsWithChildren) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!userData && isAuthenticated) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ClipLoader size={50} color="#4F46E5" />
      </div>
    );
  }
  const logout = async () => {
    try {
      const result = await dispatch(LogoutUser()).unwrap();
      ToastSuccess(result);
    } catch (error: any) {
      ToastError(
        error || error?.response?.data?.message || "Something went wrong"
      );
    }
  };
  return (
    <>
     <nav className="text-white flex flex-row justify-between px-4 md:px-8 py-4 h-14 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-md bg-black/70">          <div className="flex flex-row gap-5 items-center">
          <Link to="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">&lt;/&gt;</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                DCode
              </span>
            </div>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              to="/problemset"
              className="hover:text-blue-400 transition-colors"
            >
              Problems
            </Link>

            <Link
              to="/discuss"
              className="hover:text-blue-400 transition-colors"
            >
              Discuss
            </Link>

            <Link to="/my-list" className="hover:text-blue-400 transition-colors">
              Sheets
            </Link>

            <Link to="/contest" className="hover:text-blue-400 transition-colors">
              Contests
            </Link>

            {/*  <Link
              to="/pricing"
              className="hover:text-blue-400 transition-colors"
            >
              Pricing
            </Link> */}
          </div>
        </div>
        {children && <div className="mr-36 -mt-2">{children}</div>}

        <div  className="flex flex-row items-center gap-5 mr-3">
           <Link to="/profile" className="flex flex-row items-center gap-5">
          {userData && userData?.dailyProblemStreak > 0 ? (
            <div className="flex gap-1">
              <TbFlameFilled
                className="text-blue-400 mt-1"
                size={18}
                data-tip="daily streak"
              />
              <span>{userData?.dailyProblemStreak}</span>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1 items-center">
                  <TbFlame className="text-white mt-1" size={18} />
                  <span>{userData?.dailyProblemStreak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-neutral-800 px-2.5 text-sm  py-2 mt-1 text-white leading-tight whitespace-nowrap">
                Solve one problem daily to refresh the streak
              </TooltipContent>
            </Tooltip>
          )}
          </Link>

            <Link to="/about" className="hover:text-blue-400 transition-colors">
              About
            </Link>

          {userData?.role === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className="bg-white text-neutral-950 font-semibold  border border-neutral-700 text-sm px-2.5 hover:bg-neutral-200 hover:border-neutral-900 rounded-lg py-1.5 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {userData ? (
            // <img src={user?.avatar} alt="User Avatar" className="h-12 w-12 rounded-full" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0 border-none">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback className="text-black font-semibold text-xl bg-white">
                      {userData?.fullName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-black/80 text-white border border-neutral-800 z-50 mt-3 mr-5 w-64 p-3 rounded-lg shadow-lg">
                <div className="mb-3 border-b border-neutral-700 pb-3">
                  <p className="text-white font-semibold text-base truncate">
                    {userData.fullName}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {userData.email}
                  </p>
                </div>
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>

                {/* <Link to="/my-list">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <List className="w-4 h-4" />
                    My List
                  </DropdownMenuItem>
                </Link> */}

                <DropdownMenuItem
                  onClick={() => logout()}
                  className="cursor-pointer gap-2 text-red-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                className="text-blue-50 bg-transparent px-6 cursor-pointer border-zinc-100 hover:bg-zinc-100 hover:text-zinc-900"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
      {isAuthenticated && !userData?.isEmailVerified && (
        <div className="w-full bg-gradient-to-r from-cyan-900 via-blue-700 to-cyan-900 text-white text-center text-sm py-1.5 shadow-sm">
          📩 We’ve sent a verification email. Please verify your email to
          continue.
        </div>
      )}
    </>
  );
};
