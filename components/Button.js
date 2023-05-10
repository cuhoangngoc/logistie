const Button = ({ children, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2 mr-2 rounded-full px-5 py-2.5 text-center text-sm font-medium text-white transition-all duration-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
