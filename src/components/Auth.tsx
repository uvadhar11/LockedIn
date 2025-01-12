// import React, { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { Lock, Mail } from "lucide-react";

// interface AuthProps {
//   onAuthSuccess: () => void;
// }

// export function Auth({ onAuthSuccess }: AuthProps) {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const { error: authError } = isSignUp
//         ? await supabase.auth.signUp({
//             email,
//             password,
//           })
//         : await supabase.auth.signInWithPassword({
//             email,
//             password,
//           });

//       if (authError) throw authError;
//       onAuthSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <div className="w-12 h-12 rounded-full bg-indigo-600 mx-auto flex items-center justify-center">
//             <Lock className="h-6 w-6 text-white" />
//           </div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             {isSignUp ? "Create your account" : "Sign in to your account"}
//           </h2>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
//               {error}
//             </div>
//           )}

//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email-address" className="sr-only">
//                 Email address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email-address"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Email address"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Password"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Processing..." : isSignUp ? "Sign up" : "Sign in"}
//             </button>
//           </div>

//           <div className="text-sm text-center">
//             <button
//               type="button"
//               onClick={() => setIsSignUp(!isSignUp)}
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               {isSignUp
//                 ? "Already have an account? Sign in"
//                 : "Don't have an account? Sign up"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
