import { Search, Plus, User, FolderOpen, MoreVertical } from "lucide-react";
import { useState } from "react";

// Types
interface Project {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
}

interface UserType {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

type TabType = "summary" | "list" | "board";

// Mock data
const mockUsers: UserType[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com" },
];

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Project Name",
    description: "A minimal bug tracking project",
    memberIds: ["1", "2", "3"],
  },
  {
    id: "2",
    name: "Mobile App",
    description: "Bug tracking for mobile application",
    memberIds: ["1", "2"],
  },
  {
    id: "3",
    name: "Web Platform",
    description: "Frontend bug tracking",
    memberIds: ["2", "3"],
  },
];

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    ghost:
      "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

// SearchInput Component
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

// UserAvatar Component
interface UserAvatarProps {
  user?: UserType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gray-300 rounded-full flex items-center justify-center ${className}`}
      title={user?.name}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <User size={iconSizes[size]} className="text-gray-600" />
      )}
    </div>
  );
};

export default function Temp() {
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProject, setCurrentProject] = useState<Project>(
    mockProjects[0]
  );
  const [currentUser] = useState<UserType>(mockUsers[0]);

  // Get project members
  const projectMembers = mockUsers.filter((user) =>
    currentProject.memberIds.includes(user.id)
  );

  const handleAddPeople = () => {
    alert("Add people functionality - would open a modal to invite users");
  };

  const handleCreateIssue = () => {
    alert(
      "Create issue functionality - would open a modal or navigate to create page"
    );
  };

  const handleAddProject = () => {
    alert(
      "Add project functionality - would open a modal to create new project"
    );
  };

  // Tab Navigation Component
  const TabNavigation = () => {
    const tabs: { key: TabType; label: string }[] = [
      { key: "summary", label: "Summary" },
      { key: "list", label: "List" },
      { key: "board", label: "Board" },
    ];

    return (
      <div className="flex space-x-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  // Summary Tab Component
  const SummaryTab = () => {
    const stats = { total: 24, open: 8, resolved: 16 };

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Total Issues
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Open Issues
            </h3>
            <p className="text-2xl font-bold text-red-600">{stats.open}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Resolved</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
          </div>
          <div className="p-4">
            <div className="flex -space-x-2">
              {projectMembers.map((member) => (
                <UserAvatar
                  key={member.id}
                  user={member}
                  size="md"
                  className="border-2 border-white"
                />
              ))}
              <button
                onClick={handleAddPeople}
                className="w-8 h-8 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center hover:bg-blue-200 transition-colors"
              >
                <Plus size={14} className="text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // List Tab Component
  const ListTab = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Issues</h3>
          <Button onClick={handleCreateIssue}>New Issue</Button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-center py-12 text-gray-500">
          <p>No issues yet. Create your first issue to get started!</p>
        </div>
      </div>
    </div>
  );

  // Board Tab Component
  const BoardTab = () => {
    const columns = [
      { id: "todo", title: "To Do" },
      { id: "in-progress", title: "In Progress" },
      { id: "done", title: "Done" },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              {column.title}
            </h3>
            <div className="space-y-3">
              <div className="text-center py-8 text-gray-400">
                <p>No issues in {column.title.toLowerCase()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryTab />;
      case "list":
        return <ListTab />;
      case "board":
        return <BoardTab />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <UserAvatar user={currentUser} size="md" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Profile</h3>
              <p className="text-xs text-gray-500">{currentUser.name}</p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Projects</h3>
            <button
              onClick={handleAddProject}
              className="text-gray-400 hover:text-gray-600"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {mockProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setCurrentProject(project)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  currentProject.id === project.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FolderOpen size={16} className="text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          {/* Search Bar */}
          <div className="mb-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search issues..."
              className="max-w-md"
            />
          </div>

          {/* Project Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentProject.name}
              </h1>
              <p className="text-sm text-gray-500">
                {currentProject.description}
              </p>
            </div>

            <Button onClick={handleAddPeople}>
              <Plus size={16} className="mr-2" />
              Add People
            </Button>
          </div>

          {/* Navigation Tabs */}
          <TabNavigation />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}
