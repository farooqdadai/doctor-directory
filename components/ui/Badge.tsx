interface BadgeProps {
  variant?: 'default' | 'featured' | 'verified' | 'specialty';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    featured: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    specialty: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
