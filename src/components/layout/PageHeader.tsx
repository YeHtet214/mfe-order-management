import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1.5 text-sm text-gray-500 font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-blue-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-gray-500 font-medium">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
