export default function SetupHandlesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Enter Your Coding Handles
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Add your usernames for coding platforms so we can track rankings.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="LeetCode Username"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Codeforces Handle"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="CodeChef ID"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Save Handles
          </button>
        </form>
      </div>
    </div>
  );
}
