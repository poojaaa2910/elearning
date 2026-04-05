const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  const hoverClass = hover ? 'hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500 cursor-pointer transform hover:-translate-y-1' : '';
  
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all duration-300 ${hoverClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-100 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

export default Card;