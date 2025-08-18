import React from 'react';

interface FormContainerProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
  left?: string;
  top?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  width = '444px',
  height = '56px',
  left = '155px',
  top = '474px',
  style,
  className = ''
}) => {
  const containerStyles: React.CSSProperties = {
    width,
    height,
    left,
    top,
    ...style,
  };

  return (
    <div style={containerStyles} className={className}>
      {children}
    </div>
  );
}; 