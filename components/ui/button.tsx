import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    children,
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `${baseClass}--${variant}`;
    const sizeClass = `${baseClass}--${size}`;
    const fullWidthClass = fullWidth ? `${baseClass}--full-width` : '';

    const combinedClasses = [
        baseClass,
        variantClass,
        sizeClass,
        fullWidthClass,
        className
    ].filter(Boolean).join(' ');

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;
