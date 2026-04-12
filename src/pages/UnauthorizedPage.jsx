export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
      <p className="text-2xl text-gray-600 mb-4">Unauthorized</p>
      <p className="text-gray-500 mb-8">You don't have permission to access this resource.</p>
      <a href="/" className="btn-primary">
        Go Home
      </a>
    </div>
  );
};
