import { Link } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/admin/create-test" 
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Create Test</h2>
            <p className="text-gray-600">Create a new programming test with multiple questions and settings</p>
          </Link>
          
          <Link to="/admin/create-question" 
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Create Question</h2>
            <p className="text-gray-600">Add new programming questions to the question bank</p>
          </Link>
          
          <Link to="/admin/questions" 
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Question Bank</h2>
            <p className="text-gray-600">View and manage all available programming questions</p>
          </Link>
          
          <Link to="/admin/tests" 
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Test Management</h2>
            <p className="text-gray-600">View and manage active and past tests</p>
          </Link>

          <Link to="/admin/leaderboard" 
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Leaderboard</h2>
            <p className="text-gray-600">View the leaderboard for all programming tests</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
