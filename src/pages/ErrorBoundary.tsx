import React, { Component, ReactNode } from "react";
import FallbackScreen from "./FullbackScreen";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload(); // Simple retry logic, you can enhance this
  };

  render() {
    if (this.state.hasError) {
      return <FallbackScreen message={this.state.error?.message || "Unknown error"} retry={this.retry} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;