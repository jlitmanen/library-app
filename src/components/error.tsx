import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Virhe virherajassa:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Jotain meni pieleen.</h2>
          <p>Virhe: {this.state.error?.message}</p>
          {this.state.errorInfo && <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo.componentStack}
          </details>}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;