import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full text-red-600 mb-8 animate-bounce">
          <ShieldAlert className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
          Oops! It seems you don't have the required permissions to access this page. 
          Please contact your administrator if you think this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => login()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <LogIn className="w-4 h-4" />
            Sign In Again
          </button>
        </div>
        
        <p className="mt-12 text-sm text-gray-400">
          Error Code: 403 - Forbidden
        </p>
      </div>
    </div>
  );
}
