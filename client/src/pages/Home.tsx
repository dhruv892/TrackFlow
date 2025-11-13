import React, { useEffect } from "react";
import Nav from "../components/Nav";
import { useAuthStore } from "../store/auth";
import { useProjectStore } from "../store/project";
import { useNavigate } from "react-router-dom";
import { useProjectStoreState } from "../store/ui";

const Home: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { allProjects, createdByMe, memberOf, isLoading, fetchAllProjects } =
    useProjectStore();

  const setCurrentProjectId = useProjectStoreState(
    (state) => state.setCurrentProjectId
  );

  const navigate = useNavigate();

  // Fetch projects once user is known and authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAllProjects(user.id);
    }
  }, [isAuthenticated, user, fetchAllProjects]);

  if (!isAuthenticated) {
    // Or redirect to login
    return <div>Please log in to see your projects.</div>;
  }

  if (isLoading) {
    return <div>Loading your projects...</div>;
  }

  const handleProjectOnClick = (id: number) => {
    setCurrentProjectId(id);
    navigate("/dashboard");
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col border-2 rounded-md p-2 border-gray-700">
        <Nav />

        <div>
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {user?.name || user?.email}!
          </h1>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Projects Created By You
          </h2>
          {createdByMe.length === 0 ? (
            <p>No projects created by you.</p>
          ) : (
            <div className="grid grid-cols-1 cursor-pointer  sm:grid-cols-2 md:grid-cols-3 gap-4">
              {createdByMe.map((project) => (
                <div
                  key={project.id}
                  className="border-2 hover:bg-gray-900 rounded-md mb-2 p-2 border-gray-700"
                  onClick={() => handleProjectOnClick(project.id)}
                >
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            Projects You're a Member Of
          </h2>
          {memberOf.length === 0 ? (
            <p>You are not a member of any projects.</p>
          ) : (
            <div className="grid grid-cols-1 cursor-pointer  sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memberOf.map((project) => (
                <div
                  className="border-2 hover:bg-gray-900 rounded-md mb-2 p-2 border-gray-700"
                  onClick={handleProjectOnClick}
                >
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
