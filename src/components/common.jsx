export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export const FormInput = ({
  label,
  error,
  touched,
  required = false,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={`input-field ${
          touched && error ? 'border-red-500 focus:ring-red-100' : ''
        }`}
        {...props}
      />
      {touched && error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export const FormSelect = ({
  label,
  options,
  error,
  touched,
  required = false,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className={`input-field ${
          touched && error ? 'border-red-500 focus:ring-red-100' : ''
        }`}
        {...props}
      >
        <option value="">Select {label?.toLowerCase()}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {touched && error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export const FormTextarea = ({
  label,
  error,
  touched,
  required = false,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className={`input-field resize-none ${
          touched && error ? 'border-red-500 focus:ring-red-100' : ''
        }`}
        rows="4"
        {...props}
      />
      {touched && error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

export const Badge = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
  };

  return <span className={`badge ${variants[variant]}`}>{children}</span>;
};

export const Loading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

export const EmptyState = ({ message = 'No data found' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

export const ErrorAlert = ({ message, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-start">
    <p className="text-red-800">{message}</p>
    {onClose && (
      <button
        onClick={onClose}
        className="text-red-600 hover:text-red-800 font-bold"
      >
        ×
      </button>
    )}
  </div>
);

export const SuccessAlert = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-start">
    <p className="text-green-800">{message}</p>
    {onClose && (
      <button
        onClick={onClose}
        className="text-green-600 hover:text-green-800 font-bold"
      >
        ×
      </button>
    )}
  </div>
);
