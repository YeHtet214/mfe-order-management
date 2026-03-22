import { ShieldAlert, Mail, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface AccessDeniedProps {
	message?: string;
}

export function AccessDenied({ message = "You do not have permission to access this resource." }: AccessDeniedProps) {
	const { permissions, role } = useAuth();

	return (
		<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden font-sans">
			<div className="p-8 md:p-12 text-center border-b border-gray-50 bg-slate-50/50">
				<div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl text-red-600 mb-6">
					<ShieldAlert className="w-10 h-10" />
				</div>
				<h2 className="text-2xl font-black text-gray-900 mb-3">Access Restricted</h2>
				<p className="text-gray-600 max-w-md mx-auto leading-relaxed">
					{message}
				</p>
			</div>

			<div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
				<div className="space-y-6 text-left">
					<div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-widest text-xs">
						<Lock className="w-4 h-4 text-blue-600" />
						Your Current Permissions
					</div>
					
					<div className="space-y-4">
						<div className="flex flex-col gap-1">
							<span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Role</span>
							<span className="text-sm font-bold text-gray-900 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 w-fit">
								{role?.name || "No Role Assigned"}
							</span>
						</div>

						<div className="space-y-2">
							<span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Capabilities</span>
							{permissions.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{permissions.map((permission) => (
										<span 
											key={permission} 
											className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-md border border-gray-200"
										>
											{permission}
										</span>
									))}
								</div>
							) : (
								<p className="text-xs text-gray-500 italic italic">No permissions granted to your account.</p>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-6 text-left p-6 bg-slate-50 rounded-2xl border border-slate-100">
					<div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-widest text-xs">
						<Mail className="w-4 h-4 text-blue-600" />
						Need Access?
					</div>
					
					<div className="space-y-4">
						<p className="text-sm text-gray-600 leading-relaxed font-medium">
							If you believe you should have access to this page, please contact the system administrator to request additional permissions.
						</p>
						
						<div className="pt-2">
							<a 
								href="mailto:admin@example.com" 
								className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
							>
								Contact Administrator
							</a>
						</div>
					</div>
				</div>
			</div>
			
			<div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
				<p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Error Code: 403 Forbidden</p>
			</div>
		</div>
	);
}
