import { Inbox, Calendar, Target, Users, FolderTree } from "lucide-react";
import { NavLink } from "react-router-dom";

function Header() {
  const pages = [
    { id: "inbox", icon: Inbox, label: "Inbox", to: "/inbox" },
    { id: "calendar", icon: Calendar, label: "Calendar", to: "/calendar" },
    { id: "goals", icon: Target, label: "Goals", to: "/goals" },
    {
      id: "references",
      icon: FolderTree,
      label: "References",
      to: "/references",
    },
    { id: "circle", icon: Users, label: "My Circle", to: "my-circle" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center space-x-8">
          {pages.map(({ id, icon: Icon, label, to }) => (
            <NavLink
              key={id}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-3 py-4 text-sm font-medium ${
                  isActive
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
                `
              }
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Header;
