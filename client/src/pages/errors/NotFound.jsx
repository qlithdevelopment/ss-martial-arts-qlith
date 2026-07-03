import { Link } from "react-router-dom";
import Ninja from "../../components/ui/Ninja";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-full">
        <div className="w-36 h-36 mx-auto">
          <Ninja />
        </div>

        <h1 className="text-7xl font-extrabold text-gray-900">404</h1>

        <h2 className="mt-3 text-2xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>

        <p className="mt-2 text-gray-500 leading-7">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center mt-8 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
