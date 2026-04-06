import React from 'react';
import LaddaButton, { ZOOM_OUT, LaddaButtonProps } from 'react-ladda-button';
import 'react-ladda-button/dist/ladda-themeless.min.css'
import 'primeicons/primeicons.css';
import './ladda-button.css';

export interface CustomLaddaButtonProps extends Omit<LaddaButtonProps, 'loading'> {
    loading: boolean;
    status?: 'idle' | 'success' | 'error';
    label?: string;
    icon?: string;
    className?: string;
    successIcon?: string;
    errorIcon?: string;
    successLabel?: string;
    errorLabel?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
}

export const CustomLaddaButton: React.FC<CustomLaddaButtonProps> = ({
    loading,
    status = 'idle',
    label,
    icon,
    className = '',
    successIcon = 'pi pi-check',
    errorIcon = 'pi pi-times',
    successLabel = 'Success',
    errorLabel = 'Error',
    disabled,
    onClick,
    children,
    ...props
}) => {
    // We construct the className logic here
    const getButtonClass = () => {
        let baseClass = `p-button p-component ladda-button-custom ${className}`;
        
        if (status === 'success') {
            baseClass += ' ladda-button-success';
        } else if (status === 'error') {
            baseClass += ' ladda-button-error';
        }
        
        return baseClass;
    };

    const renderContent = () => {
        if (status === 'success') {
            return (
                <div className="flex align-items-center justify-content-center fade-in-scale">
                    <i className={`${successIcon} status-icon`} />
                    <span className="p-button-label p-c">{successLabel}</span>
                </div>
            );
        }
        
        if (status === 'error') {
            return (
                <div className="flex align-items-center justify-content-center fade-in-scale">
                    <i className={`${errorIcon} status-icon`} />
                    <span className="p-button-label p-c">{errorLabel}</span>
                </div>
            );
        }

        return (
            <div className="flex align-items-center justify-content-center">
                {icon && <i className={`${icon} p-button-icon p-c p-button-icon-left`} />}
                <span className="p-button-label p-c">{label || children}</span>
            </div>
        );
    };

    return (
        <LaddaButton
            loading={loading}
            onClick={onClick}
            data-style={ZOOM_OUT}
            className={getButtonClass()}
            disabled={disabled || loading}
            {...props}
        >
            {renderContent()}
        </LaddaButton>
    );
};
